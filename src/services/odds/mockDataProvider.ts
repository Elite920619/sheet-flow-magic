export class MockDataProvider {
  private static usedTeams = new Set<string>();

  static resetTeamUsage() {
    this.usedTeams.clear();
  }

  static getLeagueForSport(sport: string): string {
    const leagueMap: { [key: string]: string[] } = {
      'football': ['NFL', 'NCAA Football', 'CFL'],
      'basketball': ['NBA', 'NCAA Basketball', 'EuroLeague'],
      'soccer': ['Premier League', 'La Liga', 'Bundesliga', 'Serie A', 'MLS'],
      'baseball': ['MLB', 'NPB', 'KBO'],
      'hockey': ['NHL', 'KHL', 'SHL'],
      'tennis': ['ATP Tour', 'WTA Tour', 'Grand Slam'],
      'golf': ['PGA Tour', 'European Tour', 'LIV Golf'],
      'boxing': ['Heavyweight', 'Middleweight', 'Welterweight'],
      'mma': ['UFC', 'Bellator', 'ONE Championship'],
      'cricket': ['IPL', 'The Hundred', 'Big Bash']
    };
    
    const leagues = leagueMap[sport] || ['Professional League'];
    return leagues[Math.floor(Math.random() * leagues.length)];
  }

  static getRandomTeam(sport: string, region: string): string {
    const teamsByRegion: { [key: string]: { [key: string]: string[] } } = {
      'us': {
        'football': ['Patriots', 'Cowboys', 'Packers', 'Steelers', 'Giants', 'Eagles', 'Chiefs', 'Rams'],
        'basketball': ['Lakers', 'Warriors', 'Celtics', 'Heat', 'Bulls', 'Knicks', 'Nets', 'Spurs'],
        'baseball': ['Yankees', 'Red Sox', 'Dodgers', 'Giants', 'Cubs', 'Cardinals', 'Astros', 'Braves'],
        'hockey': ['Rangers', 'Bruins', 'Blackhawks', 'Kings', 'Penguins', 'Capitals', 'Lightning', 'Sharks'],
        'soccer': ['LAFC', 'Atlanta United', 'Seattle Sounders', 'Portland Timbers', 'NYC FC', 'Inter Miami'],
        'tennis': ['Serena Williams', 'Venus Williams', 'Andy Roddick', 'John Isner'],
        'golf': ['Tiger Woods', 'Phil Mickelson', 'Jordan Spieth', 'Justin Thomas'],
        'boxing': ['Floyd Mayweather', 'Manny Pacquiao', 'Canelo Alvarez', 'Gennady Golovkin'],
        'mma': ['Jon Jones', 'Daniel Cormier', 'Stipe Miocic', 'Francis Ngannou'],
        'cricket': ['Team USA', 'American Eagles', 'Liberty Stars', 'Freedom Fighters']
      },
      'uk': {
        'football': ['Manchester United', 'Liverpool', 'Chelsea', 'Arsenal', 'Tottenham', 'Manchester City'],
        'basketball': ['London Lions', 'Newcastle Eagles', 'Leicester Riders', 'Sheffield Sharks'],
        'soccer': ['Manchester United', 'Liverpool', 'Chelsea', 'Arsenal', 'Tottenham', 'Manchester City'],
        'cricket': ['England', 'Yorkshire', 'Lancashire', 'Surrey', 'Essex', 'Kent'],
        'tennis': ['Andy Murray', 'Emma Raducanu', 'Dan Evans', 'Cameron Norrie'],
        'golf': ['Rory McIlroy', 'Justin Rose', 'Paul Casey', 'Tommy Fleetwood'],
        'boxing': ['Anthony Joshua', 'Tyson Fury', 'Amir Khan', 'Carl Froch'],
        'hockey': ['Sheffield Steelers', 'Nottingham Panthers', 'Cardiff Devils', 'Belfast Giants']
      },
      'eu': {
        'soccer': ['Barcelona', 'Real Madrid', 'Bayern Munich', 'PSG', 'Juventus', 'AC Milan'],
        'basketball': ['Real Madrid', 'Barcelona', 'CSKA Moscow', 'Fenerbahce', 'Olympiacos'],
        'tennis': ['Rafael Nadal', 'Novak Djokovic', 'Alexander Zverev', 'Stefanos Tsitsipas'],
        'golf': ['Jon Rahm', 'Viktor Hovland', 'Rory McIlroy', 'Francesco Molinari'],
        'hockey': ['SKA St. Petersburg', 'CSKA Moscow', 'Jokerit Helsinki', 'Dynamo Moscow']
      },
      'au': {
        'cricket': ['Australia', 'Sydney Sixers', 'Melbourne Stars', 'Perth Scorchers'],
        'tennis': ['Nick Kyrgios', 'Ash Barty', 'Alex de Minaur', 'Thanasi Kokkinakis'],
        'soccer': ['Sydney FC', 'Melbourne Victory', 'Perth Glory', 'Adelaide United'],
        'basketball': ['Sydney Kings', 'Melbourne United', 'Perth Wildcats', 'Adelaide 36ers']
      }
    };

    const availableTeams = teamsByRegion[region]?.[sport] || ['Team A', 'Team B', 'Team C', 'Team D'];
    const unusedTeams = availableTeams.filter(team => !this.usedTeams.has(`${sport}_${region}_${team}`));
    
    if (unusedTeams.length === 0) {
      // Reset if all teams used
      availableTeams.forEach(team => this.usedTeams.delete(`${sport}_${region}_${team}`));
      return availableTeams[Math.floor(Math.random() * availableTeams.length)];
    }
    
    const selectedTeam = unusedTeams[Math.floor(Math.random() * unusedTeams.length)];
    this.usedTeams.add(`${sport}_${region}_${selectedTeam}`);
    return selectedTeam;
  }

  static generateOdds(): string {
    const odds = Math.floor(Math.random() * 600) + 100;
    return Math.random() > 0.5 ? `+${odds}` : `-${odds}`;
  }

  
  static generateRegionEvents(region: string, count: number = 10): any[] {
    const sports = ['football', 'basketball', 'soccer', 'baseball', 'hockey', 'tennis', 'golf', 'boxing', 'mma', 'cricket'];
    const events: any[] = [];
    
    for (let i = 0; i < count; i++) {
      const sport = sports[Math.floor(Math.random() * sports.length)];
      const homeTeam = this.getRandomTeam(sport, region);
      const awayTeam = this.getRandomTeam(sport, region);
      
      events.push({
        id: `${region}_${sport}_${i}`,
        sport: sport,
        league: this.getLeagueForSport(sport),
        homeTeam: homeTeam,
        awayTeam: awayTeam,
        homeScore: Math.floor(Math.random() * 100),
        awayScore: Math.floor(Math.random() * 100),
        timeLeft: this.generateTimeLeft(),
        betStatus: 'Available',
        region: region.toUpperCase(),
        moneylineHome: this.generateOdds(),
        moneylineAway: this.generateOdds(),
        moneylineDraw: sport === 'soccer' ? this.generateOdds() : null,
        spread: this.generateSpread(),
        total: this.generateTotal(),
        venue: `${homeTeam} Stadium`,
        commenceTime: new Date().toISOString(),
        isLive: true,
        gameType: 'Regular Season',
        analysis: {
          confidence: Math.floor(Math.random() * 20) + 60,
          prediction: 'Analysis available',
          momentum: Math.random() > 0.5 ? 'Home' : 'Away'
        },
        homeLogo: '🏠',
        awayLogo: '✈️'
      });
    }
    
    return events;
  }

  private static generateTimeLeft(): string {
    const options = ['Q1 12:45', 'Q2 8:30', 'Q3 15:20', 'Q4 5:10', 'LIVE', '2H 25:30', '1H 40:15'];
    return options[Math.floor(Math.random() * options.length)];
  }

  private static generateSpread(): string {
    const spread = (Math.random() * 14 + 1).toFixed(1);
    return Math.random() > 0.5 ? `+${spread}` : `-${spread}`;
  }

  private static generateTotal(): string {
    return (Math.random() * 50 + 150).toFixed(1);
  }
}
