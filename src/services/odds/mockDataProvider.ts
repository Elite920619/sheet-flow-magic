
export class MockDataProvider {
  // Enhanced regional team assignments with completely separate rosters
  private static regionalTeams: Record<string, Record<string, string[]>> = {
    soccer: {
      US: ['LA Galaxy', 'LAFC', 'Seattle Sounders', 'Portland Timbers', 'Atlanta United', 'Orlando City', 'NYC FC', 'NY Red Bulls', 'Inter Miami', 'Chicago Fire'],
      UK: ['Manchester United', 'Liverpool', 'Arsenal', 'Chelsea', 'Manchester City', 'Tottenham', 'Newcastle United', 'Brighton', 'West Ham', 'Leeds United'],
      EU: ['Bayern Munich', 'Borussia Dortmund', 'Real Madrid', 'Barcelona', 'PSG', 'Marseille', 'Juventus', 'AC Milan', 'Ajax', 'Porto'],
      AU: ['Melbourne Victory', 'Sydney FC', 'Perth Glory', 'Adelaide United', 'Western United', 'Melbourne City', 'Central Coast Mariners', 'Western Sydney', 'Brisbane Roar', 'Wellington Phoenix']
    },
    basketball: {
      US: ['Lakers', 'Warriors', 'Celtics', 'Heat', 'Bulls', 'Knicks', 'Nets', 'Rockets', 'Spurs', 'Clippers'],
      UK: ['London Lions', 'Leicester Riders', 'Newcastle Eagles', 'Plymouth Raiders', 'Sheffield Sharks', 'Manchester Giants', 'Bristol Flyers', 'Cheshire Phoenix'],
      EU: ['Barcelona', 'Real Madrid', 'CSKA Moscow', 'Fenerbahce', 'Panathinaikos', 'Olympiacos', 'Zalgiris', 'Maccabi Tel Aviv'],
      AU: ['Sydney Kings', 'Melbourne United', 'Perth Wildcats', 'Adelaide 36ers', 'Cairns Taipans', 'Illawarra Hawks', 'Brisbane Bullets', 'South East Melbourne Phoenix']
    },
    football: {
      US: ['Cowboys', 'Patriots', 'Packers', 'Steelers', '49ers', 'Giants', 'Chiefs', 'Ravens', 'Bengals', 'Bills'],
      UK: ['London Warriors', 'Birmingham Bulls', 'Manchester Titans', 'Edinburgh Wolves', 'Cardiff Dragons', 'Leeds Rhinos'],
      EU: ['Frankfurt Galaxy', 'Berlin Thunder', 'Hamburg Sea Devils', 'Cologne Centurions', 'Vienna Vikings', 'Barcelona Dragons'],
      AU: ['Sydney Swans', 'Melbourne Demons', 'Brisbane Lions', 'Adelaide Crows', 'Fremantle Dockers', 'West Coast Eagles']
    },
    baseball: {
      US: ['Yankees', 'Red Sox', 'Dodgers', 'Giants', 'Cubs', 'Cardinals', 'Astros', 'Braves', 'Mets', 'Phillies'],
      UK: ['London Mets', 'Essex Redbacks', 'Liverpool Trojans', 'Birmingham Barons', 'Manchester Storm', 'Leeds Pirates'],
      EU: ['Amsterdam Pirates', 'Berlin Sluggers', 'Paris Universe', 'Rome Capitals', 'Madrid Kings', 'Barcelona Eagles'],
      AU: ['Melbourne Aces', 'Sydney Blue Sox', 'Perth Heat', 'Adelaide Bite', 'Brisbane Bandits', 'Canberra Cavalry']
    },
    hockey: {
      US: ['Rangers', 'Bruins', 'Penguins', 'Blackhawks', 'Red Wings', 'Maple Leafs', 'Kings', 'Sharks', 'Lightning', 'Avalanche'],
      UK: ['Belfast Giants', 'Cardiff Devils', 'Sheffield Steelers', 'Nottingham Panthers', 'Glasgow Clan', 'Dundee Stars'],
      EU: ['SKA St. Petersburg', 'Dynamo Moscow', 'Jokerit Helsinki', 'Zurich Lions', 'Vienna Capitals', 'Berlin Eisbären'],
      AU: ['Sydney Bears', 'Melbourne Mustangs', 'Adelaide Adrenaline', 'Perth Thunder', 'Brisbane Blaze', 'Newcastle Northstars']
    },
    rugby: {
      US: ['USA Eagles', 'Chicago Lions', 'New York Rugby', 'Austin Huns', 'San Diego Legion', 'Seattle Seawolves'],
      UK: ['Leicester Tigers', 'Bath Rugby', 'Exeter Chiefs', 'Harlequins', 'Saracens', 'Northampton Saints'],
      EU: ['Toulouse', 'Leinster', 'Munster', 'Racing 92', 'La Rochelle', 'Ulster'],
      AU: ['Queensland Reds', 'NSW Waratahs', 'ACT Brumbies', 'Melbourne Rebels', 'Western Force', 'Fijian Drua']
    }
  };

  // Sports that support draw outcomes
  private static sportsWithDraws = ['soccer', 'rugby', 'hockey'];

  // Enhanced playoff game types with proper weights
  private static playoffGameTypes = {
    'Grand Final': 0.05,      // 5% chance - most rare
    'Championship': 0.05,     // 5% chance
    'Cup Final': 0.08,        // 8% chance
    'Semi-Final': 0.12,       // 12% chance
    'Quarter-Final': 0.15,    // 15% chance
    'Playoff Final': 0.10     // 10% chance
  };

  // Global team usage tracker with region tracking
  private static usedTeamsByRegion = new Map<string, Set<string>>();

  // Initialize region trackers
  static resetTeamUsage() {
    this.usedTeamsByRegion.clear();
    ['us', 'uk', 'eu', 'au'].forEach(region => {
      this.usedTeamsByRegion.set(region, new Set<string>());
    });
    console.log('🔄 Team usage reset - all regions cleared');
  }

  // Generate events for a specific region with enhanced playoff logic
  static generateRegionEvents(region: string, eventCount: number = 10): any[] {
    const sports = ['soccer', 'basketball', 'football', 'baseball', 'hockey', 'rugby'];
    const events: any[] = [];
    const regionKey = region.toUpperCase();
    
    // Ensure region tracker exists
    if (!this.usedTeamsByRegion.has(region)) {
      this.usedTeamsByRegion.set(region, new Set<string>());
    }
    
    console.log(`🎯 Generating ${eventCount} events for ${regionKey} region with enhanced playoff logic`);

    for (let i = 0; i < eventCount; i++) {
      const sport = sports[i % sports.length];
      const sportTeams = this.regionalTeams[sport]?.[regionKey] || [];
      
      if (sportTeams.length < 2) {
        console.warn(`⚠️ Not enough teams for ${sport} in ${regionKey}`);
        continue;
      }
      
      // Get unique team pair for this region
      const teamPair = this.getUniqueTeamPairForRegion(sportTeams, sport, region);
      if (!teamPair) {
        console.warn(`⚠️ No unique team pair available for ${sport} in ${regionKey}`);
        continue;
      }
      
      const { homeTeam, awayTeam } = teamPair;
      
      // Enhanced playoff determination logic
      const gameTypeInfo = this.determineGameType();
      const oddsData = this.generateRealisticOdds(sport, gameTypeInfo.isPlayoff);
      const leagueName = this.getLeagueName(sport, region, gameTypeInfo.type);

      const event = {
        id: `${region.toLowerCase()}_${sport}_${Date.now()}_${i}`,
        sport: sport,
        league: leagueName,
        gameType: gameTypeInfo.type,
        homeTeam: homeTeam,
        awayTeam: awayTeam,
        homeScore: Math.floor(Math.random() * 4),
        awayScore: Math.floor(Math.random() * 4),
        timeLeft: this.generateTimeLeft(),
        betStatus: 'Available',
        region: regionKey,
        moneylineHome: oddsData.moneylineHome,
        moneylineAway: oddsData.moneylineAway,
        moneylineDraw: oddsData.moneylineDraw,
        spread: oddsData.spread,
        total: oddsData.total,
        venue: `${homeTeam} Stadium`,
        attendance: `${Math.floor(Math.random() * 50000 + 20000).toLocaleString()}`,
        temperature: `${Math.floor(Math.random() * 30 + 10)}°C`,
        analysis: {
          confidence: Math.floor(Math.random() * 30) + 70,
          prediction: 'Live betting available',
          momentum: Math.random() > 0.5 ? 'Home' : 'Away'
        },
        homeLogo: '🏠',
        awayLogo: '✈️'
      };

      events.push(event);
    }

    console.log(`✅ Generated ${events.length} unique events for ${regionKey} with ${events.filter(e => e.gameType !== 'Regular Season').length} playoff games`);
    return events;
  }

  // Enhanced game type determination with weighted distribution
  private static determineGameType(): { type: string, isPlayoff: boolean } {
    const random = Math.random();
    
    // 25% chance for playoff games (more realistic)
    if (random < 0.25) {
      // Weighted selection of playoff types
      const playoffRandom = Math.random();
      let cumulativeWeight = 0;
      
      for (const [gameType, weight] of Object.entries(this.playoffGameTypes)) {
        cumulativeWeight += weight;
        if (playoffRandom <= cumulativeWeight) {
          return { type: gameType, isPlayoff: true };
        }
      }
      
      // Fallback to Semi-Final if no match
      return { type: 'Semi-Final', isPlayoff: true };
    }
    
    return { type: 'Regular Season', isPlayoff: false };
  }

  // Get unique team pair for specific region with strict tracking
  private static getUniqueTeamPairForRegion(teams: string[], sport: string, region: string): { homeTeam: string, awayTeam: string } | null {
    const maxAttempts = 100;
    let attempts = 0;
    const regionTracker = this.usedTeamsByRegion.get(region)!;
    
    while (attempts < maxAttempts) {
      const homeIndex = Math.floor(Math.random() * teams.length);
      let awayIndex = Math.floor(Math.random() * teams.length);
      
      // Ensure different teams
      while (awayIndex === homeIndex) {
        awayIndex = Math.floor(Math.random() * teams.length);
      }
      
      const homeTeam = teams[homeIndex];
      const awayTeam = teams[awayIndex];
      
      // Check if either team is already used in this region
      if (!regionTracker.has(homeTeam) && !regionTracker.has(awayTeam)) {
        // Mark teams as used in this region only
        regionTracker.add(homeTeam);
        regionTracker.add(awayTeam);
        
        console.log(`✅ Unique team pair for ${region.toUpperCase()}: ${awayTeam} @ ${homeTeam} (${sport})`);
        return { homeTeam, awayTeam };
      }
      
      attempts++;
    }
    
    console.warn(`❌ No unique team pair found for ${sport} in ${region.toUpperCase()} after ${maxAttempts} attempts`);
    return null;
  }

  private static getLeagueName(sport: string, region: string, gameType: string): string {
    const leagueNames: Record<string, Record<string, string>> = {
      soccer: {
        US: 'MLS',
        UK: 'Premier League',
        EU: 'Champions League',
        AU: 'A-League'
      },
      basketball: {
        US: 'NBA',
        UK: 'BBL',
        EU: 'EuroLeague',
        AU: 'NBL'
      },
      football: {
        US: 'NFL',
        UK: 'BAFA',
        EU: 'ELF',
        AU: 'GFA'
      },
      baseball: {
        US: 'MLB',
        UK: 'BBF',
        EU: 'CEB',
        AU: 'ABL'
      },
      hockey: {
        US: 'NHL',
        UK: 'EIHL',
        EU: 'KHL',
        AU: 'AIHL'
      },
      rugby: {
        US: 'MLR',
        UK: 'Premiership',
        EU: 'Champions Cup',
        AU: 'Super Rugby'
      }
    };

    const baseName = leagueNames[sport]?.[region.toUpperCase()] || `${region.toUpperCase()} ${sport.charAt(0).toUpperCase() + sport.slice(1)} League`;
    
    // Don't append game type to league name - it's handled separately in the UI
    return baseName;
  }

  getMockLiveEventsByRegion(region: string): any[] {
    const eventCount = Math.floor(Math.random() * 3) + 8; // 8-10 events per region
    return MockDataProvider.generateRegionEvents(region, eventCount);
  }

  getMockSports(): any[] {
    return [
      { key: 'soccer', title: 'Soccer', active: true, has_odds: true },
      { key: 'basketball', title: 'Basketball', active: true, has_odds: true },
      { key: 'football', title: 'American Football', active: true, has_odds: true },
      { key: 'baseball', title: 'Baseball', active: true, has_odds: true },
      { key: 'hockey', title: 'Ice Hockey', active: true, has_odds: true },
      { key: 'rugby', title: 'Rugby', active: true, has_odds: true }
    ];
  }

  private static generateRealisticOdds(sport: string, isPlayoffGame: boolean = false): {
    moneylineHome: string,
    moneylineAway: string,
    moneylineDraw: string | null,
    spread: string,
    total: string
  } {
    const homeOdds = Math.random() > 0.5 
      ? Math.floor(Math.random() * 300) + 105
      : -(Math.floor(Math.random() * 250) + 110);
    
    const awayOdds = Math.random() > 0.5 
      ? Math.floor(Math.random() * 350) + 120
      : -(Math.floor(Math.random() * 200) + 115);
    
    const drawOdds = Math.floor(Math.random() * 200) + 220;
    
    // Determine if sport supports draws AND it's not a playoff game
    const supportsDraws = this.sportsWithDraws.includes(sport) && !isPlayoffGame;
    
    let spread, total;
    switch (sport) {
      case 'football':
        spread = `${Math.random() > 0.5 ? '+' : '-'}${(Math.random() * 14 + 1).toFixed(1)} (${this.formatOdds(Math.floor(Math.random() * 40) - 120)})`;
        total = `${(42 + Math.random() * 16).toFixed(1)}`;
        break;
      case 'basketball':
        spread = `${Math.random() > 0.5 ? '+' : '-'}${(Math.random() * 12 + 1).toFixed(1)} (${this.formatOdds(Math.floor(Math.random() * 40) - 120)})`;
        total = `${(205 + Math.random() * 30).toFixed(1)}`;
        break;
      case 'baseball':
        spread = `${Math.random() > 0.5 ? '+' : '-'}1.5 (${this.formatOdds(Math.floor(Math.random() * 60) - 130)})`;
        total = `${(8 + Math.random() * 4).toFixed(1)}`;
        break;
      case 'hockey':
        spread = `${Math.random() > 0.5 ? '+' : '-'}1.5 (${this.formatOdds(Math.floor(Math.random() * 80) - 140)})`;
        total = `${(5.5 + Math.random() * 2).toFixed(1)}`;
        break;
      case 'soccer':
        spread = 'N/A';
        total = `${(2.5 + Math.random() * 2).toFixed(1)}`;
        break;
      case 'rugby':
        spread = `${Math.random() > 0.5 ? '+' : '-'}${(Math.random() * 20 + 5).toFixed(1)} (${this.formatOdds(Math.floor(Math.random() * 40) - 120)})`;
        total = `${(35 + Math.random() * 20).toFixed(1)}`;
        break;
      default:
        spread = `${Math.random() > 0.5 ? '+' : '-'}${(Math.random() * 10).toFixed(1)} (${this.formatOdds(Math.floor(Math.random() * 40) - 120)})`;
        total = `${(40 + Math.random() * 20).toFixed(1)}`;
    }
    
    return {
      moneylineHome: this.formatOdds(homeOdds),
      moneylineAway: this.formatOdds(awayOdds),
      moneylineDraw: supportsDraws && Math.random() > 0.3 ? this.formatOdds(drawOdds) : null,
      spread,
      total
    };
  }

  private static formatOdds(odds: number): string {
    if (!odds || odds === 0) return 'N/A';
    return odds > 0 ? `+${odds}` : `${odds}`;
  }

  private static generateTimeLeft(): string {
    const liveStatuses = ['LIVE', '1Q', '2Q', '3Q', '4Q', '1H', '2H', 'OT'];
    return liveStatuses[Math.floor(Math.random() * liveStatuses.length)];
  }
}
