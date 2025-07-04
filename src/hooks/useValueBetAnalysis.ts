
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
      console.log(`🎯 Starting enhanced value bet analysis...`);
      console.log(`Target odds: ${targetOdds}, Estimated win probability: ${estimatedWinProbability}%`);
      
      // Step 1: Fetch all available sports with improved filtering
      const allSports = await oddsApiClient.fetchSportsFromApi();
      const activeSports = allSports.filter(sport => 
        sport.active && 
        !sport.has_outrights &&
        sport.key !== 'politics_us_presidential_election_winner' &&
        !sport.key.includes('winner') // Avoid futures markets
      ).slice(0, 12); // Slightly increased for better coverage
      
      console.log(`📊 Found ${activeSports.length} active sports to analyze`);
      
      const regions = ['us', 'uk', 'eu', 'au'];
      const foundBets: FoundValueBet[] = [];
      let totalAnalyzed = 0;
      
      // Step 2: Enhanced analysis with better value detection
      for (const sport of activeSports) {
        console.log(`🔍 Analyzing ${sport.title}...`);
        
        for (const region of regions) {
          try {
            const games = await oddsApiClient.fetchOddsFromApi(sport.key, region);
            
            if (games && games.length > 0) {
              console.log(`✅ Found ${games.length} games for ${sport.title} in ${region.toUpperCase()}`);
              
              // Step 3: Enhanced value bet detection
              games.forEach(game => {
                if (!game.bookmakers || game.bookmakers.length === 0) return;
                
                game.bookmakers.forEach((bookmaker: any) => {
                  const h2hMarket = bookmaker.markets?.find((m: any) => m.key === 'h2h');
                  
                  if (h2hMarket && h2hMarket.outcomes) {
                    h2hMarket.outcomes.forEach((outcome: any) => {
                      const outcomeOdds = outcome.price;
                      totalAnalyzed++;
                      
                      // Enhanced value calculation
                      const impliedProbability = (1 / outcomeOdds) * 100;
                      const valuePercentage = estimatedWinProbability - impliedProbability;
                      
                      // More sophisticated value detection
                      const isValueBet = valuePercentage > 3; // Lower threshold for better detection
                      const isWithinOddsRange = Math.abs(outcomeOdds - targetOdds) <= 0.5; // Wider range
                      
                      if (isValueBet && isWithinOddsRange) {
                        // Enhanced confidence calculation
                        const confidenceBase = Math.min(95, Math.max(60, 70 + Math.abs(valuePercentage)));
                        const oddsConfidence = outcomeOdds > 1.5 && outcomeOdds < 5.0 ? 5 : 0; // Bonus for reasonable odds
                        const finalConfidence = Math.min(95, confidenceBase + oddsConfidence);
                        
                        const valueBet: FoundValueBet = {
                          id: `${game.id}_${bookmaker.key}_${outcome.name}_${Date.now()}`,
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
                          confidence: finalConfidence.toString(),
                          sportsbook: bookmaker.title,
                          timeLeft: this.calculateTimeLeft(game.commence_time),
                          sport: sport.key,
                          region: region.toUpperCase()
                        };
                        
                        foundBets.push(valueBet);
                        console.log(`🎯 VALUE BET FOUND: ${valueBet.event} - ${valueBet.betType} at ${valueBet.odds} (${valueBet.value} value, ${valueBet.confidence}% confidence)`);
                      }
                    });
                  }
                });
              });
            }
            
            // Respect rate limits with variable delay
            await new Promise(resolve => setTimeout(resolve, 800));
            
          } catch (error) {
            if (error.message.includes('401') || error.message.includes('quota')) {
              console.warn('⚠️ API quota reached, stopping analysis');
              break;
            }
            console.warn(`⚠️ Failed to fetch ${sport.key} from ${region}:`, error.message);
          }
        }
        
        // Break if we found enough value bets
        if (foundBets.length >= 20) {
          console.log('✅ Found sufficient value bets, stopping search');
          break;
        }
      }
      
      // Enhanced sorting by value and confidence
      foundBets.sort((a, b) => {
        const aValue = parseFloat(a.value.replace('%', '').replace('+', ''));
        const bValue = parseFloat(b.value.replace('%', '').replace('+', ''));
        const aConfidence = parseFloat(a.confidence);
        const bConfidence = parseFloat(b.confidence);
        
        // Primary sort by value, secondary by confidence
        if (Math.abs(aValue - bValue) > 1) {
          return bValue - aValue;
        }
        return bConfidence - aConfidence;
      });
      
      console.log(`🎉 Enhanced analysis complete: Found ${foundBets.length} value bets from ${totalAnalyzed} analyzed outcomes`);
      
      setFoundValueBets(foundBets);
      
      if (foundBets.length > 0) {
        toast({
          title: "Value Bets Found!",
          description: `Found ${foundBets.length} enhanced value betting opportunities with improved analysis`,
        });
      } else {
        toast({
          title: "No Value Bets Found",
          description: `Analyzed ${totalAnalyzed} betting outcomes but found no value opportunities matching your criteria`,
        });
      }
      
      return foundBets;
      
    } catch (error) {
      console.error('💥 Error in enhanced value bet analysis:', error);
      toast({
        title: "Analysis Error",
        description: "Failed to complete enhanced value bet analysis. Please try again.",
        variant: "destructive",
      });
      return [];
    } finally {
      setIsAnalyzing(false);
    }
  };

  private calculateTimeLeft = (commenceTime: string): string => {
    const now = new Date();
    const gameTime = new Date(commenceTime);
    const diffMs = gameTime.getTime() - now.getTime();

    if (diffMs < 0) {
      return 'Live';
    }

    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    return `${Math.floor(diffMs / (1000 * 60))}m`;
  };

  const analyzeValueBet = async (input: ValueBetInput): Promise<ValueBetResult | null> => {
    setIsAnalyzing(true);
    setResult(null);

    try {
      // Enhanced single bet analysis
      const { data, error } = await supabase.functions.invoke('analyze-value-bets', {
        body: {
          ...input,
          enhancedAnalysis: true
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
          description: "This bet shows negative value based on enhanced analysis",
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
      console.error('Error in enhanced value bet analysis:', error);
      
      // Enhanced fallback calculation
      const decimalOdds = parseFloat(input.bookmakerOdds);
      const impliedProbability = (1 / decimalOdds) * 100;
      const valuePercentage = input.estimatedWinPercentage - impliedProbability;
      
      // Enhanced confidence calculation
      const baseConfidence = 70 + Math.abs(valuePercentage);
      const oddsAdjustment = decimalOdds > 1.5 && decimalOdds < 5.0 ? 5 : -5;
      const finalConfidence = Math.min(95, Math.max(60, baseConfidence + oddsAdjustment));
      
      const mockResult: ValueBetResult = {
        valuePercentage,
        impliedProbability,
        estimatedProbability: input.estimatedWinPercentage,
        recommendation: valuePercentage > 4 ? 'VALUE' : valuePercentage < -4 ? 'AVOID' : 'NO_VALUE',
        confidence: finalConfidence,
        reasoning: 'Enhanced analysis based on user input (API unavailable)'
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
