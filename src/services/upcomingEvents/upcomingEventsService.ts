
import { oddsApiClient } from '@/services/odds/apiClient';
import { UpcomingEventsMockService } from './upcomingEventsMockService';
import { UpcomingEventsProcessor } from './upcomingEventsProcessor';

export class UpcomingEventsService {
  private mockService = new UpcomingEventsMockService();
  private processor = new UpcomingEventsProcessor();

  async fetchUpcomingEvents(isManualRefresh: boolean = false, existingEvents: any[] = []): Promise<any[]> {
    try {
      console.log('🚀 Starting comprehensive upcoming events fetch from all sports...');
      
      const accumulatedEvents = new Map<string, any>();
      
      if (isManualRefresh && existingEvents.length > 0) {
        existingEvents.forEach(event => {
          accumulatedEvents.set(event.id, event);
        });
        console.log(`📋 Starting refresh with ${existingEvents.length} existing events`);
      }

      // Try to fetch real data first
      let realEventsFound = false;
      const availableSports = [
        'americanfootball_nfl', 'basketball_nba', 'soccer_epl', 
        'baseball_mlb', 'icehockey_nhl', 'tennis_atp', 'golf_pga'
      ];

      for (const sport of availableSports.slice(0, 3)) { // Limit to prevent quota issues
        try {
          const games = await oddsApiClient.fetchOddsFromApi(sport, 'us');
          
          if (games && games.length > 0) {
            const now = new Date();
            const upcomingGames = games.filter(game => {
              const gameTime = new Date(game.commence_time);
              const hoursDiff = (gameTime.getTime() - now.getTime()) / (1000 * 60 * 60);
              return hoursDiff > 1 && hoursDiff < 168;
            });

            if (upcomingGames.length > 0) {
              console.log(`✅ Found ${upcomingGames.length} real upcoming games for ${sport}`);
              realEventsFound = true;
              
              const formattedGames = upcomingGames.map(game => 
                this.processor.formatRealGame(game, sport)
              );

              formattedGames.forEach(game => {
                accumulatedEvents.set(game.id, game);
              });
            }
          }

          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
          console.warn(`⚠️ Failed to fetch ${sport}:`, error.message);
        }
      }

      // Always supplement with comprehensive mock data to ensure variety
      const mockEvents = this.mockService.generateComprehensiveUpcomingEvents();
      mockEvents.forEach(event => {
        // Only add if we don't have real data or to supplement variety
        if (!realEventsFound || Math.random() > 0.3) {
          accumulatedEvents.set(event.id, event);
        }
      });

      const finalEvents = Array.from(accumulatedEvents.values());
      console.log(`✅ Upcoming events fetch complete: ${finalEvents.length} total events`);

      return finalEvents;

    } catch (error) {
      console.error('💥 Error in upcoming events fetch:', error);
      
      if (!isManualRefresh || existingEvents.length === 0) {
        const fallbackEvents = this.mockService.generateComprehensiveUpcomingEvents();
        return fallbackEvents;
      }
      
      return existingEvents;
    }
  }
}
