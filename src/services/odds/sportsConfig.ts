
export class SportsConfig {
  // Sports that don't support standard markets (h2h, spreads, totals)
  static readonly UNSUPPORTED_MARKET_SPORTS = [
    'americanfootball_nfl_super_bowl_winner',
    'basketball_nba_championship_winner',
    'baseball_mlb_world_series_winner',
    'icehockey_nhl_championship_winner'
  ];

  // Sports that only support h2h markets (no spreads or totals)
  static readonly H2H_ONLY_SPORTS = [
    'politics_us_presidential_election_winner',
    'politics_uk_general_election',
    'politics_us_senate',
    'politics_us_house',
    'esports_dota2',
    'mixed_martial_arts',
    'boxing_heavyweight',
    'golf_masters_tournament_winner',
    'tennis_wimbledon_mens_singles_winner',
    'tennis_wimbledon_womens_singles_winner',
    'olympics_2024_summer_olympics'
  ];

  // Sports known to cause 422 errors in certain regions
  static readonly PROBLEMATIC_SPORTS = [
    'golf_the_open_championship_winner', // 422 error in AU region
    'politics_us_presidential_election_winner', // Rate limit issues
    'esports_dota2' // Known to return 404 in some regions
  ];

  static filterActiveSports(allSports: any[]): any[] {
    return allSports.filter(sport => {
      if (!sport.active) {
        console.log(`Filtering out inactive sport: ${sport.key}`);
        return false;
      }
      
      if (this.UNSUPPORTED_MARKET_SPORTS.includes(sport.key)) {
        console.log(`Filtering out unsupported sport: ${sport.key}`);
        return false;
      }
      
      // Check if sport explicitly has odds support
      if (sport.has_odds === false) {
        console.log(`Filtering out sport without odds: ${sport.key}`);
        return false;
      }
      
      return true;
    });
  }

  static getMarketsForSport(sportKey: string): string {
    // Use h2h for all sports in live events to avoid 422 errors
    return 'h2h';
  }

  static isValidSport(sportKey: string): boolean {
    // Filter out known problematic sports that cause consistent errors
    if (this.PROBLEMATIC_SPORTS.includes(sportKey)) {
      console.log(`Skipping problematic sport: ${sportKey}`);
      return false;
    }
    
    return true;
  }

  static getSupportedRegions(sportKey: string): string[] {
    // Some sports work better in certain regions
    const regionPreferences: Record<string, string[]> = {
      'rugbyleague_nrl': ['au', 'uk'],
      'soccer_argentina_primera_division': ['us', 'uk', 'eu'],
      'americanfootball_nfl': ['us', 'uk', 'eu', 'au'],
      'basketball_nba': ['us', 'uk', 'eu', 'au'],
      'baseball_mlb': ['us', 'uk', 'eu', 'au'],
      'icehockey_nhl': ['us', 'uk', 'eu', 'au']
    };
    
    return regionPreferences[sportKey] || ['us', 'uk', 'eu', 'au'];
  }
}
