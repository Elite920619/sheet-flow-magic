
import { ProcessedGameOdds } from './oddsService';

export interface ValueBetAnalysis {
  gameId: string;
  recommendations: BetRecommendation[];
  overallConfidence: number;
  marketAnalysis: string;
}

export interface BetRecommendation {
  betType: string;
  selection: string;
  odds: number;
  impliedProbability: number;
  aiProbability: number;
  valuePercentage: number;
  confidence: number;
  reasoning: string;
  sportsbook: string;
}

export class AIService {
  private apiKey: string;
  private baseUrl = 'https://api.openai.com/v1';

  constructor(apiKey?: string) {
    this.apiKey = apiKey || 'YOUR_OPENAI_API_KEY';
  }

  async analyzeValueBets(games: ProcessedGameOdds[]): Promise<ValueBetAnalysis[]> {
    try {
      if (!this.apiKey || this.apiKey === 'YOUR_OPENAI_API_KEY') {
        console.warn('OpenAI API key not configured, using mock analysis');
        return this.getMockAnalysis(games);
      }

      const analyses: ValueBetAnalysis[] = [];
      
      for (const game of games) {
        const analysis = await this.analyzeGame(game);
        analyses.push(analysis);
      }
      
      return analyses;
    } catch (error) {
      console.error('Error analyzing value bets:', error);
      return this.getMockAnalysis(games);
    }
  }

  private async analyzeGame(game: ProcessedGameOdds): Promise<ValueBetAnalysis> {
    const prompt = this.buildGameAnalysisPrompt(game);
    
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are an expert sports betting analyst. Analyze games and provide value bet recommendations with confidence scores.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          functions: [
            {
              name: 'analyze_betting_value',
              description: 'Analyze betting opportunities and return structured recommendations',
              parameters: {
                type: 'object',
                properties: {
                  recommendations: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        betType: { type: 'string' },
                        selection: { type: 'string' },
                        odds: { type: 'number' },
                        impliedProbability: { type: 'number' },
                        aiProbability: { type: 'number' },
                        valuePercentage: { type: 'number' },
                        confidence: { type: 'number' },
                        reasoning: { type: 'string' },
                        sportsbook: { type: 'string' }
                      }
                    }
                  },
                  overallConfidence: { type: 'number' },
                  marketAnalysis: { type: 'string' }
                }
              }
            }
          ],
          function_call: { name: 'analyze_betting_value' }
        }),
      });

      const data = await response.json();
      const functionResult = JSON.parse(data.choices[0].message.function_call.arguments);

      return {
        gameId: game.id,
        recommendations: functionResult.recommendations,
        overallConfidence: functionResult.overallConfidence,
        marketAnalysis: functionResult.marketAnalysis
      };
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      return this.getMockGameAnalysis(game);
    }
  }

  private buildGameAnalysisPrompt(game: ProcessedGameOdds): string {
    return `
Analyze this ${game.league} game for betting value:

Game: ${game.awayTeam} @ ${game.homeTeam}
Commence Time: ${new Date(game.commenceTime).toLocaleString()}

Current Odds:
- Moneyline: ${game.homeTeam} ${game.moneyline.home}, ${game.awayTeam} ${game.moneyline.away}
- Spread: ${game.homeTeam} ${game.spread.home.point} (${game.spread.home.odds}), ${game.awayTeam} ${game.spread.away.point} (${game.spread.away.odds})
- Total: Over ${game.total.over.point} (${game.total.over.odds}), Under ${game.total.under.point} (${game.total.under.odds})

Best Available Odds:
- ${game.homeTeam} ML: ${game.bestOdds.homeML.odds} at ${game.bestOdds.homeML.sportsbook}
- ${game.awayTeam} ML: ${game.bestOdds.awayML.odds} at ${game.bestOdds.awayML.sportsbook}
- Over ${game.bestOdds.overTotal.point}: ${game.bestOdds.overTotal.odds} at ${game.bestOdds.overTotal.sportsbook}
- Under ${game.bestOdds.underTotal.point}: ${game.bestOdds.underTotal.odds} at ${game.bestOdds.underTotal.sportsbook}

Please analyze these betting opportunities and identify the best value bets with your confidence assessment.
    `;
  }

  private getMockAnalysis(games: ProcessedGameOdds[]): ValueBetAnalysis[] {
    return games.map(game => this.getMockGameAnalysis(game));
  }

  private getMockGameAnalysis(game: ProcessedGameOdds): ValueBetAnalysis {
    const recommendations: BetRecommendation[] = [];

    // Mock analysis for demonstration
    if (game.league === 'NFL') {
      recommendations.push({
        betType: 'Moneyline',
        selection: game.awayTeam,
        odds: game.bestOdds.awayML.odds,
        impliedProbability: this.oddsToImpliedProbability(game.bestOdds.awayML.odds),
        aiProbability: 52.3,
        valuePercentage: 15.2,
        confidence: 85,
        reasoning: 'Strong road performance and favorable matchup against weak secondary',
        sportsbook: game.bestOdds.awayML.sportsbook
      });
    }

    if (game.league === 'NBA') {
      recommendations.push({
        betType: 'Total',
        selection: `Over ${game.bestOdds.overTotal.point}`,
        odds: game.bestOdds.overTotal.odds,
        impliedProbability: this.oddsToImpliedProbability(game.bestOdds.overTotal.odds),
        aiProbability: 59.1,
        valuePercentage: 12.8,
        confidence: 78,
        reasoning: 'Both teams playing fast pace, key defenders injured',
        sportsbook: game.bestOdds.overTotal.sportsbook
      });
    }

    return {
      gameId: game.id,
      recommendations,
      overallConfidence: recommendations.length > 0 ? Math.max(...recommendations.map(r => r.confidence)) : 0,
      marketAnalysis: `Analysis for ${game.awayTeam} @ ${game.homeTeam} showing ${recommendations.length} value opportunities`
    };
  }

  private oddsToImpliedProbability(americanOdds: number): number {
    if (americanOdds > 0) {
      return (100 / (americanOdds + 100)) * 100;
    } else {
      return (Math.abs(americanOdds) / (Math.abs(americanOdds) + 100)) * 100;
    }
  }
}

export const aiService = new AIService();
