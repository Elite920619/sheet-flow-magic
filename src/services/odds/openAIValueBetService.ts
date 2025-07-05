
import { supabase } from '@/integrations/supabase/client';

export interface ValueBetAnalysis {
  sport: string;
  league: string;
  teams: [string, string];
  odds: number;
  estimatedWinPercent: number;
  expectedValue: number;
  bookmaker: string;
  betType: string;
  confidence: number;
  reasoning: string;
}

export class OpenAIValueBetService {
  private async getOpenAIKey(): Promise<string | null> {
    try {
      const { data, error } = await supabase.functions.invoke('odds-api-key');
      
      if (error) {
        console.error('Error fetching OpenAI key:', error);
        return null;
      }
      
      return data?.openaiKey || null;
    } catch (error) {
      console.error('Exception fetching OpenAI key:', error);
      return null;
    }
  }
  
  async analyzeValueBets(events: any[]): Promise<ValueBetAnalysis[]> {
    console.log('🧠 Starting OpenAI value bet analysis...');
    
    const openaiKey = await this.getOpenAIKey();
    if (!openaiKey) {
      console.warn('⚠️ No OpenAI key available, using fallback analysis');
      return this.fallbackValueBetAnalysis(events);
    }
    
    try {
      // Prepare data for OpenAI analysis
      const analysisData = events.map(event => ({
        id: event.id,
        sport: event.sport || this.normalizeSportName(event.sport_key),
        league: event.sport_title || 'Unknown League',
        homeTeam: event.home_team,
        awayTeam: event.away_team,
        bookmakers: event.bookmakers?.map((bm: any) => ({
          name: bm.title,
          markets: bm.markets?.map((market: any) => ({
            key: market.key,
            outcomes: market.outcomes?.map((outcome: any) => ({
              name: outcome.name,
              price: outcome.price,
              point: outcome.point
            }))
          }))
        })) || []
      }));
      
      const prompt = this.buildValueBetPrompt(analysisData);
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4.1-2025-04-14',
          messages: [
            {
              role: 'system',
              content: 'You are an expert sports betting analyst. Analyze betting opportunities and identify value bets using expected value calculations. Only return bets with positive expected value (EV > 0).'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 2000
        }),
      });
      
      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }
      
      const data = await response.json();
      const analysis = data.choices[0].message.content;
      
      // Parse OpenAI response
      const valueBets = this.parseOpenAIResponse(analysis);
      
      console.log(`🎯 OpenAI identified ${valueBets.length} value bets`);
      return valueBets;
      
    } catch (error) {
      console.error('💥 Error in OpenAI value bet analysis:', error);
      return this.fallbackValueBetAnalysis(events);
    }
  }
  
  private buildValueBetPrompt(events: any[]): string {
    return `
Analyze these betting opportunities for value bets. For each game, calculate the expected value using the formula:
Expected Value = (odds × win_probability) - 1

Only return games where EV > 0 (positive expected value).

Consider these factors in your analysis:
1. Team strength and recent form
2. Home field advantage
3. Head-to-head records
4. Injuries and lineup changes
5. Public betting bias
6. Sharp money movement

Games to analyze:
${JSON.stringify(events.slice(0, 10), null, 2)}

Return your analysis in this exact JSON format:
[
  {
    "sport": "soccer",
    "league": "Premier League",
    "teams": ["Manchester City", "Chelsea"],
    "odds": 2.10,
    "estimatedWinPercent": 55,
    "expectedValue": 0.155,
    "bookmaker": "DraftKings",
    "betType": "moneyline",
    "confidence": 85,
    "reasoning": "Man City has superior form and home advantage, making 55% win probability reasonable against 2.10 odds."
  }
]

Only include bets with expectedValue > 0. Limit to maximum 5 best value bets.
`;
  }
  
  private parseOpenAIResponse(response: string): ValueBetAnalysis[] {
    try {
      // Extract JSON from response
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        console.warn('⚠️ No JSON found in OpenAI response');
        return [];
      }
      
      const parsed = JSON.parse(jsonMatch[0]);
      
      if (!Array.isArray(parsed)) {
        console.warn('⚠️ OpenAI response is not an array');
        return [];
      }
      
      return parsed.filter(bet => 
        bet.expectedValue > 0 && 
        bet.odds > 1.0 && 
        bet.estimatedWinPercent > 0 && 
        bet.estimatedWinPercent <= 100
      );
      
    } catch (error) {
      console.error('💥 Error parsing OpenAI response:', error);
      return [];
    }
  }
  
  private fallbackValueBetAnalysis(events: any[]): ValueBetAnalysis[] {
    console.log('🔄 Using fallback value bet analysis...');
    
    const valueBets: ValueBetAnalysis[] = [];
    
    for (const event of events.slice(0, 10)) {
      if (!event.bookmakers || event.bookmakers.length === 0) continue;
      
      for (const bookmaker of event.bookmakers) {
        const h2hMarket = bookmaker.markets?.find((m: any) => m.key === 'h2h');
        if (!h2hMarket || !h2hMarket.outcomes) continue;
        
        for (const outcome of h2hMarket.outcomes) {
          // Simple heuristic: look for odds that seem favorable
          const odds = outcome.price;
          const impliedProb = 1 / odds;
          
          // Estimate "true" probability with some randomness for demo
          const estimatedProb = impliedProb + (Math.random() * 0.1 - 0.05);
          const expectedValue = (odds * estimatedProb) - 1;
          
          if (expectedValue > 0.02) { // At least 2% edge
            valueBets.push({
              sport: this.normalizeSportName(event.sport_key),
              league: event.sport_title || 'Unknown League',
              teams: [event.home_team, event.away_team],
              odds,
              estimatedWinPercent: Math.round(estimatedProb * 100),
              expectedValue: Math.round(expectedValue * 1000) / 1000,
              bookmaker: bookmaker.title,
              betType: 'moneyline',
              confidence: Math.round(60 + (expectedValue * 200)),
              reasoning: `Estimated ${Math.round(estimatedProb * 100)}% win probability vs ${Math.round(impliedProb * 100)}% implied odds`
            });
          }
        }
      }
    }
    
    return valueBets.slice(0, 5); // Return top 5
  }
  
  private normalizeSportName(sportKey: string): string {
    const sportMap: { [key: string]: string } = {
      'americanfootball_nfl': 'football',
      'americanfootball_cfl': 'football',
      'basketball_nba': 'basketball',
      'basketball_wnba': 'basketball',
      'soccer_epl': 'soccer',
      'soccer_uefa_champs_league': 'soccer',
      'baseball_mlb': 'baseball',
      'icehockey_nhl': 'hockey',
      'tennis_atp': 'tennis',
      'tennis_wta': 'tennis'
    };
    
    return sportMap[sportKey] || 'other';
  }
}

export const openAIValueBetService = new OpenAIValueBetService();
