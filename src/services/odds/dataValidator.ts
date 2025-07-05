
export class DataValidator {
  
  // Enhanced validation for placeholder/fake team names with comprehensive patterns
  static hasValidTeamNames(homeTeam: string, awayTeam: string): boolean {
    if (!homeTeam || !awayTeam || typeof homeTeam !== 'string' || typeof awayTeam !== 'string') {
      console.log('❌ Invalid team names: missing or non-string values');
      return false;
    }

    // Teams can't be identical
    if (homeTeam.trim() === awayTeam.trim()) {
      console.log(`❌ Identical team names: ${homeTeam}`);
      return false;
    }

    const isValidTeamName = (teamName: string): boolean => {
      const name = teamName.trim();
      
      // Must be at least 2 characters
      if (name.length < 2) {
        console.log(`❌ Team name too short: "${name}"`);
        return false;
      }

      // Comprehensive patterns for detecting placeholder/fake team names
      const placeholderPatterns = [
        // Exact matches for common placeholder names
        /^Team A$/i,
        /^Team B$/i,
        /^Home Team$/i,
        /^Away Team$/i,
        /^Team 1$/i,
        /^Team 2$/i,
        
        // Regional placeholder patterns (US Team 7, UK Team 3, etc.)
        /^(US|UK|EU|AU|United States|United Kingdom|Europe|Australia) Team \d+$/i,
        
        // Generic numbered teams
        /^Team \d+$/i,
        /^(Home|Away|Local|Visitor|Host|Guest) \d+$/i,
        
        // Test/placeholder keywords
        /^(Placeholder|Test Team|Sample|Generic|Fake|Mock|Demo|Example)/i,
        /^(TBD|TBA|To Be Determined|To Be Announced|Unknown|Pending)/i,
        
        // Suspicious generic patterns
        /^(Team|Club|FC|SC|Squad|Side|Unit) \d+$/i,
        /^[A-Z]{1,3} \d+$/,
        /^(Player|Athlete|Competitor|Participant) \d+$/i,
        
        // Names that are just numbers or minimal letters
        /^[\d\s]+$/,
        /^[A-Z\s]{1,2}$/,
        /^\d+$/,
        
        // Common fake/test patterns
        /^(Lorem|Ipsum|Test|Sample|Default|Temp|Temporary)/i,
        /^(Red|Blue|Green|Yellow|Black|White) (Team|Squad|Side)$/i,
        /^(Alpha|Beta|Gamma|Delta) (Team|Squad)$/i,
        
        // Regional mock patterns
        /^(City|Town|State|Country) \d+$/i,
        /^(North|South|East|West) (Team|Squad) \d*$/i,
        
        // Generic sports terms
        /^(Home|Away|Visitors|Hosts) \d*$/i,
        /^(Winners|Losers|Champions|Challengers) \d*$/i,
        
        // Empty or whitespace only
        /^\s*$/,
        
        // Single character names
        /^[A-Za-z]$/,
        
        // Obviously fake sequences
        /^(AAA|BBB|CCC|DDD|XXX|YYY|ZZZ)/i,
        /^(111|222|333|444|555|666|777|888|999|000)/,
        
        // Placeholder with underscores or dashes
        /^(Team|Player|Athlete)[-_]\d+$/i,
        /^(Home|Away)[-_](Team|Side|Squad)$/i,
        
        // Generic location-based fake names
        /^(Local|Regional|National|International) (Team|Squad|Club)$/i,
      ];

      // Check against all placeholder patterns
      for (const pattern of placeholderPatterns) {
        if (pattern.test(name)) {
          console.log(`❌ Placeholder team name detected: "${name}" (matches pattern: ${pattern})`);
          return false;
        }
      }

      // Should contain actual letters (not just numbers/symbols)
      if (!/[a-zA-Z]/.test(name)) {
        console.log(`❌ Team name has no letters: "${name}"`);
        return false;
      }

      // Should not be purely numeric
      if (/^\d+$/.test(name)) {
        console.log(`❌ Team name is purely numeric: "${name}"`);
        return false;
      }

      // Should not be too generic (single common words)
      const genericWords = [
        'team', 'home', 'away', 'local', 'visitor', 'player', 'competitor',
        'red', 'blue', 'green', 'yellow', 'black', 'white', 'alpha', 'beta',
        'gamma', 'delta', 'north', 'south', 'east', 'west', 'city', 'town',
        'state', 'country', 'winners', 'losers', 'champions', 'challengers'
      ];
      
      if (genericWords.includes(name.toLowerCase())) {
        console.log(`❌ Generic team name detected: "${name}"`);
        return false;
      }

      // Check for repetitive characters (more than 2 same consecutive chars)
      if (/(.)\1{2,}/.test(name)) {
        console.log(`❌ Repetitive character pattern detected: "${name}"`);
        return false;
      }

      // Check for keyboard sequences
      const keyboardSequences = ['qwerty', 'asdf', 'zxcv', '123456', 'abcdef'];
      const lowerName = name.toLowerCase();
      for (const seq of keyboardSequences) {
        if (lowerName.includes(seq)) {
          console.log(`❌ Keyboard sequence detected: "${name}"`);
          return false;
        }
      }

      return true;
    };

    const homeValid = isValidTeamName(homeTeam);
    const awayValid = isValidTeamName(awayTeam);

    if (!homeValid || !awayValid) {
      console.log(`❌ Invalid team names - Home: "${homeTeam}" (${homeValid}), Away: "${awayTeam}" (${awayValid})`);
      return false;
    }

    console.log(`✅ Valid team names - Home: "${homeTeam}", Away: "${awayTeam}"`);
    return true;
  }

  // Enhanced bookmaker validation
  static hasValidBookmakers(event: any): boolean {
    if (!event.bookmakers || !Array.isArray(event.bookmakers) || event.bookmakers.length === 0) {
      console.log(`❌ No bookmakers array for ${event.home_team} vs ${event.away_team}`);
      return false;
    }

    // Check if bookmakers have actual markets with realistic odds
    const hasValidMarkets = event.bookmakers.some((bookmaker: any) => 
      bookmaker.markets && bookmaker.markets.length > 0 &&
      bookmaker.markets.some((market: any) => 
        market.outcomes && market.outcomes.length > 0 &&
        market.outcomes.some((outcome: any) => {
          // Odds should be realistic (between 1.01 and 50.0 in decimal format)
          const price = outcome.price;
          return price && typeof price === 'number' && price >= 1.01 && price <= 50.0;
        })
      )
    );

    if (!hasValidMarkets) {
      console.log(`❌ No valid markets/realistic odds for ${event.home_team} vs ${event.away_team}`);
      return false;
    }

    console.log(`✅ Valid bookmakers found for ${event.home_team} vs ${event.away_team}`);
    return true;
  }

  // Enhanced time validation
  static hasValidStartTime(commenceTime: string, maxDaysInFuture: number = 14): boolean {
    if (!commenceTime) {
      console.log('❌ No commence_time provided');
      return false;
    }

    try {
      const eventTime = new Date(commenceTime);
      const now = new Date();
      
      // Check for invalid dates
      if (isNaN(eventTime.getTime())) {
        console.log(`❌ Invalid date format: ${commenceTime}`);
        return false;
      }

      const maxFutureTime = new Date(now.getTime() + (maxDaysInFuture * 24 * 60 * 60 * 1000));

      // Event should not be too far in the future
      if (eventTime > maxFutureTime) {
        console.log(`❌ Event too far in future: ${commenceTime} (more than ${maxDaysInFuture} days)`);
        return false;
      }

      // Event should not be too far in the past (more than 1 day for live events, 1 hour for upcoming)
      const oneDayAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));
      if (eventTime < oneDayAgo) {
        console.log(`❌ Event too far in past: ${commenceTime}`);
        return false;
      }

      console.log(`✅ Valid start time: ${commenceTime}`);
      return true;
    } catch (error) {
      console.log(`❌ Invalid commence_time format: ${commenceTime}`);
      return false;
    }
  }

  // Enhanced league/sport validation
  static hasValidLeagueAndSport(event: any): boolean {
    // Check sport_key validity
    const validSportKeys = [
      'americanfootball_nfl', 'basketball_nba', 'soccer_epl', 'soccer_uefa_champs_league',
      'baseball_mlb', 'icehockey_nhl', 'tennis_atp', 'golf_pga', 'mma_mixed_martial_arts',
      'boxing_heavyweight', 'cricket_icc', 'rugby_league_nrl', 'aussierules_afl'
    ];

    if (!event.sport_key || !validSportKeys.includes(event.sport_key)) {
      console.log(`❌ Invalid or suspicious sport_key: ${event.sport_key}`);
      return false;
    }

    // Check sport_title for placeholder patterns
    if (event.sport_title) {
      const suspiciousLeaguePatterns = [
        /^League \d+$/i,
        /^Sport \d+$/i,
        /^Test League$/i,
        /^Sample League$/i,
        /^Mock League$/i,
        /^Fake League$/i,
        /^TBD League$/i,
        /^Unknown League$/i,
      ];

      for (const pattern of suspiciousLeaguePatterns) {
        if (pattern.test(event.sport_title)) {
          console.log(`❌ Suspicious league name: ${event.sport_title}`);
          return false;
        }
      }
    }

    return true;
  }

  // Complete enhanced event validation
  static isValidEvent(event: any): boolean {
    if (!event) return false;

    // Must have valid ID
    if (!event.id || typeof event.id !== 'string') {
      console.log('❌ Event missing valid ID');
      return false;
    }

    // Must have valid sport key
    if (!event.sport_key || typeof event.sport_key !== 'string') {
      console.log('❌ Event missing valid sport_key');
      return false;
    }

    // Apply all enhanced validation checks
    const hasValidTeams = this.hasValidTeamNames(event.home_team, event.away_team);
    const hasValidBooks = this.hasValidBookmakers(event);
    const hasValidTime = this.hasValidStartTime(event.commence_time);
    const hasValidLeague = this.hasValidLeagueAndSport(event);

    const isValid = hasValidTeams && hasValidBooks && hasValidTime && hasValidLeague;
    
    if (isValid) {
      console.log(`✅ Event passed all enhanced validation: ${event.away_team} @ ${event.home_team}`);
    } else {
      console.log(`❌ Event failed enhanced validation: ${event.away_team} @ ${event.home_team}`);
    }

    return isValid;
  }

  // Filter array of events with enhanced validation
  static filterValidEvents(events: any[]): any[] {
    if (!Array.isArray(events)) return [];
    
    console.log(`🔍 Enhanced validation of ${events.length} events...`);
    
    const validEvents = events.filter(event => this.isValidEvent(event));
    
    console.log(`✅ Enhanced validation complete: ${validEvents.length}/${events.length} events passed`);
    
    return validEvents;
  }

  // Enhanced validation for upcoming events specifically
  static validateUpcomingEvents(events: any[]): any[] {
    return events.filter(event => {
      // Basic validation first
      if (!this.isValidEvent(event)) return false;

      // Additional upcoming-specific validation
      if (!event.homeTeam || !event.awayTeam) {
        console.log(`❌ Missing team names in upcoming event: ${event.id}`);
        return false;
      }

      // Check for placeholder team names in our format
      if (!this.hasValidTeamNames(event.homeTeam, event.awayTeam)) {
        return false;
      }

      // Check if odds look realistic for upcoming events
      if (event.moneylineHome && event.moneylineAway) {
        const homeOdds = parseInt(event.moneylineHome.replace(/[+\-]/g, ''));
        const awayOdds = parseInt(event.moneylineAway.replace(/[+\-]/g, ''));
        
        // More realistic odds range for upcoming events
        if (homeOdds < 100 || awayOdds < 100 || homeOdds > 2000 || awayOdds > 2000) {
          console.log(`❌ Unrealistic upcoming event odds: ${event.homeTeam} vs ${event.awayTeam}`);
          return false;
        }
      }

      // Ensure it's actually an upcoming event (not live)
      if (event.isLive || event.timeLeft === 'LIVE' || 
          event.timeLeft.includes('Q') || event.timeLeft.includes('H') ||
          event.timeLeft.includes("'") || event.timeLeft.includes('P')) {
        console.log(`❌ Live event in upcoming events: ${event.homeTeam} vs ${event.awayTeam}`);
        return false;
      }

      return true;
    });
  }

  // Enhanced validation for live events specifically
  static validateLiveEvents(events: any[]): any[] {
    return events.filter(event => {
      // Basic validation first
      if (!this.isValidEvent(event)) return false;

      // Ensure it's actually a live event
      if (!event.isLive && event.timeLeft !== 'LIVE' && 
          !event.timeLeft.includes('Q') && !event.timeLeft.includes('H') &&
          !event.timeLeft.includes("'") && !event.timeLeft.includes('P')) {
        console.log(`❌ Non-live event in live events: ${event.homeTeam || event.home_team} vs ${event.awayTeam || event.away_team}`);
        return false;
      }

      return true;
    });
  }
}
