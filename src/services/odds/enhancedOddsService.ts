
import { enhancedLiveEventsService } from './enhancedLiveEventsService';
import { enhancedUpcomingEventsService } from '../upcomingEvents/enhancedUpcomingEventsService';
import { openAIValueBetService, ValueBetAnalysis } from './openAIValueBetService';

export class EnhancedOddsService {
  
  // Live Events with comprehensive GET->DETECT->SHOW
  async fetchLiveEvents(): Promise<any[]> {
    console.log('🚀 GET->DETECT->SHOW: Fetching comprehensive live events...');
    return enhancedLiveEventsService.fetchLiveEventsComprehensive();
  }
  
  async fetchLiveEventsProgressive(onRegionComplete: (events: any[]) => void): Promise<any[]> {
    console.log('🚀 GET->DETECT->SHOW: Progressive live events fetch...');
    return enhancedLiveEventsService.fetchLiveEventsComprehensive(onRegionComplete);
  }
  
  async fetchLiveEventsByRegion(region: string): Promise<any[]> {
    console.log(`🌍 GET->DETECT->SHOW: Live events for region ${region}...`);
    return enhancedLiveEventsService.fetchLiveEventsByRegion(region);
  }
  
  async fetchLiveEventsBySport(sport: string): Promise<any[]> {
    console.log(`🏈 GET->DETECT->SHOW: Live events for sport ${sport}...`);
    return enhancedLiveEventsService.fetchLiveEventsBySport(sport);
  }
  
  // Upcoming Events with comprehensive GET->DETECT->SHOW
  async fetchUpcomingEvents(isManualRefresh: boolean = false, existingEvents: any[] = []): Promise<any[]> {
    console.log('🚀 GET->DETECT->SHOW: Fetching comprehensive upcoming events...');
    return enhancedUpcomingEventsService.fetchUpcomingEventsComprehensive(isManualRefresh, existingEvents);
  }
  
  // Value Bets with OpenAI Integration
  async analyzeValueBets(events?: any[]): Promise<ValueBetAnalysis[]> {
    console.log('🧠 GET->DETECT->SHOW: Analyzing value bets with OpenAI...');
    
    if (!events || events.length === 0) {
      // Fetch fresh upcoming events for analysis
      events = await this.fetchUpcomingEvents();
    }
    
    return openAIValueBetService.analyzeValueBets(events);
  }
  
  // Region and Sport Filtering
  async fetchEventsByFilters(filters: {
    type: 'live' | 'upcoming';
    region?: string;
    sport?: string;
  }): Promise<any[]> {
    console.log('🎯 GET->DETECT->SHOW: Fetching events with filters:', filters);
    
    let events: any[] = [];
    
    if (filters.type === 'live') {
      if (filters.region && filters.region !== 'all') {
        events = await this.fetchLiveEventsByRegion(filters.region);
      } else if (filters.sport && filters.sport !== 'all') {
        events = await this.fetchLiveEventsBySport(filters.sport);
      } else {
        events = await this.fetchLiveEvents();
      }
    } else {
      events = await this.fetchUpcomingEvents();
      
      // Apply filters to upcoming events
      if (filters.region && filters.region !== 'all') {
        events = events.filter(event => 
          event.region?.toLowerCase() === filters.region?.toLowerCase()
        );
      }
      
      if (filters.sport && filters.sport !== 'all') {
        events = events.filter(event => 
          event.sport?.toLowerCase() === filters.sport?.toLowerCase()
        );
      }
    }
    
    console.log(`✅ Filtered events: ${events.length} events match criteria`);
    return events;
  }
  
  // Auto-refresh for live data
  startLiveEventAutoRefresh(intervalMs: number = 60000, callback?: (events: any[]) => void): () => void {
    return enhancedLiveEventsService.startAutoRefresh(intervalMs, callback);
  }
  
  // Get statistics
  async getEventStatistics(type: 'live' | 'upcoming' = 'live'): Promise<{
    totalEvents: number;
    eventsBySport: Record<string, number>;
    eventsByRegion: Record<string, number>;
    lastUpdated: string;
  }> {
    const events = type === 'live' 
      ? await this.fetchLiveEvents() 
      : await this.fetchUpcomingEvents();
    
    const eventsBySport: Record<string, number> = {};
    const eventsByRegion: Record<string, number> = {};
    
    events.forEach(event => {
      const sport = event.sport || 'unknown';
      const region = event.region || 'unknown';
      
      eventsBySport[sport] = (eventsBySport[sport] || 0) + 1;
      eventsByRegion[region] = (eventsByRegion[region] || 0) + 1;
    });
    
    return {
      totalEvents: events.length,
      eventsBySport,
      eventsByRegion,
      lastUpdated: new Date().toISOString()
    };
  }
}

export const enhancedOddsService = new EnhancedOddsService();
