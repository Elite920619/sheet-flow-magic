
import { useState, useEffect } from 'react';
import { oddsApiClient } from '@/services/odds/apiClient';
import { MockDataProvider } from '@/services/odds/mockDataProvider';

export const useUpcomingEvents = () => {
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  const normalizeSportName = (sportKey: string): string => {
    const sportMap: { [key: string]: string } = {
      'americanfootball_nfl': 'football',
      'basketball_nba': 'basketball',
      'soccer_epl': 'soccer',
      'baseball_mlb': 'baseball',
      'icehockey_nhl': 'hockey'
    };
    return sportMap[sportKey] || 'other';
  };

  const extractOdds = (game: any, type: 'home' | 'away' | 'draw'): string => {
    if (!game.bookmakers || game.bookmakers.length === 0) return 'N/A';
    
    const bookmaker = game.bookmakers[0];
    const h2hMarket = bookmaker.markets?.find((m: any) => m.key === 'h2h');
    
    if (!h2hMarket || !h2hMarket.outcomes) return 'N/A';

    let outcome;
    if (type === 'home') {
      outcome = h2hMarket.outcomes.find((o: any) => o.name === game.home_team);
    } else if (type === 'away') {
      outcome = h2hMarket.outcomes.find((o: any) => o.name === game.away_team);
    } else if (type === 'draw') {
      outcome = h2hMarket.outcomes.find((o: any) => o.name === 'Draw');
    }

    if (!outcome) return 'N/A';

    // Convert decimal to American odds
    const decimalOdds = outcome.price;
    const americanOdds = decimalOdds >= 2 
      ? Math.round((decimalOdds - 1) * 100)
      : Math.round(-100 / (decimalOdds - 1));
    
    return americanOdds > 0 ? `+${americanOdds}` : `${americanOdds}`;
  };

  const generateFallbackUpcomingEvents = (): any[] => {
    const regions = ['us', 'uk', 'eu', 'au'];
    const fallbackEvents: any[] = [];
    
    regions.forEach(regionCode => {
      // Generate upcoming events (not live)
      const regionEvents = MockDataProvider.generateRegionEvents(regionCode, 8);
      const upcomingEvents = regionEvents.map(event => ({
        ...event,
        id: `upcoming_${event.id}`,
        timeLeft: `${Math.floor(Math.random() * 48 + 2)}h`, // 2-50 hours
        isLive: false,
        homeScore: 0,
        awayScore: 0
      }));
      
      fallbackEvents.push(...upcomingEvents);
    });
    
    console.log(`📋 Generated ${fallbackEvents.length} fallback upcoming events`);
    return fallbackEvents;
  };

  const fetchUpcomingEvents = async (isManualRefresh: boolean = false) => {
    if (isManualRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
      setUpcomingEvents([]);
    }

    try {
      console.log('🚀 Starting upcoming events fetch from all sports and regions...');
      
      const accumulatedEvents = new Map<string, any>();
      
      // If refreshing, start with existing events to maintain continuity
      if (isManualRefresh && upcomingEvents.length > 0) {
        upcomingEvents.forEach(event => {
          accumulatedEvents.set(event.id, event);
        });
        console.log(`📋 Starting refresh with ${upcomingEvents.length} existing events`);
      }

      // Step 1: Fetch all available sports
      let availableSports: any[] = [];
      try {
        const sportsData = await oddsApiClient.fetchSportsFromApi();
        availableSports = sportsData.filter(sport => 
          sport.active && 
          sport.has_odds !== false && 
          !sport.has_outrights &&
          ['americanfootball_nfl', 'basketball_nba', 'soccer_epl', 'baseball_mlb', 'icehockey_nhl'].includes(sport.key)
        ).slice(0, 5); // Limit to prevent quota issues
        
        console.log(`📊 Found ${availableSports.length} available sports with odds`);
      } catch (error) {
        console.warn('⚠️ Failed to fetch sports list, using fallback sports');
        availableSports = [
          { key: 'americanfootball_nfl', title: 'NFL' },
          { key: 'basketball_nba', title: 'NBA' },
          { key: 'soccer_epl', title: 'Premier League' },
          { key: 'baseball_mlb', title: 'MLB' },
          { key: 'icehockey_nhl', title: 'NHL' }
        ];
      }

      // Step 2: Loop through each sport and fetch upcoming games
      const regions = ['us', 'uk', 'eu', 'au'];
      let totalFetched = 0;

      for (const sport of availableSports) {
        try {
          console.log(`📡 Fetching upcoming games for ${sport.key}...`);
          
          // Try regions in sequence to respect rate limits
          for (const region of regions) {
            try {
              const games = await oddsApiClient.fetchOddsFromApi(sport.key, region);
              
              if (games && games.length > 0) {
                // Step 3: Filter for upcoming games only
                const now = new Date();
                const upcomingGames = games.filter(game => {
                  const gameTime = new Date(game.commence_time);
                  const hoursDiff = (gameTime.getTime() - now.getTime()) / (1000 * 60 * 60);
                  
                  // Game should be between 1 hour from now and 7 days in the future
                  return hoursDiff > 1 && hoursDiff < 168; // 7 days = 168 hours
                });

                if (upcomingGames.length > 0) {
                  console.log(`✅ Found ${upcomingGames.length} upcoming games for ${sport.key} in ${region}`);
                  
                  // Convert to our expected format
                  const formattedGames = upcomingGames.map(game => {
                    const gameTime = new Date(game.commence_time);
                    const hoursUntilStart = Math.round((gameTime.getTime() - now.getTime()) / (1000 * 60 * 60));
                    
                    return {
                      id: `upcoming_${game.id}`,
                      sport: normalizeSportName(sport.key),
                      league: sport.title || 'League',
                      homeTeam: game.home_team,
                      awayTeam: game.away_team,
                      homeScore: 0,
                      awayScore: 0,
                      timeLeft: `${hoursUntilStart}h`,
                      betStatus: 'Available',
                      region: region.toUpperCase(),
                      moneylineHome: extractOdds(game, 'home'),
                      moneylineAway: extractOdds(game, 'away'),
                      moneylineDraw: extractOdds(game, 'draw'),
                      spread: 'N/A',
                      total: 'N/A',
                      venue: `${game.home_team} Stadium`,
                      commenceTime: game.commence_time,
                      isLive: false,
                      gameType: 'Regular Season',
                      analysis: {
                        confidence: Math.floor(Math.random() * 20) + 60,
                        prediction: 'Pre-game analysis available',
                        momentum: Math.random() > 0.5 ? 'Home' : 'Away'
                      },
                      homeLogo: '🏠',
                      awayLogo: '✈️'
                    };
                  });

                  formattedGames.forEach(game => {
                    accumulatedEvents.set(game.id, {
                      ...game,
                      _lastUpdated: new Date().toISOString()
                    });
                  });

                  totalFetched += formattedGames.length;
                  break; // Found games for this sport, move to next sport
                }
              }

              // Add delay to respect rate limits
              await new Promise(resolve => setTimeout(resolve, 500));

            } catch (error) {
              if (error.message.includes('401') || error.message.includes('quota')) {
                console.warn('⚠️ API quota reached, stopping fetch');
                break;
              }
              console.warn(`⚠️ Failed to fetch ${sport.key} from ${region}:`, error.message);
            }
          }

          // Break if we've hit quota issues
          if (totalFetched > 50) break;

        } catch (error) {
          console.warn(`⚠️ Error processing sport ${sport.key}:`, error);
        }
      }

      const finalEvents = Array.from(accumulatedEvents.values());
      
      if (finalEvents.length === 0 && (!isManualRefresh || upcomingEvents.length === 0)) {
        // Generate fallback upcoming events
        console.log('📋 Generating fallback upcoming events...');
        const fallbackEvents = generateFallbackUpcomingEvents();
        setUpcomingEvents(fallbackEvents);
      } else {
        setUpcomingEvents(finalEvents);
      }

      console.log(`✅ Upcoming events fetch complete: ${finalEvents.length} total events`);

    } catch (error) {
      console.error('💥 Error in upcoming events fetch:', error);
      
      if (!isManualRefresh || upcomingEvents.length === 0) {
        const fallbackEvents = generateFallbackUpcomingEvents();
        setUpcomingEvents(fallbackEvents);
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (!initialLoadComplete) {
      console.log('🎬 Starting initial upcoming events load...');
      fetchUpcomingEvents();
      setInitialLoadComplete(true);
    }
  }, [initialLoadComplete]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    if (!initialLoadComplete) return;
    
    const interval = setInterval(() => {
      console.log('🔄 Scheduled 5-minute upcoming events refresh...');
      fetchUpcomingEvents(true);
    }, 300000); // 5 minutes
    
    return () => clearInterval(interval);
  }, [initialLoadComplete]);

  return {
    upcomingEvents,
    isLoading,
    isRefreshing,
    refreshEvents: () => fetchUpcomingEvents(true)
  };
};
