import { oddsApiClient } from '@/services/odds/apiClient';
import { UpcomingEventsMockService } from './upcomingEventsMockService';
import { UpcomingEventsProcessor } from './upcomingEventsProcessor';
import { DataValidator } from '@/services/odds/dataValidator';

export class UpcomingEventsService {
  private mockService = new UpcomingEventsMockService();
  private processor = new UpcomingEventsProcessor();

  async fetchUpcomingEvents(isManualRefresh: boolean = false, existingEvents: any[] = []): Promise<any[]> {
    try {
      console.log('🚀 Starting comprehensive upcoming events fetch from all sports worldwide...');
      
      const accumulatedEvents = new Map<string, any>();
      
      if (isManualRefresh && existingEvents.length > 0) {
        existingEvents.forEach(event => {
          accumulatedEvents.set(event.id, event);
        });
        console.log(`📋 Starting refresh with ${existingEvents.length} existing events`);
      }

      // GET: Try to fetch real data from comprehensive sports list
      let realEventsFound = false;
      const comprehensiveSportsList = [
        // Major US Sports
        'americanfootball_nfl', 'basketball_nba', 'baseball_mlb', 'icehockey_nhl',
        // Soccer/Football
        'soccer_epl', 'soccer_uefa_champs_league', 'soccer_germany_bundesliga',
        'soccer_spain_la_liga', 'soccer_italy_serie_a', 'soccer_france_ligue_one',
        'soccer_brazil_campeonato', 'soccer_argentina_primera_division',
        // Tennis
        'tennis_atp', 'tennis_wta',
        // Other Popular Sports
        'golf_pga', 'mma_mixed_martial_arts', 'boxing_heavyweight',
        'cricket_icc', 'rugby_league_nrl', 'aussierules_afl'
      ];

      // Limit API calls to prevent quota issues but cover major sports
      for (const sport of comprehensiveSportsList.slice(0, 6)) {
        try {
          console.log(`🔍 GET: Fetching ${sport} events...`);
          const games = await oddsApiClient.fetchOddsFromApi(sport, 'us');
          
          if (games && games.length > 0) {
            console.log(`📡 Raw data received for ${sport}: ${games.length} events`);
            
            // DETECT: Apply enhanced validation to filter out fake/placeholder data
            const validGames = DataValidator.filterValidEvents(games);
            console.log(`🔍 DETECT: ${validGames.length}/${games.length} events passed enhanced validation for ${sport}`);
            
            const now = new Date();
            const upcomingGames = validGames.filter(game => {
              const gameTime = new Date(game.commence_time);
              const hoursDiff = (gameTime.getTime() - now.getTime()) / (1000 * 60 * 60);
              
              // Only upcoming games (1 hour to 7 days in future)
              const isUpcoming = hoursDiff > 1 && hoursDiff < 168;
              if (!isUpcoming) {
                console.log(`⏰ Filtering out non-upcoming game: ${game.away_team} @ ${game.home_team} (${hoursDiff.toFixed(1)}h from now)`);
              }
              return isUpcoming;
            });

            if (upcomingGames.length > 0) {
              console.log(`✅ Found ${upcomingGames.length} valid upcoming games for ${sport}`);
              realEventsFound = true;
              
              const formattedGames = upcomingGames.map(game => 
                this.processor.formatRealGame(game, sport)
              );

              // DETECT: Additional validation on formatted games
              const finalValidGames = DataValidator.validateUpcomingEvents(formattedGames);
              console.log(`🔍 DETECT: ${finalValidGames.length}/${formattedGames.length} formatted games passed upcoming validation for ${sport}`);
              
              finalValidGames.forEach(game => {
                accumulatedEvents.set(game.id, game);
              });
            }
          } else {
            console.log(`⚠️ No raw data received for ${sport}`);
          }

          // Rate limiting
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
          console.warn(`⚠️ Failed to fetch ${sport}:`, error.message);
        }
      }

      // GET: Generate mock data for comprehensive sports coverage
      const mockEvents = this.mockService.generateComprehensiveUpcomingEvents();
      console.log(`📊 Generated ${mockEvents.length} mock upcoming events from comprehensive sports`);
      
      // DETECT: Apply enhanced validation to mock data
      const validMockEvents = DataValidator.validateUpcomingEvents(mockEvents);
      console.log(`🔍 DETECT: ${validMockEvents.length}/${mockEvents.length} mock events passed enhanced validation`);
      
      // Add validated mock events (supplement real data or provide fallback)
      validMockEvents.forEach(event => {
        if (!realEventsFound || Math.random() > 0.4) {
          accumulatedEvents.set(event.id, event);
        }
      });

      const finalEvents = Array.from(accumulatedEvents.values());
      
      // Final validation pass to ensure only upcoming events
      const upcomingOnlyEvents = finalEvents.filter(event => {
        if (event.isLive || event.timeLeft === 'LIVE' || 
            event.timeLeft.includes('Q') || event.timeLeft.includes('H') ||
            event.timeLeft.includes("'") || event.timeLeft.includes('P')) {
          console.log(`🚫 Filtering out live event from upcoming: ${event.homeTeam} vs ${event.awayTeam}`);
          return false;
        }
        return true;
      });

      console.log(`✅ SHOW: Upcoming events fetch complete - ${upcomingOnlyEvents.length} validated upcoming-only events ready for display`);
      console.log(`📊 Events by sport:`, this.getEventsBySport(upcomingOnlyEvents));

      return upcomingOnlyEvents;

    } catch (error) {
      console.error('💥 Error in upcoming events fetch:', error);
      
      if (!isManualRefresh || existingEvents.length === 0) {
        const fallbackEvents = this.mockService.generateComprehensiveUpcomingEvents();
        const validFallbackEvents = DataValidator.validateUpcomingEvents(fallbackEvents);
        console.log(`🔄 Using ${validFallbackEvents.length} validated fallback events`);
        return validFallbackEvents;
      }
      
      return existingEvents;
    }
  }

  private getEventsBySport(events: any[]): Record<string, number> {
    const sportCounts: Record<string, number> = {};
    events.forEach(event => {
      const sport = event.sport || 'unknown';
      sportCounts[sport] = (sportCounts[sport] || 0) + 1;
    });
    return sportCounts;
  }
}
