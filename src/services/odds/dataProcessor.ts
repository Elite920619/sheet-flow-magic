import { OddsData, ProcessedGameOdds, Bookmaker, Market, Outcome } from './types';

export class DataProcessor {
  mapSportToCategory(sportKey: string): string {
    const sportMappings: { [key: string]: string } = {
      // Football
      'americanfootball_nfl': 'football',
      'americanfootball_ncaaf': 'football',
      'americanfootball_cfl': 'football',
      
      // Basketball
      'basketball_nba': 'basketball',
      'basketball_ncaab': 'basketball',
      'basketball_wnba': 'basketball',
      'basketball_euroleague': 'basketball',
      'basketball_nbl': 'basketball',
      
      // Soccer
      'soccer_epl': 'soccer',
      'soccer_uefa_champs_league': 'soccer',
      'soccer_fifa_world_cup': 'soccer',
      'soccer_usa_mls': 'soccer',
      'soccer_uefa_european_championship': 'soccer',
      'soccer_germany_bundesliga': 'soccer',
      'soccer_spain_la_liga': 'soccer',
      'soccer_italy_serie_a': 'soccer',
      'soccer_france_ligue_one': 'soccer',
      'soccer_england_league_one': 'soccer',
      'soccer_england_league_two': 'soccer',
      'soccer_conmebol_copa_libertadores': 'soccer',
      
      // Baseball
      'baseball_mlb': 'baseball',
      'baseball_ncaa': 'baseball',
      'baseball_kbo': 'baseball',
      'baseball_npb': 'baseball',
      
      // Hockey
      'icehockey_nhl': 'hockey',
      'icehockey_ncaa': 'hockey',
      'icehockey_shl': 'hockey',
      'icehockey_khl': 'hockey',
      
      // Tennis
      'tennis_wta': 'tennis',
      'tennis_atp': 'tennis',
      'tennis_atp_aus_open_singles': 'tennis',
      'tennis_atp_french_open': 'tennis',
      'tennis_atp_us_open': 'tennis',
      'tennis_atp_wimbledon': 'tennis',
      
      // Golf
      'golf_pga': 'golf',
      'golf_masters': 'golf',
      'golf_the_open_championship': 'golf',
      'golf_pga_championship': 'golf',
      'golf_us_open': 'golf',
      
      // Combat Sports
      'boxing_heavyweight': 'boxing',
      'mixed_martial_arts': 'mma',
      'mma_mixed_martial_arts': 'mma',
      
      // Other Sports
      'cricket_icc_world_cup': 'cricket',
      'cricket_ipl': 'cricket',
      'cricket_big_bash': 'cricket',
      'rugby_league_nrl': 'rugby',
      'rugby_union_world_cup': 'rugby',
      'aussierules_afl': 'aussie_rules',
      'darts_pdc_world_darts_championship': 'darts',
      'snooker_world_championship': 'snooker',
      'motorsport_f1': 'motorsport',
      'esports_valorant': 'esports',
      'esports_csgo': 'esports',
      'esports_dota2': 'esports',
      'esports_lol': 'esports',
      'politics_us_presidential_election': 'politics',
      'awards_oscars': 'awards'
    };
    
    return sportMappings[sportKey] || 'other';
  }

  processOddsData(data: OddsData[], region: string): ProcessedGameOdds[] {
    return data.map(game => {
      const h2hMarket = this.findMarket(game.bookmakers, 'h2h');
      const spreadMarket = this.findMarket(game.bookmakers, 'spreads');
      const totalMarket = this.findMarket(game.bookmakers, 'totals');

      const moneyline = this.processMoneyline(h2hMarket, game.home_team, game.away_team);
      const spread = this.processSpread(spreadMarket, game.home_team, game.away_team);
      const total = this.processTotal(totalMarket);

      // Calculate best odds across all bookmakers
      const bestOdds = this.calculateBestOdds(game.bookmakers, game.home_team, game.away_team);

      return {
        id: game.id,
        league: game.sport_title,
        homeTeam: game.home_team,
        awayTeam: game.away_team,
        commenceTime: game.commence_time,
        region: region,
        moneyline: moneyline,
        spread: spread,
        total: total,
        bestOdds: bestOdds,
        venue: 'TBD',
        sportsbook: h2hMarket?.bookmaker || 'Various'
      };
    });
  }

  private calculateBestOdds(bookmakers: Bookmaker[], homeTeam: string, awayTeam: string) {
    let bestHomeML = { odds: 0, sportsbook: 'N/A' };
    let bestAwayML = { odds: 0, sportsbook: 'N/A' };
    let bestDrawML = { odds: 0, sportsbook: 'N/A' };
    let bestOverTotal = { point: 0, odds: 0, sportsbook: 'N/A' };
    let bestUnderTotal = { point: 0, odds: 0, sportsbook: 'N/A' };

    bookmakers.forEach(bookmaker => {
      // Find best moneyline odds
      const h2hMarket = bookmaker.markets.find(m => m.key === 'h2h');
      if (h2hMarket) {
        const homeOutcome = h2hMarket.outcomes.find(o => o.name === homeTeam);
        const awayOutcome = h2hMarket.outcomes.find(o => o.name === awayTeam);
        const drawOutcome = h2hMarket.outcomes.find(o => o.name === 'Draw');

        if (homeOutcome && homeOutcome.price > bestHomeML.odds) {
          bestHomeML = { odds: homeOutcome.price, sportsbook: bookmaker.title };
        }
        if (awayOutcome && awayOutcome.price > bestAwayML.odds) {
          bestAwayML = { odds: awayOutcome.price, sportsbook: bookmaker.title };
        }
        if (drawOutcome && drawOutcome.price > bestDrawML.odds) {
          bestDrawML = { odds: drawOutcome.price, sportsbook: bookmaker.title };
        }
      }

      // Find best total odds
      const totalMarket = bookmaker.markets.find(m => m.key === 'totals');
      if (totalMarket) {
        const overOutcome = totalMarket.outcomes.find(o => o.name === 'Over');
        const underOutcome = totalMarket.outcomes.find(o => o.name === 'Under');

        if (overOutcome && overOutcome.price > bestOverTotal.odds) {
          bestOverTotal = { 
            point: overOutcome.point || 0, 
            odds: overOutcome.price, 
            sportsbook: bookmaker.title 
          };
        }
        if (underOutcome && underOutcome.price > bestUnderTotal.odds) {
          bestUnderTotal = { 
            point: underOutcome.point || 0, 
            odds: underOutcome.price, 
            sportsbook: bookmaker.title 
          };
        }
      }
    });

    return {
      homeML: bestHomeML,
      awayML: bestAwayML,
      drawML: bestDrawML.odds > 0 ? bestDrawML : undefined,
      overTotal: bestOverTotal,
      underTotal: bestUnderTotal
    };
  }

  private findMarket(bookmakers: Bookmaker[], marketKey: string): { bookmaker: string; market: Market } | null {
    for (const bookmaker of bookmakers) {
      const market = bookmaker.markets.find(m => m.key === marketKey);
      if (market) {
        return { bookmaker: bookmaker.title, market };
      }
    }
    return null;
  }

  private processMoneyline(marketData: { bookmaker: string; market: Market } | null, homeTeam: string, awayTeam: string) {
    if (!marketData) return { home: 0, away: 0, draw: null, sportsbook: 'N/A' };

    const homeOutcome = marketData.market.outcomes.find(o => o.name === homeTeam);
    const awayOutcome = marketData.market.outcomes.find(o => o.name === awayTeam);
    const drawOutcome = marketData.market.outcomes.find(o => o.name === 'Draw');

    return {
      home: homeOutcome?.price || 0,
      away: awayOutcome?.price || 0,
      draw: drawOutcome?.price || null,
      sportsbook: marketData.bookmaker
    };
  }

  private processSpread(marketData: { bookmaker: string; market: Market } | null, homeTeam: string, awayTeam: string) {
    if (!marketData) return { home: { point: 0, odds: 0 }, away: { point: 0, odds: 0 }, sportsbook: 'N/A' };

    const homeOutcome = marketData.market.outcomes.find(o => o.name === homeTeam);
    const awayOutcome = marketData.market.outcomes.find(o => o.name === awayTeam);

    return {
      home: { point: homeOutcome?.point || 0, odds: homeOutcome?.price || 0 },
      away: { point: awayOutcome?.point || 0, odds: awayOutcome?.price || 0 },
      sportsbook: marketData.bookmaker
    };
  }

  private processTotal(marketData: { bookmaker: string; market: Market } | null) {
    if (!marketData) return { over: { point: 0, odds: 0 }, under: { point: 0, odds: 0 }, sportsbook: 'N/A' };

    const overOutcome = marketData.market.outcomes.find(o => o.name === 'Over');
    const underOutcome = marketData.market.outcomes.find(o => o.name === 'Under');

    return {
      over: { point: overOutcome?.point || 0, odds: overOutcome?.price || 0 },
      under: { point: underOutcome?.point || 0, odds: underOutcome?.price || 0 },
      sportsbook: marketData.bookmaker
    };
  }

  calculateTimeLeft(commenceTime: string): string {
    const now = new Date();
    const gameTime = new Date(commenceTime);
    const diffMs = gameTime.getTime() - now.getTime();

    if (diffMs < 0) {
      // Game has started - show live status
      const hoursElapsed = Math.abs(Math.floor(diffMs / (1000 * 60 * 60)));
      if (hoursElapsed < 3) {
        return Math.random() > 0.5 ? 'LIVE' : `${Math.floor(Math.random() * 4) + 1}Q`;
      }
      return 'Final';
    }

    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  }

  formatOdds(odds: number): string {
    if (!odds || odds === 0) return 'N/A';
    
    if (odds > 0) {
      return `+${odds}`;
    } else {
      return `${odds}`;
    }
  }
}
