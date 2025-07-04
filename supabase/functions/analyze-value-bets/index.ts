
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { bookmakerOdds, estimatedWinPercentage, betType, team1, team2, league, sportsbook, oddsData } = await req.json();

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const decimalOdds = parseFloat(bookmakerOdds);
    const impliedProbability = (1 / decimalOdds) * 100;
    const valuePercentage = estimatedWinPercentage - impliedProbability;

    // Use OpenAI to analyze the value bet with real market data
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert sports betting analyst. Analyze the given betting scenario and provide insights on value betting opportunities.'
          },
          {
            role: 'user',
            content: `
              Analyze this ${league} betting opportunity:
              
              Bet Details:
              - Type: ${betType}
              - Bookmaker Odds: ${bookmakerOdds} (${impliedProbability.toFixed(1)}% implied probability)
              - Your Estimated Win Probability: ${estimatedWinPercentage}%
              - Calculated Value: ${valuePercentage.toFixed(1)}%
              
              Market Data: ${JSON.stringify(oddsData, null, 2)}
              
              Based on this information, provide a confidence score (0-100) and reasoning for whether this represents a value betting opportunity.
            `
          }
        ],
        temperature: 0.3,
      }),
    });

    const aiData = await response.json();
    const aiAnalysis = aiData.choices[0].message.content;

    // Extract confidence score from AI response (simple pattern matching)
    const confidenceMatch = aiAnalysis.match(/confidence[:\s]*(\d+)/i);
    const aiConfidence = confidenceMatch ? parseInt(confidenceMatch[1]) : Math.min(95, Math.max(60, 70 + Math.abs(valuePercentage)));

    let recommendation: 'VALUE' | 'NO_VALUE' | 'AVOID';
    if (valuePercentage > 5) {
      recommendation = 'VALUE';
    } else if (valuePercentage < -5) {
      recommendation = 'AVOID';
    } else {
      recommendation = 'NO_VALUE';
    }

    const result = {
      valuePercentage,
      impliedProbability,
      estimatedProbability: estimatedWinPercentage,
      recommendation,
      confidence: aiConfidence,
      reasoning: aiAnalysis
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-value-bets function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
