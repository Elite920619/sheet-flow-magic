import { oddsApiClient } from './odds/apiClient';
import { LiveEventsService } from './odds/liveEventsService';
import { DataValidator } from './odds/dataValidator';
import { enhancedOddsService } from './odds/enhancedOddsService';

export interface ProcessedGameOdds {
  id: string;
  homeTeam: string;
  awayTeam: string;
  sport: string;
  league: string;
  commenceTime: string;
  homeOdds: Array<{
    bookmaker: string;
    odds: number;
    region: string;
  }>;
  awayOdds: Array<{
    bookmaker: string;
    odds: number;
    region: string;
  }>;
  drawOdds?: Array<{
    bookmaker: string;
    odds: number;
    region: string;
  }>;
  bestHomeOdds?: {
    bookmaker: string;
    odds: number;
  };
  bestAwayOdds?: {
    bookmaker: string;
    odds: number;
  };
  worstHomeOdds?: {
    bookmaker: string;
    odds: number;
  };
  worstAwayOdds?: {
    bookmaker: string;
    odds: number;
  };
  moneyline: {
    home: number;
    away: number;
    draw?: number;
    sportsbook: string;
  };
  spread: {
    home: { point: number; odds: number };
    away: { point: number; odds: number };
    sportsbook: string;
  };
  total: {
    over: { point: number; odds: number };
    under: { point: number; odds: number };
    sportsbook: string;
  };
  bestOdds: {
    homeML: { odds: number; sportsbook: string };
    awayML: { odds: number; sportsbook: string };
    drawML?: { odds: number; sportsbook: string };
    overTotal: { point: number; odds: number; sportsbook: string };
    underTotal: { point: number; odds: number; sportsbook: string };
  };
}

class OddsService {
  private liveEventsService = new LiveEventsService();

  async fetchOdds(sport: string = 'americanfootball_nfl'): Promise<ProcessedGameOdds[]> {
    try {
      console.log(`🎯 Fetching comprehensive odds for sport: ${sport}`);
      const data = await oddsApiClient.fetchOddsFromApi(sport);
      
      if (!data || !Array.isArray(data)) {
        console.warn('No valid odds data received');
        return [];
      }
      
      // Apply comprehensive validation
      const validEvents = DataValidator.filterValidEvents(data);
      console.log(`✅ Comprehensive odds fetch: ${validEvents.length}/${data.length} events passed validation`);
      
      return validEvents.map(game => this.processGameOdds(game));
    } catch (error) {
      console.error('💥 Error fetching comprehensive odds:', error);
      return [];
    }
  }

  async fetchMultiRegionOdds(sport: string = 'americanfootball_nfl'): Promise<ProcessedGameOdds[]> {
    console.log(`🌍 Starting multi-region comprehensive odds fetch for ${sport}...`);
    
    try {
      // Use the new comprehensive multi-region fetch
      const regionResults = await oddsApiClient.fetchOddsFromAllRegions(sport);
      const allGames = new Map<string, ProcessedGameOdds>();
      
      // Process and validate data from all regions
      for (const { region, events } of regionResults) {
        if (events && events.length > 0) {
          console.log(`🔍 Processing ${events.length} events from ${region.toUpperCase()}...`);
          
          // Apply comprehensive validation
          const validEvents = DataValidator.filterValidEvents(events);
          console.log(`✅ ${region.toUpperCase()}: ${validEvents.length}/${events.length} events passed validation`);
          
          validEvents.forEach(game => {
            const processed = this.processGameOdds(game, region);
            
            if (allGames.has(processed.id)) {
              // Merge odds from different regions
              const existing = allGames.get(processed.id)!;
              existing.homeOdds.push(...processed.homeOdds);
              existing.awayOdds.push(...processed.awayOdds);
              if (processed.drawOdds) {
                existing.drawOdds = existing.drawOdds || [];
                existing.drawOdds.push(...processed.drawOdds);
              }
            } else {
              allGames.set(processed.id, processed);
            }
          });
        }
      }
      
      // Calculate best/worst odds for each game
      const finalGames = Array.from(allGames.values()).map(game => {
        game.bestHomeOdds = this.findBestOdds(game.homeOdds);
        game.worstHomeOdds = this.findWorstOdds(game.homeOdds);
        game.bestAwayOdds = this.findBestOdds(game.awayOdds);
        game.worstAwayOdds = this.findWorstOdds(game.awayOdds);
        return game;
      });
      
      console.log(`🎉 Multi-region comprehensive fetch complete: ${finalGames.length} verified games`);
      return finalGames;
    } catch (error) {
      console.error('💥 Error in multi-region comprehensive fetch:', error);
      return [];
    }
  }

  async fetchUpcomingOdds(): Promise<any[]> {
    try {
      console.log('🚀 GET->DETECT->SHOW: Fetching upcoming odds with enhanced validation...');
      return await enhancedOddsService.fetchUpcomingEvents();
    } catch (error) {
      console.error('Error fetching upcoming odds:', error);
      return [];
    }
  }

  async fetchLiveEventsByRegion(region: string): Promise<any[]> {
    console.log(`🌍 GET->DETECT->SHOW: Fetching live events for region: ${region.toUpperCase()}`);
    return enhancedOddsService.fetchLiveEventsByRegion(region);
  }

  async fetchLiveEvents(): Promise<any[]> {
    console.log('🚀 GET->DETECT->SHOW: Starting comprehensive live events fetch...');
    return enhancedOddsService.fetchLiveEvents();
  }

  async fetchLiveEventsProgressive(onRegionComplete: (events: any[]) => void): Promise<any[]> {
    console.log('🚀 GET->DETECT->SHOW: Progressive live events fetch...');
    return enhancedOddsService.fetchLiveEventsProgressive(onRegionComplete);
  }

  private processGameOdds(game: any, region: string = 'us'): ProcessedGameOdds {
    const bookmakers = game.bookmakers || [];
    
    const processedGame: ProcessedGameOdds = {
      id: game.id,
      homeTeam: game.home_team,
      awayTeam: game.away_team,
      sport: game.sport_key,
      league: game.sport_title,
      commenceTime: game.commence_time,
      homeOdds: [],
      awayOdds: [],
      drawOdds: [],
      moneyline: {
        home: 0,
        away: 0,
        sportsbook: 'N/A'
      },
      spread: {
        home: { point: 0, odds: 0 },
        away: { point: 0, odds: 0 },
        sportsbook: 'N/A'
      },
      total: {
        over: { point: 0, odds: 0 },
        under: { point: 0, odds: 0 },
        sportsbook: 'N/A'
      },
      bestOdds: {
        homeML: { odds: 0, sportsbook: 'N/A' },
        awayML: { odds: 0, sportsbook: 'N/A' },
        overTotal: { point: 0, odds: 0, sportsbook: 'N/A' },
        underTotal: { point: 0, odds: 0, sportsbook: 'N/A' }
      }
    };
    
    if (bookmakers.length > 0) {
      const firstBookmaker = bookmakers[0];
      
      bookmakers.forEach((bookmaker: any) => {
        const h2hMarket = bookmaker.markets?.find((m: any) => m.key === 'h2h');
        const spreadsMarket = bookmaker.markets?.find((m: any) => m.key === 'spreads');
        const totalsMarket = bookmaker.markets?.find((m: any) => m.key === 'totals');
        
        if (h2hMarket && h2hMarket.outcomes) {
          h2hMarket.outcomes.forEach((outcome: any) => {
            const oddsEntry = {
              bookmaker: bookmaker.title,
              odds: outcome.price,
              region: region
            };
            
            if (outcome.name === game.home_team) {
              processedGame.homeOdds.push(oddsEntry);
              if (processedGame.moneyline.home === 0) {
                processedGame.moneyline.home = outcome.price;
                processedGame.moneyline.sportsbook = bookmaker.title;
              }
            } else if (outcome.name === game.away_team) {
              processedGame.awayOdds.push(oddsEntry);
              if (processedGame.moneyline.away === 0) {
                processedGame.moneyline.away = outcome.price;
              }
            } else if (outcome.name === 'Draw') {
              processedGame.drawOdds!.push(oddsEntry);
              if (!processedGame.moneyline.draw) {
                processedGame.moneyline.draw = outcome.price;
              }
            }
          });
        }
        
        if (spreadsMarket && spreadsMarket.outcomes) {
          spreadsMarket.outcomes.forEach((outcome: any) => {
            if (outcome.name === game.home_team && processedGame.spread.home.odds === 0) {
              processedGame.spread.home = { point: outcome.point || 0, odds: outcome.price };
              processedGame.spread.sportsbook = bookmaker.title;
            } else if (outcome.name === game.away_team && processedGame.spread.away.odds === 0) {
              processedGame.spread.away = { point: outcome.point || 0, odds: outcome.price };
            }
          });
        }
        
        if (totalsMarket && totalsMarket.outcomes) {
          totalsMarket.outcomes.forEach((outcome: any) => {
            if (outcome.name === 'Over' && processedGame.total.over.odds === 0) {
              processedGame.total.over = { point: outcome.point || 0, odds: outcome.price };
              processedGame.total.sportsbook = bookmaker.title;
            } else if (outcome.name === 'Under' && processedGame.total.under.odds === 0) {
              processedGame.total.under = { point: outcome.point || 0, odds: outcome.price };
            }
          });
        }
      });
      
      // Calculate best odds with correct format
      const bestHome = this.findBestOdds(processedGame.homeOdds);
      const bestAway = this.findBestOdds(processedGame.awayOdds);
      
      processedGame.bestOdds.homeML = bestHome ? { odds: bestHome.odds, sportsbook: bestHome.bookmaker } : { odds: 0, sportsbook: 'N/A' };
      processedGame.bestOdds.awayML = bestAway ? { odds: bestAway.odds, sportsbook: bestAway.bookmaker } : { odds: 0, sportsbook: 'N/A' };
      
      if (processedGame.total.over.odds > 0) {
        processedGame.bestOdds.overTotal = {
          point: processedGame.total.over.point,
          odds: processedGame.total.over.odds,
          sportsbook: processedGame.total.sportsbook
        };
      }
      
      if (processedGame.total.under.odds > 0) {
        processedGame.bestOdds.underTotal = {
          point: processedGame.total.under.point,
          odds: processedGame.total.under.odds,
          sportsbook: processedGame.total.sportsbook
        };
      }
    }
    
    return processedGame;
  }

  private findBestOdds(odds: Array<{bookmaker: string, odds: number}>): {bookmaker: string, odds: number} | undefined {
    if (odds.length === 0) return undefined;
    return odds.reduce((best, current) => 
      current.odds > best.odds ? current : best
    );
  }

  private findWorstOdds(odds: Array<{bookmaker: string, odds: number}>): {bookmaker: string, odds: number} | undefined {
    if (odds.length === 0) return undefined;
    return odds.reduce((worst, current) => 
      current.odds < worst.odds ? current : worst
    );
  }
}

export const oddsService = new OddsService();
