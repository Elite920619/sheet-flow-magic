import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { oddsApiClient } from '@/services/odds/apiClient';

export interface ValueBetInput {
  bookmakerOdds: string;
  estimatedWinPercentage: number;
  betType: string;
  team1: string;
  team2: string;
  league: string;
  sportsbook: string;
}

export interface ValueBetResult {
  valuePercentage: number;
  impliedProbability: number;
  estimatedProbability: number;
  recommendation: 'VALUE' | 'NO_VALUE' | 'AVOID';
  confidence: number;
  reasoning: string;
}

export interface FoundValueBet {
  id: string;
  event: string;
  league: string;
  team1: string;
  team2: string;
  betType: string;
  odds: string;
  impliedProb: string;
  aiProb: string;
  value: string;
  confidence: string;
  sportsbook: string;
  timeLeft: string;
  sport: string;
  region: string;
}

export const useValueBetAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ValueBetResult | null>(null);
  const [foundValueBets, setFoundValueBets] = useState<FoundValueBet[]>([]);
  const { toast } = useToast();

  const analyzeValueBets = async (targetOdds: number, estimatedWinProbability: number): Promise<FoundValueBet[]> => {
    setIsAnalyzing(true);
    setFoundValueBets([]);
    
    try {
      console.log(`🎯 Starting comprehensive value bet analysis...`);
      console.log(`Target odds: ${targetOdds}, Estimated win probability: ${estimatedWinProbability}%`);
      
      // Step 1: Fetch all available sports
      const allSports = await oddsApiClient.fetchSportsFromApi();
      const activeSports = allSports.filter(sport => 
        sport.active && 
        !sport.has_outrights &&
        sport.key !== 'politics_us_presidential_election_winner'
      ).slice(0, 10); // Limit to prevent quota issues
      
      console.log(`📊 Found ${activeSports.length} active sports to analyze`);
      
      const regions = ['us', 'uk', 'eu', 'au'];
      const foundBets: FoundValueBet[] = [];
      let totalAnalyzed = 0;
      
      // Step 2: Loop through each sport and region
      for (const sport of activeSports) {
        console.log(`🔍 Analyzing ${sport.title}...`);
        
        for (const region of regions) {
          try {
            const games = await oddsApiClient.fetchOddsFromApi(sport.key, region);
            
            if (games && games.length > 0) {
              console.log(`✅ Found ${games.length} games for ${sport.title} in ${region.toUpperCase()}`);
              
              // Step 3: Analyze each game for value bets
              games.forEach(game => {
                if (!game.bookmakers || game.bookmakers.length === 0) return;
                
                game.bookmakers.forEach((bookmaker: any) => {
                  const h2hMarket = bookmaker.markets?.find((m: any) => m.key === 'h2h');
                  
                  if (h2hMarket && h2hMarket.outcomes) {
                    h2hMarket.outcomes.forEach((outcome: any) => {
                      const outcomeOdds = outcome.price;
                      totalAnalyzed++;
                      
                      // Step 4: Apply value bet formula
                      const value = (estimatedWinProbability / 100 * outcomeOdds) - 1;
                      const valuePercentage = value * 100;
                      
                      // Check if it's a value bet and matches our criteria
                      if (value > 0 && Math.abs(outcomeOdds - targetOdds) <= 0.2) {
                        const impliedProbability = (1 / outcomeOdds) * 100;
                        
                        const valueBet: FoundValueBet = {
                          id: `${game.id}_${bookmaker.key}_${outcome.name}`,
                          event: `${game.home_team} vs ${game.away_team}`,
                          league: sport.title,
                          team1: game.home_team,
                          team2: game.away_team,
                          betType: outcome.name === game.home_team ? 'Home Win' : 
                                   outcome.name === game.away_team ? 'Away Win' : 'Draw',
                          odds: outcomeOdds.toFixed(2),
                          impliedProb: `${impliedProbability.toFixed(1)}%`,
                          aiProb: `${estimatedWinProbability}%`,
                          value: valuePercentage > 0 ? `+${valuePercentage.toFixed(1)}%` : `${valuePercentage.toFixed(1)}%`,
                          confidence: Math.min(95, Math.max(60, 70 + Math.abs(valuePercentage))).toString(),
                          sportsbook: bookmaker.title,
                          timeLeft: new Date(game.commence_time) > new Date() ? 
                            `${Math.round((new Date(game.commence_time).getTime() - new Date().getTime()) / (1000 * 60 * 60))}h` : 'Live',
                          sport: sport.key,
                          region: region.toUpperCase()
                        };
                        
                        foundBets.push(valueBet);
                        console.log(`🎯 VALUE BET FOUND: ${valueBet.event} - ${valueBet.betType} at ${valueBet.odds} (${valueBet.value} value)`);
                      }
                    });
                  }
                });
              });
            }
            
            // Add delay to respect rate limits
            await new Promise(resolve => setTimeout(resolve, 1000));
            
          } catch (error) {
            if (error.message.includes('401') || error.message.includes('quota')) {
              console.warn('⚠️ API quota reached, stopping analysis');
              break;
            }
            console.warn(`⚠️ Failed to fetch ${sport.key} from ${region}:`, error.message);
          }
        }
      }
      
      // Sort by value percentage descending
      foundBets.sort((a, b) => {
        const aValue = parseFloat(a.value.replace('%', '').replace('+', ''));
        const bValue = parseFloat(b.value.replace('%', '').replace('+', ''));
        return bValue - aValue;
      });
      
      console.log(`🎉 Analysis complete: Found ${foundBets.length} value bets from ${totalAnalyzed} analyzed outcomes`);
      
      setFoundValueBets(foundBets);
      
      if (foundBets.length > 0) {
        toast({
          title: "Value Bets Found!",
          description: `Found ${foundBets.length} value betting opportunities`,
        });
      } else {
        toast({
          title: "No Value Bets Found",
          description: `Analyzed ${totalAnalyzed} betting outcomes but found no value opportunities matching your criteria`,
        });
      }
      
      return foundBets;
      
    } catch (error) {
      console.error('💥 Error in comprehensive value bet analysis:', error);
      toast({
        title: "Analysis Error",
        description: "Failed to complete value bet analysis. Please try again.",
        variant: "destructive",
      });
      return [];
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analyzeValueBet = async (input: ValueBetInput): Promise<ValueBetResult | null> => {
    setIsAnalyzing(true);
    setResult(null);

    try {
      // First, get odds data from the odds API based on selected sport
      const oddsResponse = await fetch('/api/odds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sport: input.league })
      });

      if (!oddsResponse.ok) {
        throw new Error('Failed to fetch odds data');
      }

      const oddsData = await oddsResponse.json();

      // Then analyze with OpenAI using the real odds data and user input
      const { data, error } = await supabase.functions.invoke('analyze-value-bets', {
        body: {
          ...input,
          oddsData: oddsData
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      setResult(data);
      
      if (data.recommendation === 'VALUE') {
        toast({
          title: "Value Bet Found!",
          description: `${data.valuePercentage.toFixed(1)}% value with ${data.confidence}% confidence`,
        });
      } else if (data.recommendation === 'AVOID') {
        toast({
          title: "Bet Not Recommended",
          description: "This bet shows negative value",
          variant: "destructive",
        });
      } else {
        toast({
          title: "No Clear Value",
          description: "This bet shows minimal value opportunity",
        });
      }

      return data;
    } catch (error) {
      console.error('Error analyzing value bet:', error);
      
      // Fallback to mock calculation if API fails
      const decimalOdds = parseFloat(input.bookmakerOdds);
      const impliedProbability = (1 / decimalOdds) * 100;
      const valuePercentage = input.estimatedWinPercentage - impliedProbability;
      
      const mockResult: ValueBetResult = {
        valuePercentage,
        impliedProbability,
        estimatedProbability: input.estimatedWinPercentage,
        recommendation: valuePercentage > 5 ? 'VALUE' : valuePercentage < -5 ? 'AVOID' : 'NO_VALUE',
        confidence: Math.min(95, Math.max(60, 70 + Math.abs(valuePercentage))),
        reasoning: 'Analysis based on user input (API unavailable)'
      };
      
      setResult(mockResult);
      return mockResult;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearResult = () => {
    setResult(null);
    setFoundValueBets([]);
  };

  return {
    analyzeValueBet,
    analyzeValueBets,
    isAnalyzing,
    result,
    foundValueBets,
    clearResult
  };
};
