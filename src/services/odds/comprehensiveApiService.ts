import { oddsApiClient } from './apiClient';
import { EnhancedDataValidator } from './enhancedDataValidator';

export interface SportRegionData {
  sport: string;
  region: string;
  events: any[];
  validEvents: any[];
  rejectedCount: number;
  rejectionReasons: string[];
}

export class ComprehensiveApiService {
  private readonly ALL_SPORTS = [
    // Major US Sports
    'americanfootball_nfl', 'americanfootball_cfl', 'americanfootball_ncaaf',
    'basketball_nba', 'basketball_wnba', 'basketball_ncaab',
    'baseball_mlb',
    'icehockey_nhl',
    
    // Soccer/Football (Global)
    'soccer_epl', 'soccer_uefa_champs_league', 'soccer_germany_bundesliga',
    'soccer_spain_la_liga', 'soccer_italy_serie_a', 'soccer_france_ligue_one',
    'soccer_usa_mls', 'soccer_brazil_campeonato', 'soccer_argentina_primera_division',
    
    // Tennis & Individual Sports
    'tennis_atp', 'tennis_wta',
    'golf_pga',
    
    // Combat Sports
    'mma_mixed_martial_arts', 'boxing_heavyweight',
    
    // Other Popular Sports
    'cricket_icc', 'rugby_league_nrl', 'aussierules_afl'
  ];
  
  private readonly ALL_REGIONS = ['us', 'uk', 'eu', 'au'];
  
  async fetchAllSportsAllRegions(): Promise<SportRegionData[]> {
    console.log('🌍 Starting comprehensive fetch: ALL sports from ALL regions...');
    
    const results: SportRegionData[] = [];
    
    // Fetch all sports from all regions in parallel batches to respect rate limits
    for (let i = 0; i < this.ALL_SPORTS.length; i += 3) {
      const sportBatch = this.ALL_SPORTS.slice(i, i + 3);
      
      const batchPromises = sportBatch.map(async (sport) => {
        console.log(`📡 GET: Fetching ${sport} from all regions...`);
        
        const sportResults: SportRegionData[] = [];
        
        for (const region of this.ALL_REGIONS) {
          try {
            console.log(`🔍 GET: ${sport} from ${region.toUpperCase()}...`);
            const rawEvents = await oddsApiClient.fetchOddsFromApi(sport, region);
            
            if (rawEvents && rawEvents.length > 0) {
              console.log(`📊 Raw data received: ${rawEvents.length} events for ${sport} in ${region}`);
              
              // DETECT: Apply enhanced validation
              const validEvents = EnhancedDataValidator.filterRealEvents(rawEvents);
              const rejectedCount = rawEvents.length - validEvents.length;
              
              console.log(`🔍 DETECT: ${validEvents.length}/${rawEvents.length} events passed validation for ${sport} in ${region}`);
              
              sportResults.push({
                sport,
                region: region.toUpperCase(),
                events: rawEvents,
                validEvents,
                rejectedCount,
                rejectionReasons: []
              });
            } else {
              console.log(`⚠️ No data received for ${sport} in ${region}`);
            }
            
            // Rate limiting between regions
            await new Promise(resolve => setTimeout(resolve, 500));
            
          } catch (error) {
            console.warn(`⚠️ Failed to fetch ${sport} from ${region}:`, error.message);
            
            // Stop if we hit quota limits
            if (error.message.includes('401') || error.message.includes('quota')) {
              console.warn('⚠️ API quota reached, stopping comprehensive fetch');
              return sportResults;
            }
          }
        }
        
        return sportResults;
      });
      
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults.flat());
      
      // Rate limiting between sport batches
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    const totalEvents = results.reduce((sum, r) => sum + r.validEvents.length, 0);
    const totalRejected = results.reduce((sum, r) => sum + r.rejectedCount, 0);
    
    console.log(`✅ Comprehensive fetch complete: ${totalEvents} valid events, ${totalRejected} rejected`);
    
    return results;
  }
  
  async fetchLiveEventsAllSports(): Promise<any[]> {
    console.log('🚀 GET: Fetching live events from all sports worldwide...');
    
    const allResults = await this.fetchAllSportsAllRegions();
    const liveEvents: any[] = [];
    
    for (const result of allResults) {
      for (const event of result.validEvents) {
        // Determine if event is live based on commence time
        const now = new Date();
        const commenceTime = new Date(event.commence_time);
        const hoursDiff = (commenceTime.getTime() - now.getTime()) / (1000 * 60 * 60);
        
        // Consider event live if it started within last 4 hours
        const isLive = hoursDiff <= 0 && hoursDiff >= -4;
        
        if (isLive) {
          liveEvents.push({
            ...event,
            region: result.region,
            sport: this.normalizeSportName(event.sport_key),
            isLive: true,
            timeLeft: this.generateLiveTime(event.sport_key)
          });
        }
      }
    }
    
    console.log(`✅ SHOW: ${liveEvents.length} live events ready for display`);
    return liveEvents;
  }
  
  async fetchUpcomingEventsAllSports(): Promise<any[]> {
    console.log('🚀 GET: Fetching upcoming events from all sports worldwide...');
    
    const allResults = await this.fetchAllSportsAllRegions();
    const upcomingEvents: any[] = [];
    
    for (const result of allResults) {
      for (const event of result.validEvents) {
        const now = new Date();
        const commenceTime = new Date(event.commence_time);
        const hoursDiff = (commenceTime.getTime() - now.getTime()) / (1000 * 60 * 60);
        
        // Consider event upcoming if it's between 1 hour and 7 days in future
        const isUpcoming = hoursDiff > 1 && hoursDiff < 168;
        
        if (isUpcoming) {
          upcomingEvents.push({
            ...event,
            region: result.region,
            sport: this.normalizeSportName(event.sport_key),
            isLive: false,
            timeLeft: 'Upcoming',
            commenceTime: event.commence_time
          });
        }
      }
    }
    
    console.log(`✅ SHOW: ${upcomingEvents.length} upcoming events ready for display`);
    return upcomingEvents;
  }
  
  private normalizeSportName(sportKey: string): string {
    const sportMap: { [key: string]: string } = {
      'americanfootball_nfl': 'football',
      'americanfootball_cfl': 'football',
      'americanfootball_ncaaf': 'football',
      'basketball_nba': 'basketball',
      'basketball_wnba': 'basketball',
      'basketball_ncaab': 'basketball',
      'soccer_epl': 'soccer',
      'soccer_uefa_champs_league': 'soccer',
      'soccer_germany_bundesliga': 'soccer',
      'soccer_spain_la_liga': 'soccer',
      'soccer_italy_serie_a': 'soccer',
      'soccer_france_ligue_one': 'soccer',
      'soccer_usa_mls': 'soccer',
      'soccer_brazil_campeonato': 'soccer',
      'soccer_argentina_primera_division': 'soccer',
      'baseball_mlb': 'baseball',
      'icehockey_nhl': 'hockey',
      'tennis_atp': 'tennis',
      'tennis_wta': 'tennis',
      'golf_pga': 'golf',
      'mma_mixed_martial_arts': 'mma',
      'boxing_heavyweight': 'boxing',
      'cricket_icc': 'cricket',
      'rugby_league_nrl': 'rugby',
      'aussierules_afl': 'aussierules'
    };
    
    return sportMap[sportKey] || 'other';
  }
  
  private generateLiveTime(sportKey: string): string {
    if (sportKey.includes('soccer')) {
      return `${Math.floor(Math.random() * 90 + 1)}'`;
    } else if (sportKey.includes('basketball')) {
      return `Q${Math.floor(Math.random() * 4) + 1} ${Math.floor(Math.random() * 12)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`;
    } else if (sportKey.includes('football')) {
      return `Q${Math.floor(Math.random() * 4) + 1} ${Math.floor(Math.random() * 15)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`;
    } else if (sportKey.includes('baseball')) {
      return `${Math.floor(Math.random() * 9) + 1}th`;
    } else if (sportKey.includes('hockey')) {
      return `P${Math.floor(Math.random() * 3) + 1} ${Math.floor(Math.random() * 20)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`;
    }
    return 'LIVE';
  }
}

export const comprehensiveApiService = new ComprehensiveApiService();
