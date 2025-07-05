
export class DataValidator {
  
  // Enhanced validation for placeholder/fake team names
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

      // Enhanced patterns for detecting placeholder/fake team names
      const placeholderPatterns = [
        // Exact matches for common placeholder names
        /^Team A$/i,
        /^Team B$/i,
        /^Home Team$/i,
        /^Away Team$/i,
        
        // Regional placeholder patterns (US Team 7, UK Team 3, etc.)
        /^(US|UK|EU|AU|United States|United Kingdom|Europe|Australia) Team \d+$/i,
        
        // Generic numbered teams
        /^Team \d+$/i,
        /^(Home|Away|Local|Visitor) \d+$/i,
        
        // Test/placeholder keywords
        /^(Placeholder|Test Team|Sample|Generic|Fake|Mock|Demo)/i,
        /^(TBD|TBA|To Be Determined|To Be Announced|Unknown)/i,
        
        // Suspicious generic patterns
        /^(Team|Club|FC|SC|Squad) \d+$/i,
        /^[A-Z]{1,3} \d+$/,
        /^(Player|Athlete|Competitor) \d+$/i,
        
        // Names that are just numbers or minimal letters
        /^[\d\s]+$/,
        /^[A-Z\s]{1,2}$/,
        /^\d+$/
      ];

      // Check against placeholder patterns
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

      // Additional check for very generic single words
      const genericWords = ['team', 'home', 'away', 'local', 'visitor', 'player', 'competitor'];
      if (genericWords.includes(name.toLowerCase())) {
        console.log(`❌ Generic team name detected: "${name}"`);
        return false;
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

  // Validate bookmakers array has actual odds data
  static hasValidBookmakers(event: any): boolean {
    if (!event.bookmakers || !Array.isArray(event.bookmakers) || event.bookmakers.length === 0) {
      console.log(`❌ No bookmakers array for ${event.home_team} vs ${event.away_team}`);
      return false;
    }

    // Check if bookmakers have actual markets with outcomes and prices
    const hasValidMarkets = event.bookmakers.some((bookmaker: any) => 
      bookmaker.markets && bookmaker.markets.length > 0 &&
      bookmaker.markets.some((market: any) => 
        market.outcomes && market.outcomes.length > 0 &&
        market.outcomes.some((outcome: any) => 
          outcome.price && typeof outcome.price === 'number' && outcome.price > 0
        )
      )
    );

    if (!hasValidMarkets) {
      console.log(`❌ No valid markets/odds for ${event.home_team} vs ${event.away_team}`);
      return false;
    }

    console.log(`✅ Valid bookmakers found for ${event.home_team} vs ${event.away_team}`);
    return true;
  }

  // Check if event start time is within acceptable range
  static hasValidStartTime(commenceTime: string, maxDaysInFuture: number = 7): boolean {
    if (!commenceTime) {
      console.log('❌ No commence_time provided');
      return false;
    }

    try {
      const eventTime = new Date(commenceTime);
      const now = new Date();
      const maxFutureTime = new Date(now.getTime() + (maxDaysInFuture * 24 * 60 * 60 * 1000));

      // Event should not be too far in the future
      if (eventTime > maxFutureTime) {
        console.log(`❌ Event too far in future: ${commenceTime} (more than ${maxDaysInFuture} days)`);
        return false;
      }

      // Event should not be too far in the past (more than 1 day)
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

  // Complete event validation
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

    // Apply all validation checks
    const hasValidTeams = this.hasValidTeamNames(event.home_team, event.away_team);
    const hasValidBooks = this.hasValidBookmakers(event);
    const hasValidTime = this.hasValidStartTime(event.commence_time);

    const isValid = hasValidTeams && hasValidBooks && hasValidTime;
    
    if (isValid) {
      console.log(`✅ Event passed all validation: ${event.away_team} @ ${event.home_team}`);
    } else {
      console.log(`❌ Event failed validation: ${event.away_team} @ ${event.home_team}`);
    }

    return isValid;
  }

  // Filter array of events
  static filterValidEvents(events: any[]): any[] {
    if (!Array.isArray(events)) return [];
    
    console.log(`🔍 Validating ${events.length} events...`);
    
    const validEvents = events.filter(event => this.isValidEvent(event));
    
    console.log(`✅ Validation complete: ${validEvents.length}/${events.length} events passed`);
    
    return validEvents;
  }

  // Validate upcoming events specifically
  static validateUpcomingEvents(events: any[]): any[] {
    return events.filter(event => {
      // Basic validation
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

      // Check if odds look realistic
      if (event.moneylineHome && event.moneylineAway) {
        const homeOdds = parseInt(event.moneylineHome.replace(/[+\-]/g, ''));
        const awayOdds = parseInt(event.moneylineAway.replace(/[+\-]/g, ''));
        
        if (homeOdds < 50 || awayOdds < 50 || homeOdds > 5000 || awayOdds > 5000) {
          console.log(`❌ Unrealistic odds detected: ${event.homeTeam} vs ${event.awayTeam}`);
          return false;
        }
      }

      return true;
    });
  }
}
