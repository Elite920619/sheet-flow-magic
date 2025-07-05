export class UpcomingEventsMockService {
  
  generateComprehensiveUpcomingEvents(): any[] {
    console.log('🌍 Generating comprehensive upcoming events from sports worldwide...');
    
    const events: any[] = [];
    const now = new Date();
    
    // Comprehensive sports coverage from around the world
    const worldwideSports = {
      // North American Sports
      football: this.generateFootballEvents(),
      basketball: this.generateBasketballEvents(),
      baseball: this.generateBaseballEvents(),
      hockey: this.generateHockeyEvents(),
      
      // Global Soccer/Football
      soccer: this.generateSoccerEvents(),
      
      // Individual Sports
      tennis: this.generateTennisEvents(),
      golf: this.generateGolfEvents(),
      
      // Combat Sports
      mma: this.generateMMAEvents(),
      boxing: this.generateBoxingEvents(),
      
      // Other Popular Sports
      cricket: this.generateCricketEvents(),
      rugby: this.generateRugbyEvents(),
      aussie_rules: this.generateAussieRulesEvents(),
    };

    Object.entries(worldwideSports).forEach(([sport, sportEvents]) => {
      events.push(...sportEvents.map(event => ({
        ...event,
        sport,
        isLive: false,
        betStatus: 'Available',
        // Ensure upcoming times (1 hour to 7 days from now)
        commenceTime: this.generateUpcomingTime(),
        timeLeft: this.calculateTimeLeft(event.commenceTime || this.generateUpcomingTime())
      })));
    });

    console.log(`✅ Generated ${events.length} comprehensive worldwide upcoming events`);
    return events;
  }

  private generateUpcomingTime(): string {
    const now = new Date();
    const hoursFromNow = Math.floor(Math.random() * 160) + 2; // 2 to 162 hours from now
    const eventTime = new Date(now.getTime() + (hoursFromNow * 60 * 60 * 1000));
    return eventTime.toISOString();
  }

  private calculateTimeLeft(commenceTime: string): string {
    const now = new Date();
    const eventTime = new Date(commenceTime);
    const hoursUntil = Math.round((eventTime.getTime() - now.getTime()) / (1000 * 60 * 60));
    
    if (hoursUntil < 24) {
      return `${hoursUntil}h`;
    } else {
      const days = Math.floor(hoursUntil / 24);
      return `${days}d ${hoursUntil % 24}h`;
    }
  }

  private generateFootballEvents(): any[] {
    const teams = [
      'Kansas City Chiefs', 'Buffalo Bills', 'Cincinnati Bengals', 'Baltimore Ravens',
      'Miami Dolphins', 'New York Jets', 'Pittsburgh Steelers', 'Cleveland Browns',
      'Houston Texans', 'Indianapolis Colts', 'Tennessee Titans', 'Jacksonville Jaguars',
      'Las Vegas Raiders', 'Los Angeles Chargers', 'Denver Broncos',
      'Philadelphia Eagles', 'Dallas Cowboys', 'New York Giants', 'Washington Commanders',
      'San Francisco 49ers', 'Seattle Seahawks', 'Los Angeles Rams', 'Arizona Cardinals'
    ];

    return this.generateMatchups(teams, 'NFL', 8);
  }

  private generateBasketballEvents(): any[] {
    const teams = [
      'Boston Celtics', 'Miami Heat', 'Philadelphia 76ers', 'New York Knicks',
      'Brooklyn Nets', 'Toronto Raptors', 'Chicago Bulls', 'Atlanta Hawks',
      'Milwaukee Bucks', 'Indiana Pacers', 'Detroit Pistons', 'Cleveland Cavaliers',
      'Orlando Magic', 'Washington Wizards', 'Charlotte Hornets',
      'Denver Nuggets', 'Phoenix Suns', 'Memphis Grizzlies', 'Sacramento Kings',
      'Golden State Warriors', 'Los Angeles Clippers', 'Los Angeles Lakers'
    ];

    return this.generateMatchups(teams, 'NBA', 12);
  }

  private generateBaseballEvents(): any[] {
    const teams = [
      'New York Yankees', 'Boston Red Sox', 'Tampa Bay Rays', 'Toronto Blue Jays',
      'Baltimore Orioles', 'Houston Astros', 'Texas Rangers', 'Seattle Mariners',
      'Los Angeles Angels', 'Oakland Athletics', 'Atlanta Braves', 'Philadelphia Phillies',
      'New York Mets', 'Miami Marlins', 'Washington Nationals', 'Milwaukee Brewers',
      'St. Louis Cardinals', 'Chicago Cubs', 'Pittsburgh Pirates', 'Cincinnati Reds',
      'Los Angeles Dodgers', 'San Diego Padres', 'San Francisco Giants'
    ];

    return this.generateMatchups(teams, 'MLB', 10);
  }

  private generateHockeyEvents(): any[] {
    const teams = [
      'Boston Bruins', 'Toronto Maple Leafs', 'Tampa Bay Lightning', 'Florida Panthers',
      'Buffalo Sabres', 'Ottawa Senators', 'Montreal Canadiens', 'Detroit Red Wings',
      'New York Rangers', 'New York Islanders', 'Philadelphia Flyers', 'Pittsburgh Penguins',
      'Washington Capitals', 'Carolina Hurricanes', 'New Jersey Devils', 'Columbus Blue Jackets',
      'Vegas Golden Knights', 'Colorado Avalanche', 'Dallas Stars', 'Nashville Predators'
    ];

    return this.generateMatchups(teams, 'NHL', 8);
  }

  private generateSoccerEvents(): any[] {
    const leagues = [
      { name: 'Premier League', teams: ['Manchester City', 'Arsenal', 'Liverpool', 'Chelsea', 'Newcastle United', 'Manchester United', 'Tottenham', 'Brighton', 'Aston Villa', 'West Ham'] },
      { name: 'La Liga', teams: ['Real Madrid', 'Barcelona', 'Atletico Madrid', 'Sevilla', 'Real Betis', 'Villarreal', 'Real Sociedad', 'Athletic Bilbao'] },
      { name: 'Bundesliga', teams: ['Bayern Munich', 'Borussia Dortmund', 'RB Leipzig', 'Union Berlin', 'SC Freiburg', 'Bayer Leverkusen', 'Eintracht Frankfurt'] },
      { name: 'Serie A', teams: ['Inter Milan', 'AC Milan', 'Napoli', 'Juventus', 'AS Roma', 'Lazio', 'Atalanta', 'Fiorentina'] },
      { name: 'Ligue 1', teams: ['Paris Saint-Germain', 'Marseille', 'Monaco', 'Lyon', 'Lille', 'Rennes', 'Nice'] }
    ];

    const events: any[] = [];
    leagues.forEach(league => {
      events.push(...this.generateMatchups(league.teams, league.name, 4));
    });

    return events;
  }

  private generateTennisEvents(): any[] {
    const players = [
      'Novak Djokovic', 'Carlos Alcaraz', 'Daniil Medvedev', 'Jannik Sinner',
      'Andrey Rublev', 'Stefanos Tsitsipas', 'Alexander Zverev', 'Holger Rune',
      'Taylor Fritz', 'Casper Ruud', 'Iga Swiatek', 'Aryna Sabalenka',
      'Coco Gauff', 'Jessica Pegula', 'Elena Rybakina', 'Ons Jabeur'
    ];

    return this.generateIndividualMatchups(players, 'ATP/WTA Tour', 6);
  }

  private generateGolfEvents(): any[] {
    const players = [
      'Scottie Scheffler', 'Jon Rahm', 'Viktor Hovland', 'Xander Schauffele',
      'Patrick Cantlay', 'Wyndham Clark', 'Brian Harman', 'Max Homa',
      'Collin Morikawa', 'Justin Thomas', 'Jordan Spieth', 'Rory McIlroy'
    ];

    return this.generateIndividualMatchups(players, 'PGA Tour', 4);
  }

  private generateMMAEvents(): any[] {
    const fighters = [
      'Jon Jones', 'Alexander Volkanovski', 'Islam Makhachev', 'Leon Edwards',
      'Aljamain Sterling', 'Brandon Moreno', 'Amanda Nunes', 'Valentina Shevchenko',
      'Zhang Weili', 'Rose Namajunas', 'Julianna Pena', 'Carla Esparza'
    ];

    return this.generateIndividualMatchups(fighters, 'UFC', 3);
  }

  private generateBoxingEvents(): any[] {
    const boxers = [
      'Tyson Fury', 'Oleksandr Usyk', 'Anthony Joshua', 'Deontay Wilder',
      'Andy Ruiz Jr', 'Luis Ortiz', 'Canelo Alvarez', 'Gennady Golovkin',
      'Jermall Charlo', 'David Benavidez', 'Terence Crawford', 'Errol Spence Jr'
    ];

    return this.generateIndividualMatchups(boxers, 'Boxing', 3);
  }

  private generateCricketEvents(): any[] {
    const teams = [
      'India', 'Australia', 'England', 'New Zealand', 'South Africa',
      'Pakistan', 'Sri Lanka', 'Bangladesh', 'West Indies', 'Afghanistan'
    ];

    return this.generateMatchups(teams, 'International Cricket', 4);
  }

  private generateRugbyEvents(): any[] {
    const teams = [
      'All Blacks', 'Springboks', 'Wallabies', 'England', 'France',
      'Ireland', 'Wales', 'Scotland', 'Argentina', 'Italy'
    ];

    return this.generateMatchups(teams, 'International Rugby', 3);
  }

  private generateAussieRulesEvents(): any[] {
    const teams = [
      'Melbourne Demons', 'Sydney Swans', 'Collingwood Magpies', 'Brisbane Lions',
      'Port Adelaide Power', 'Geelong Cats', 'Carlton Blues', 'Richmond Tigers',
      'Western Bulldogs', 'St Kilda Saints', 'Adelaide Crows', 'Essendon Bombers'
    ];

    return this.generateMatchups(teams, 'AFL', 4);
  }

  private generateMatchups(teams: string[], league: string, count: number): any[] {
    const events: any[] = [];
    const usedPairs = new Set<string>();

    for (let i = 0; i < count && i < Math.floor(teams.length / 2); i++) {
      let homeTeam: string, awayTeam: string, pairKey: string;
      
      do {
        homeTeam = teams[Math.floor(Math.random() * teams.length)];
        awayTeam = teams[Math.floor(Math.random() * teams.length)];
        pairKey = [homeTeam, awayTeam].sort().join('-');
      } while (homeTeam === awayTeam || usedPairs.has(pairKey));
      
      usedPairs.add(pairKey);

      const commenceTime = this.generateUpcomingTime();
      
      events.push({
        id: `upcoming_${league.toLowerCase().replace(/\s/g, '_')}_${i}_${Date.now()}`,
        homeTeam,
        awayTeam,
        league,
        homeScore: 0,
        awayScore: 0,
        moneylineHome: this.generateRealisticOdds(),
        moneylineAway: this.generateRealisticOdds(),
        spread: 'N/A',
        total: 'N/A',
        venue: `${homeTeam} Stadium`,
        commenceTime,
        gameType: 'Regular Season',
        region: this.getRegionForLeague(league),
        analysis: {
          confidence: Math.floor(Math.random() * 30) + 60,
          prediction: 'Pre-game analysis available',
          momentum: Math.random() > 0.5 ? homeTeam : awayTeam
        },
        homeLogo: '🏠',
        awayLogo: '✈️'
      });
    }

    return events;
  }

  private generateIndividualMatchups(participants: string[], league: string, count: number): any[] {
    const events: any[] = [];
    const usedPairs = new Set<string>();

    for (let i = 0; i < count && i < Math.floor(participants.length / 2); i++) {
      let player1: string, player2: string, pairKey: string;
      
      do {
        player1 = participants[Math.floor(Math.random() * participants.length)];
        player2 = participants[Math.floor(Math.random() * participants.length)];
        pairKey = [player1, player2].sort().join('-');
      } while (player1 === player2 || usedPairs.has(pairKey));
      
      usedPairs.add(pairKey);

      const commenceTime = this.generateUpcomingTime();
      
      events.push({
        id: `upcoming_${league.toLowerCase().replace(/\s/g, '_')}_${i}_${Date.now()}`,
        homeTeam: player1,
        awayTeam: player2,
        league,
        homeScore: 0,
        awayScore: 0,
        moneylineHome: this.generateRealisticOdds(),
        moneylineAway: this.generateRealisticOdds(),
        spread: 'N/A',
        total: 'N/A',
        venue: `${league} Venue`,
        commenceTime,
        gameType: 'Tournament',
        region: this.getRegionForLeague(league),
        analysis: {
          confidence: Math.floor(Math.random() * 25) + 65,
          prediction: 'Pre-match analysis available',
          momentum: Math.random() > 0.5 ? player1 : player2
        },
        homeLogo: '🥇',
        awayLogo: '🥈'
      });
    }

    return events;
  }

  private generateRealisticOdds(): string {
    const odds = Math.floor(Math.random() * 800) + 120; // Between +120 and +920
    return Math.random() > 0.5 ? `+${odds}` : `-${Math.floor(odds * 0.8)}`;
  }

  private getRegionForLeague(league: string): string {
    const regionMap: { [key: string]: string } = {
      'NFL': 'US',
      'NBA': 'US', 
      'MLB': 'US',
      'NHL': 'US',
      'Premier League': 'UK',
      'La Liga': 'EU',
      'Bundesliga': 'EU',
      'Serie A': 'EU',
      'Ligue 1': 'EU',
      'AFL': 'AU',
      'International Rugby': 'UK',
      'International Cricket': 'UK'
    };
    
    return regionMap[league] || 'US';
  }
}
