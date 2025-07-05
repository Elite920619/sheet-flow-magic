
import { enhancedLiveEventsService } from './enhancedLiveEventsService';

export class LiveEventsService {
  async fetchLiveEvents(onRegionComplete?: (events: any[]) => void): Promise<any[]> {
    // Delegate to enhanced service with comprehensive GET->DETECT->SHOW logic
    return enhancedLiveEventsService.fetchLiveEventsComprehensive(onRegionComplete);
  }

  async fetchLiveEventsByRegion(region: string = 'us'): Promise<any[]> {
    return enhancedLiveEventsService.fetchLiveEventsByRegion(region);
  }
}
