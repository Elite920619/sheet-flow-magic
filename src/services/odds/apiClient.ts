import { supabase } from '@/integrations/supabase/client';
import { SportsConfig } from './sportsConfig';

const BASE_URL = 'https://api.the-odds-api.com/v4';

export class OddsApiClient {
  private baseUrl = BASE_URL;
  private cachedApiKey: string | null = null;
  private keyFetchTime: number = 0;
  private readonly KEY_CACHE_DURATION = 300000; // 5 minutes
  private requestCount = 0;
  private lastRequestTime = 0;
  private readonly MIN_REQUEST_INTERVAL = 1000; // 1 second between requests

  async getApiKey(): Promise<string> {
    if (this.cachedApiKey && (Date.now() - this.keyFetchTime) < this.KEY_CACHE_DURATION) {
      return this.cachedApiKey;
    }

    try {
      console.log('Fetching API key from Supabase function...');
      const { data, error } = await supabase.functions.invoke('odds-api-key');
      
      if (error) {
        console.error('Error fetching API key:', error);
        return 'demo';
      }
      
      if (data?.apiKey && data.apiKey !== 'demo') {
        console.log('Successfully retrieved API key:', `${data.apiKey.substring(0, 8)}...`);
        this.cachedApiKey = data.apiKey;
        this.keyFetchTime = Date.now();
        return data.apiKey;
      }
      
      console.log('No valid API key in response, using demo');
      return 'demo';
    } catch (error) {
      console.error('Exception fetching API key:', error);
      return 'demo';
    }
  }

  private buildUrl(endpoint: string, apiKey: string): string {
    if (!endpoint.startsWith('/')) {
      endpoint = '/' + endpoint;
    }
    
    const separator = endpoint.includes('?') ? '&' : '?';
    return `${this.baseUrl}${endpoint}${separator}apiKey=${apiKey}`;
  }

  private async enforceRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.MIN_REQUEST_INTERVAL) {
      const delay = this.MIN_REQUEST_INTERVAL - timeSinceLastRequest;
      console.log(`Rate limiting: waiting ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    
    this.lastRequestTime = Date.now();
    this.requestCount++;
  }

  async fetchFromApi(endpoint: string): Promise<any> {
    await this.enforceRateLimit();
    
    const apiKey = await this.getApiKey();
    
    if (!apiKey || apiKey === 'demo') {
      console.warn('Using demo API key - this may have limited functionality');
      throw new Error('Valid API key required for live data');
    }
    
    const url = this.buildUrl(endpoint, apiKey);
    console.log(`Making API request to: ${url.replace(apiKey, '***')}`);
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'SportsBet-AI/1.0'
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API request failed:', {
          status: response.status,
          statusText: response.statusText,
          endpoint: endpoint,
          error: errorText
        });
        
        if (response.status === 401) {
          this.cachedApiKey = null;
          this.keyFetchTime = 0;
        }
        
        if (response.status === 422) {
          throw new Error(`Invalid market combination for this sport/region (422)`);
        }
        
        if (response.status === 429) {
          throw new Error(`Rate limit exceeded (429) - requests too frequent`);
        }
        
        throw new Error(`API request failed: ${response.status} - ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('API response received:', Array.isArray(data) ? `${data.length} items` : 'Success');
      return data;
    } catch (error) {
      console.error('Error in fetchFromApi:', error);
      throw error;
    }
  }

  async fetchSportsFromApi(): Promise<any[]> {
    try {
      return await this.fetchFromApi('/sports');
    } catch (error) {
      console.error('Failed to fetch sports list:', error);
      throw error;
    }
  }

  // NEW: Fetch odds from multiple regions in parallel with comprehensive filtering
  async fetchOddsFromAllRegions(sport: string): Promise<{ region: string; events: any[]; sport: string }[]> {
    const regions = ['us', 'uk', 'eu', 'au'];
    console.log(`🌍 Fetching ${sport} odds from all regions in parallel: ${regions.join(', ')}`);
    
    // Step 1: Fetch from all regions in parallel
    const regionPromises = regions.map(async (region) => {
      try {
        console.log(`📡 Fetching ${sport} from ${region.toUpperCase()}...`);
        const events = await this.fetchOddsFromApi(sport, region);
        console.log(`✅ ${region.toUpperCase()}: Retrieved ${events?.length || 0} raw events for ${sport}`);
        return { region, events: events || [], sport };
      } catch (error) {
        console.warn(`❌ ${region.toUpperCase()}: Failed to fetch ${sport} - ${error.message}`);
        return { region, events: [], sport };
      }
    });

    const results = await Promise.all(regionPromises);
    
    console.log(`🔍 Parallel fetch complete for ${sport}:`, 
      results.map(r => `${r.region.toUpperCase()}: ${r.events.length} events`).join(', ')
    );
    
    return results;
  }

  async fetchOddsFromApi(sport: string, region: string = 'us'): Promise<any[]> {
    if (!SportsConfig.isValidSport(sport)) {
      console.warn(`Skipping invalid sport: ${sport}`);
      return [];
    }

    const endpoint = `/sports/${sport}/odds`;
    const params = new URLSearchParams({
      regions: region,
      markets: 'h2h,spreads,totals', // Get all markets for better validation
      oddsFormat: 'american'
    });
    
    try {
      const data = await this.fetchFromApi(`${endpoint}?${params.toString()}`);
      
      if (Array.isArray(data) && data.length > 0) {
        // Basic validation - must have bookmakers
        const eventsWithBookmakers = data.filter(event => 
          event.bookmakers && event.bookmakers.length > 0
        );
        
        if (eventsWithBookmakers.length === 0) {
          console.log(`No events with bookmakers found for ${sport} in ${region}`);
          return [];
        }
        
        console.log(`Found ${eventsWithBookmakers.length} events with bookmakers for ${sport} in ${region}`);
        return eventsWithBookmakers;
      }
      
      return data || [];
    } catch (error) {
      console.warn(`Failed to fetch ${sport} in ${region}:`, error.message);
      throw error;
    }
  }

  async fetchUpcomingOdds(sport: string = 'upcoming', region: string = 'us'): Promise<any[]> {
    try {
      const sports = ['americanfootball_nfl', 'basketball_nba', 'baseball_mlb', 'icehockey_nhl'];
      const allGames: any[] = [];
      
      for (const sportKey of sports) {
        try {
          const games = await this.fetchOddsFromApi(sportKey, region);
          if (games && games.length > 0) {
            allGames.push(...games.map(game => ({
              ...game,
              sport: sportKey
            })));
          }
        } catch (error) {
          console.warn(`Failed to fetch ${sportKey}:`, error.message);
        }
      }
      
      return allGames;
    } catch (error) {
      console.error('Error fetching upcoming odds:', error);
      return [];
    }
  }
}

export const oddsApiClient = new OddsApiClient();
