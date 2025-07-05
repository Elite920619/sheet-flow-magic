
export class EnhancedDataValidator {
  
  // Comprehensive fake/placeholder detection with multiple validation layers
  static detectFakeData(event: any): { isFake: boolean; reasons: string[] } {
    const reasons: string[] = [];
    
    // Team name validation with extensive placeholder patterns
    const teamValidation = this.validateTeamNames(event.home_team, event.away_team);
    if (!teamValidation.isValid) {
      reasons.push(...teamValidation.reasons);
    }
    
    // Timestamp validation
    const timeValidation = this.validateTimestamp(event.commence_time);
    if (!timeValidation.isValid) {
      reasons.push(...timeValidation.reasons);
    }
    
    // Odds validation
    const oddsValidation = this.validateOdds(event.bookmakers);
    if (!oddsValidation.isValid) {
      reasons.push(...oddsValidation.reasons);
    }
    
    // Bookmaker validation
    const bookmakerValidation = this.validateBookmakers(event.bookmakers);
    if (!bookmakerValidation.isValid) {
      reasons.push(...bookmakerValidation.reasons);
    }
    
    // League/Sport validation
    const sportValidation = this.validateSportData(event);
    if (!sportValidation.isValid) {
      reasons.push(...sportValidation.reasons);
    }
    
    return {
      isFake: reasons.length > 0,
      reasons
    };
  }
  
  private static validateTeamNames(homeTeam: string, awayTeam: string) {
    const reasons: string[] = [];
    
    if (!homeTeam || !awayTeam) {
      reasons.push('Missing team names');
      return { isValid: false, reasons };
    }
    
    // Comprehensive placeholder patterns
    const placeholderPatterns = [
      // Basic placeholder patterns
      /^Team [A-Z0-9]+$/i,
      /^(Home|Away) Team$/i,
      /^Team \d+$/i,
      /^(Player|Athlete|Competitor) \d+$/i,
      
      // Regional placeholder patterns
      /^(US|UK|EU|AU|United States|United Kingdom|Europe|Australia) Team \d+$/i,
      
      // Generic patterns
      /^(Red|Blue|Green|Yellow|Black|White|Alpha|Beta|Gamma|Delta) (Team|Squad|Side)$/i,
      /^(North|South|East|West) (Team|Squad|Side) \d*$/i,
      /^(City|Town|State|Country) \d+$/i,
      
      // Test/demo patterns
      /^(Test|Sample|Demo|Mock|Fake|Placeholder|TBD|TBA|Unknown|Pending)/i,
      /^(Lorem|Ipsum|Default|Temp|Temporary)/i,
      
      // Suspicious patterns
      /^[A-Z]{1,3} \d+$/,
      /^[\d\s]+$/,
      /^\d+$/,
      /^[A-Za-z]$/,
      /^(AAA|BBB|CCC|DDD|XXX|YYY|ZZZ)/i,
      /^(111|222|333|444|555|666|777|888|999|000)/,
      
      // Keyboard sequences
      /qwerty|asdf|zxcv|123456|abcdef/i,
      
      // Generic single words
      /^(team|home|away|local|visitor|player|competitor|red|blue|green|yellow|black|white|alpha|beta|gamma|delta|north|south|east|west|city|town|state|country|winners|losers|champions|challengers)$/i
    ];
    
    const checkTeam = (teamName: string, teamType: string) => {
      const name = teamName.trim();
      
      // Check against all patterns
      for (const pattern of placeholderPatterns) {
        if (pattern.test(name)) {
          reasons.push(`${teamType} team "${name}" matches placeholder pattern: ${pattern}`);
          return false;
        }
      }
      
      // Additional checks
      if (name.length < 2) {
        reasons.push(`${teamType} team name too short: "${name}"`);
        return false;
      }
      
      if (!/[a-zA-Z]/.test(name)) {
        reasons.push(`${teamType} team name has no letters: "${name}"`);
        return false;
      }
      
      if (/(.)\1{2,}/.test(name)) {
        reasons.push(`${teamType} team name has repetitive characters: "${name}"`);
        return false;
      }
      
      return true;
    };
    
    const homeValid = checkTeam(homeTeam, 'Home');
    const awayValid = checkTeam(awayTeam, 'Away');
    
    // Teams can't be identical
    if (homeTeam.trim() === awayTeam.trim()) {
      reasons.push(`Identical team names: ${homeTeam}`);
    }
    
    return {
      isValid: homeValid && awayValid && homeTeam.trim() !== awayTeam.trim(),
      reasons
    };
  }
  
  private static validateTimestamp(commenceTime: string) {
    const reasons: string[] = [];
    
    if (!commenceTime) {
      reasons.push('Missing commence time');
      return { isValid: false, reasons };
    }
    
    try {
      const eventTime = new Date(commenceTime);
      const now = new Date();
      
      if (isNaN(eventTime.getTime())) {
        reasons.push(`Invalid date format: ${commenceTime}`);
        return { isValid: false, reasons };
      }
      
      // Check for suspicious timestamps
      const year = eventTime.getFullYear();
      if (year < 2020 || year > 2030) {
        reasons.push(`Suspicious year in timestamp: ${year}`);
      }
      
      // Check for Unix epoch (1970-01-01)
      if (eventTime.getTime() < new Date('2020-01-01').getTime()) {
        reasons.push(`Timestamp too old, likely fake: ${commenceTime}`);
      }
      
      // Check if too far in future (more than 1 year)
      const oneYearFromNow = new Date(now.getTime() + (365 * 24 * 60 * 60 * 1000));
      if (eventTime > oneYearFromNow) {
        reasons.push(`Event too far in future: ${commenceTime}`);
      }
      
    } catch (error) {
      reasons.push(`Invalid timestamp format: ${commenceTime}`);
    }
    
    return {
      isValid: reasons.length === 0,
      reasons
    };
  }
  
  private static validateOdds(bookmakers: any[]) {
    const reasons: string[] = [];
    
    if (!bookmakers || bookmakers.length === 0) {
      reasons.push('No bookmakers data');
      return { isValid: false, reasons };
    }
    
    let hasValidOdds = false;
    const allOdds: number[] = [];
    
    for (const bookmaker of bookmakers) {
      if (!bookmaker.markets || bookmaker.markets.length === 0) {
        continue;
      }
      
      for (const market of bookmaker.markets) {
        if (!market.outcomes || market.outcomes.length === 0) {
          continue;
        }
        
        for (const outcome of market.outcomes) {
          const price = outcome.price;
          
          if (typeof price === 'number' && price > 1.01 && price <= 50.0) {
            hasValidOdds = true;
            allOdds.push(price);
          }
        }
      }
    }
    
    if (!hasValidOdds) {
      reasons.push('No realistic odds found (should be between 1.01 and 50.0)');
    }
    
    // Check for suspicious odds patterns
    if (allOdds.length > 0) {
      // All odds exactly the same (suspicious)
      const uniqueOdds = [...new Set(allOdds)];
      if (uniqueOdds.length === 1) {
        reasons.push(`All odds identical: ${uniqueOdds[0]} (suspicious)`);
      }
      
      // All odds are round numbers (suspicious)
      const allRoundNumbers = allOdds.every(odd => odd % 1 === 0);
      if (allRoundNumbers && allOdds.length > 2) {
        reasons.push('All odds are round numbers (suspicious)');
      }
      
      // Check for unrealistic odds (too low or too high)
      const suspiciousOdds = allOdds.filter(odd => odd <= 1.01 || odd >= 100);
      if (suspiciousOdds.length > 0) {
        reasons.push(`Unrealistic odds detected: ${suspiciousOdds.join(', ')}`);
      }
    }
    
    return {
      isValid: reasons.length === 0,
      reasons
    };
  }
  
  private static validateBookmakers(bookmakers: any[]) {
    const reasons: string[] = [];
    
    if (!bookmakers || bookmakers.length === 0) {
      reasons.push('No bookmakers');
      return { isValid: false, reasons };
    }
    
    // Known suspicious/fake bookmaker names
    const suspiciousBookmakers = [
      /^Bookmaker \d+$/i,
      /^Test Bookmaker$/i,
      /^Sample Bookmaker$/i,
      /^Fake Bookmaker$/i,
      /^Demo Bookmaker$/i,
      /^Placeholder Bookmaker$/i,
      /^Unknown Bookmaker$/i,
      /^Generic Bookmaker$/i,
      /^Mock Bookmaker$/i,
      /^TBD$/i,
      /^TBA$/i,
      /^\d+$/,
      /^[A-Z]{1,2}$/,
    ];
    
    let validBookmakerCount = 0;
    
    for (const bookmaker of bookmakers) {
      if (!bookmaker.title || typeof bookmaker.title !== 'string') {
        continue;
      }
      
      const title = bookmaker.title.trim();
      let isSuspicious = false;
      
      for (const pattern of suspiciousBookmakers) {
        if (pattern.test(title)) {
          reasons.push(`Suspicious bookmaker name: "${title}"`);
          isSuspicious = true;
          break;
        }
      }
      
      if (!isSuspicious && title.length >= 3) {
        validBookmakerCount++;
      }
    }
    
    if (validBookmakerCount === 0) {
      reasons.push('No valid bookmakers found');
    }
    
    return {
      isValid: reasons.length === 0,
      reasons
    };
  }
  
  private static validateSportData(event: any) {
    const reasons: string[] = [];
    
    // Validate sport key
    const validSportKeys = [
      'americanfootball_nfl', 'americanfootball_cfl', 'americanfootball_ncaaf',
      'basketball_nba', 'basketball_wnba', 'basketball_ncaab',
      'soccer_epl', 'soccer_uefa_champs_league', 'soccer_germany_bundesliga',
      'soccer_spain_la_liga', 'soccer_italy_serie_a', 'soccer_france_ligue_one',
      'soccer_usa_mls', 'soccer_brazil_campeonato', 'soccer_argentina_primera_division',
      'baseball_mlb', 'icehockey_nhl', 'tennis_atp', 'tennis_wta',
      'golf_pga', 'mma_mixed_martial_arts', 'boxing_heavyweight',
      'cricket_icc', 'rugby_league_nrl', 'aussierules_afl'
    ];
    
    if (!event.sport_key || !validSportKeys.includes(event.sport_key)) {
      reasons.push(`Invalid or unknown sport key: ${event.sport_key}`);
    }
    
    // Validate sport title for suspicious patterns
    if (event.sport_title) {
      const suspiciousLeaguePatterns = [
        /^League \d+$/i,
        /^Sport \d+$/i,
        /^Test League$/i,
        /^Sample League$/i,
        /^Mock League$/i,
        /^Fake League$/i,
        /^Demo League$/i,
        /^TBD League$/i,
        /^Unknown League$/i,
        /^Generic League$/i,
        /^Placeholder League$/i,
      ];
      
      for (const pattern of suspiciousLeaguePatterns) {
        if (pattern.test(event.sport_title)) {
          reasons.push(`Suspicious league name: ${event.sport_title}`);
          break;
        }
      }
    }
    
    return {
      isValid: reasons.length === 0,
      reasons
    };
  }
  
  // Filter array of events with comprehensive validation
  static filterRealEvents(events: any[]): any[] {
    if (!Array.isArray(events)) return [];
    
    console.log(`🔍 Enhanced validation of ${events.length} events...`);
    
    const validEvents = events.filter(event => {
      const validation = this.detectFakeData(event);
      
      if (validation.isFake) {
        console.log(`❌ Rejected fake event: ${event.away_team} @ ${event.home_team}`, validation.reasons);
        return false;
      }
      
      console.log(`✅ Valid event: ${event.away_team} @ ${event.home_team}`);
      return true;
    });
    
    console.log(`✅ Enhanced validation complete: ${validEvents.length}/${events.length} events passed`);
    
    return validEvents;
  }
}
