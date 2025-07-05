
import { enhancedUpcomingEventsService } from './enhancedUpcomingEventsService';

export class UpcomingEventsService {
  async fetchUpcomingEvents(isManualRefresh: boolean = false, existingEvents: any[] = []): Promise<any[]> {
    // Delegate to enhanced service with comprehensive GET->DETECT->SHOW logic
    return enhancedUpcomingEventsService.fetchUpcomingEventsComprehensive(isManualRefresh, existingEvents);
  }
}
