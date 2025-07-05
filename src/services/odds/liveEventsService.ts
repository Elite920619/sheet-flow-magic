
import { oddsApiClient } from './apiClient';
import { MockDataProvider } from './mockDataProvider';
import { DataProcessor } from './dataProcessor';
import { SportInfo } from './types';
import { SportsConfig } from './sportsConfig';
import { EventProcessor } from './eventProcessor';
import { DataValidator } from './dataValidator';
import { realDataService, LiveEventData } from './realDataService';

export class LiveEventsService {
  private mockDataProvider = new MockDataProvider();
  private dataProcessor = new DataProcessor();
  private eventProcessor = new EventProcessor();

  async fetchLiveEvents(onRegionComplete?: (events: any[]) => void): Promise<any[]> {
    console.log('🚀 Starting enhanced live events fetch with real API validation...');
    
    try {
      // First, try to get real live events
      const realEvents = await realDataService.fetchValidLiveEvents();
      
      if (realEvents.length > 0) {
        console.log(`✅ Using ${realEvents.length} real events from API`);
        
        // Convert to expected format and show immediately
        const formattedEvents = this.formatRealEventsForDisplay(realEvents);
        
        if (onRegionComplete) {
          onRegionComplete(formattedEvents);
        }
        
        return formattedEvents;
      }
      
      console.log('⚠️ No real events available, falling back to mock data');
      
      // Fallback to enhanced mock data with regional distribution
      return this.generateEnhancedMockData(onRegionComplete);
      
    } catch (error) {
      console.error('💥 Error in live events fetch:', error);
      return this.generateEnhancedMockData(onRegionComplete);
    }
  }

  private formatRealEventsForDisplay(realEvents: LiveEventData[]): any[] {
    return realEvents.map(event => ({
      id: event.id,
      sport: event.sport,
      league: event.league,
      gameType: event.gameType,
      homeTeam: event.homeTeam,
      awayTeam: event.awayTeam,
      homeScore: event.homeScore || 0,
      awayScore: event.awayScore || 0,
      timeLeft: event.timeLeft,
      betStatus: event.betStatus,
      region: event.region,
      moneylineHome: event.moneylineHome,
      moneylineAway: event.moneylineAway,
      moneylineDraw: this.shouldHaveDrawOdds(event) ? event.moneylineDraw : null,
      spread: event.spread,
      total: event.total,
      venue: event.venue,
      commenceTime: event.commenceTime,
      isLive: event.isLive,
      attendance: event.isLive ? `${Math.floor(Math.random() * 50000 + 20000).toLocaleString()}` : 'TBD',
      temperature: `${Math.floor(Math.random() * 30 + 10)}°C`,
      analysis: event.analysis,
      homeLogo: event.homeLogo,
      awayLogo: event.awayLogo
    }));
  }

  private shouldHaveDrawOdds(event: LiveEventData): boolean {
    const sportsWithDraws = ['soccer', 'rugby', 'hockey'];
    const isPlayoffGame = event.gameType !== 'Regular Season';
    
    // No draw odds for playoff games in sports that support draws
    return sportsWithDraws.includes(event.sport) && !isPlayoffGame;
  }

  private async generateEnhancedMockData(onRegionComplete?: (events: any[]) => void): Promise<any[]> {
    const regions = ['us', 'uk', 'eu', 'au'];
    const allEvents: any[] = [];
    
    MockDataProvider.resetTeamUsage();
    
    for (const region of regions) {
      const regionEvents = MockDataProvider.generateRegionEvents(region, 10);
      allEvents.push(...regionEvents);
      
      if (onRegionComplete) {
        onRegionComplete([...allEvents]);
      }
    }
    
    return allEvents;
  }

  async fetchLiveEventsByRegion(region: string = 'us'): Promise<any[]> {
    console.log(`🌍 Fetching live events for region: ${region.toUpperCase()}`);
    
    try {
      const realEvents = await realDataService.fetchValidLiveEvents();
      const regionEvents = realEvents.filter(event => 
        event.region.toLowerCase() === region.toLowerCase()
      );
      
      if (regionEvents.length > 0) {
        return this.formatRealEventsForDisplay(regionEvents);
      }
      
      // Fallback to mock data for the specific region
      return MockDataProvider.generateRegionEvents(region, 10);
      
    } catch (error) {
      console.error(`💥 Error fetching events for ${region}:`, error);
      return MockDataProvider.generateRegionEvents(region, 10);
    }
  }
}
