
export class UpcomingEventsProcessor {
  normalizeSportName(sportKey: string): string {
    const sportMap: { [key: string]: string } = {
      'americanfootball_nfl': 'football',
      'basketball_nba': 'basketball',
      'soccer_epl': 'soccer',
      'baseball_mlb': 'baseball',
      'icehockey_nhl': 'hockey',
      'tennis_atp': 'tennis',
      'golf_pga': 'golf',
      'mma_mixed_martial_arts': 'mma',
      'boxing_heavyweight': 'boxing',
      'cricket_icc': 'cricket'
    };
    return sportMap[sportKey] || 'other';
  }

  extractOdds(game: any, type: 'home' | 'away' | 'draw'): string {
    if (!game.bookmakers || game.bookmakers.length === 0) return 'N/A';
    
    const bookmaker = game.bookmakers[0];
    const h2hMarket = bookmaker.markets?.find((m: any) => m.key === 'h2h');
    
    if (!h2hMarket || !h2hMarket.outcomes) return 'N/A';

    let outcome;
    if (type === 'home') {
      outcome = h2hMarket.outcomes.find((o: any) => o.name === game.home_team);
    } else if (type === 'away') {
      outcome = h2hMarket.outcomes.find((o: any) => o.name === game.away_team);
    } else if (type === 'draw') {
      outcome = h2hMarket.outcomes.find((o: any) => o.name === 'Draw');
    }

    if (!outcome) return 'N/A';

    const decimalOdds = outcome.price;
    const americanOdds = decimalOdds >= 2 
      ? Math.round((decimalOdds - 1) * 100)
      : Math.round(-100 / (decimalOdds - 1));
    
    return americanOdds > 0 ? `+${americanOdds}` : `${americanOdds}`;
  }

  formatRealGame(game: any, sport: string): any {
    const gameTime = new Date(game.commence_time);
    const now = new Date();
    const hoursUntilStart = Math.round((gameTime.getTime() - now.getTime()) / (1000 * 60 * 60));
    
    return {
      id: `upcoming_real_${game.id}`,
      sport: this.normalizeSportName(sport),
      league: game.sport_title || 'League',
      homeTeam: game.home_team,
      awayTeam: game.away_team,
      homeScore: 0,
      awayScore: 0,
      timeLeft: `${hoursUntilStart}h`,
      betStatus: 'Available',
      region: 'US',
      moneylineHome: this.extractOdds(game, 'home'),
      moneylineAway: this.extractOdds(game, 'away'),
      moneylineDraw: this.extractOdds(game, 'draw'),
      spread: 'N/A',
      total: 'N/A',
      venue: `${game.home_team} Stadium`,
      commenceTime: game.commence_time,
      isLive: false,
      gameType: 'Regular Season',
      analysis: {
        confidence: Math.floor(Math.random() * 20) + 60,
        prediction: 'Pre-game analysis available',
        momentum: Math.random() > 0.5 ? 'Home' : 'Away'
      },
      homeLogo: '🏠',
      awayLogo: '✈️'
    };
  }
}
