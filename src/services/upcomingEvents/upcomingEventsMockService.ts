
import { MockDataProvider } from '@/services/odds/mockDataProvider';

export class UpcomingEventsMockService {
  generateComprehensiveUpcomingEvents(): any[] {
    const regions = ['us', 'uk', 'eu', 'au'];
    const sportsVariety = [
      'football', 'basketball', 'soccer', 'baseball', 'hockey', 
      'tennis', 'golf', 'boxing', 'mma', 'cricket'
    ];
    
    const fallbackEvents: any[] = [];
    
    regions.forEach(regionCode => {
      sportsVariety.forEach(sport => {
        // Generate 3-5 events per sport per region
        const eventCount = Math.floor(Math.random() * 3) + 3;
        for (let i = 0; i < eventCount; i++) {
          const hoursUntilStart = Math.floor(Math.random() * 168) + 2; // 2-170 hours
          
          fallbackEvents.push({
            id: `upcoming_${sport}_${regionCode}_${i}`,
            sport: sport,
            league: MockDataProvider.getLeagueForSport(sport),
            homeTeam: MockDataProvider.getRandomTeam(sport, regionCode),
            awayTeam: MockDataProvider.getRandomTeam(sport, regionCode),
            homeScore: 0,
            awayScore: 0,
            timeLeft: `${hoursUntilStart}h`,
            betStatus: 'Available',
            region: regionCode.toUpperCase(),
            moneylineHome: MockDataProvider.generateOdds(),
            moneylineAway: MockDataProvider.generateOdds(),
            moneylineDraw: sport === 'soccer' ? MockDataProvider.generateOdds() : null,
            spread: 'N/A',
            total: 'N/A',
            venue: `${MockDataProvider.getRandomTeam(sport, regionCode)} Stadium`,
            commenceTime: new Date(Date.now() + hoursUntilStart * 60 * 60 * 1000).toISOString(),
            isLive: false,
            gameType: 'Regular Season',
            analysis: {
              confidence: Math.floor(Math.random() * 20) + 60,
              prediction: 'Pre-game analysis available',
              momentum: Math.random() > 0.5 ? 'Home' : 'Away'
            },
            homeLogo: '🏠',
            awayLogo: '✈️'
          });
        }
      });
    });
    
    console.log(`📋 Generated ${fallbackEvents.length} comprehensive upcoming events across all sports`);
    return fallbackEvents;
  }
}
