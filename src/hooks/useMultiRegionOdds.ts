
import { useState, useEffect, useCallback, useRef } from 'react';
import { oddsService } from '@/services/oddsService';

interface RegionOddsState {
  data: any[];
  isLoading: boolean;
  error: string | null;
  lastFetch: number;
  lastRefresh: number;
}

interface UseMultiRegionOddsReturn {
  regionsData: Record<string, RegionOddsState>;
  isAnyLoading: boolean;
  refreshAllRegions: () => void;
  refreshOddsOnly: () => void;
}

const CACHE_DURATION = 30 * 1000; // 30 seconds
const ODDS_REFRESH_INTERVAL = 20 * 1000; // 20 seconds
const REGIONS = ['us', 'uk', 'eu', 'au'];

export const useMultiRegionOdds = (): UseMultiRegionOddsReturn => {
  const [regionsData, setRegionsData] = useState<Record<string, RegionOddsState>>(() => {
    const initialState: Record<string, RegionOddsState> = {};
    REGIONS.forEach(region => {
      initialState[region] = {
        data: [],
        isLoading: false,
        error: null,
        lastFetch: 0,
        lastRefresh: 0
      };
    });
    return initialState;
  });

  const refreshTimeoutRef = useRef<NodeJS.Timeout>();

  const updateRegionState = useCallback((region: string, updates: Partial<RegionOddsState>) => {
    setRegionsData(prev => ({
      ...prev,
      [region]: { ...prev[region], ...updates }
    }));
  }, []);

  const fetchRegionData = useCallback(async (region: string, forceRefresh = false) => {
    const now = Date.now();
    const regionState = regionsData[region];
    
    // Check cache validity
    if (!forceRefresh && regionState.data.length > 0 && 
        (now - regionState.lastFetch) < CACHE_DURATION) {
      console.log(`Using cached data for ${region}`);
      return;
    }

    console.log(`Fetching fresh data for ${region}...`);
    updateRegionState(region, { isLoading: true, error: null });

    try {
      const data = await oddsService.fetchMultiRegionOdds(`americanfootball_nfl`);
      const regionGames = data.filter((game: any) => {
        // Filter games that have odds from this region
        const hasRegionOdds = game.homeOdds?.some((odds: any) => odds.region === region) ||
                             game.awayOdds?.some((odds: any) => odds.region === region);
        return hasRegionOdds;
      });

      updateRegionState(region, {
        data: regionGames,
        isLoading: false,
        lastFetch: now,
        lastRefresh: now
      });
    } catch (error) {
      console.error(`Error fetching ${region} odds:`, error);
      updateRegionState(region, {
        isLoading: false,
        error: `${region.toUpperCase()} events could not be loaded`,
        lastFetch: now
      });
    }
  }, [regionsData, updateRegionState]);

  const refreshOddsValues = useCallback(async (region: string) => {
    const now = Date.now();
    const regionState = regionsData[region];
    
    // Only refresh odds if we have existing data and it's been at least 15 seconds
    if (regionState.data.length === 0 || 
        (now - regionState.lastRefresh) < 15000) {
      return;
    }

    console.log(`Refreshing odds values for ${region}...`);
    
    try {
      const freshData = await oddsService.fetchMultiRegionOdds(`americanfootball_nfl`);
      const regionGames = freshData.filter((game: any) => {
        const hasRegionOdds = game.homeOdds?.some((odds: any) => odds.region === region) ||
                             game.awayOdds?.some((odds: any) => odds.region === region);
        return hasRegionOdds;
      });

      // Update only odds values, preserve other data
      const updatedData = regionState.data.map(existingGame => {
        const freshGame = regionGames.find((g: any) => g.id === existingGame.id);
        if (freshGame) {
          return {
            ...existingGame,
            homeOdds: freshGame.homeOdds,
            awayOdds: freshGame.awayOdds,
            drawOdds: freshGame.drawOdds
          };
        }
        return existingGame;
      });

      updateRegionState(region, {
        data: updatedData,
        lastRefresh: now
      });
    } catch (error) {
      console.warn(`Failed to refresh odds for ${region}:`, error);
    }
  }, [regionsData, updateRegionState]);

  const refreshAllRegions = useCallback(() => {
    console.log('Refreshing all regions...');
    REGIONS.forEach(region => {
      fetchRegionData(region, true);
    });
  }, [fetchRegionData]);

  const refreshOddsOnly = useCallback(() => {
    console.log('Refreshing odds values only...');
    REGIONS.forEach(region => {
      refreshOddsValues(region);
    });
  }, [refreshOddsValues]);

  // Initial parallel fetch on mount
  useEffect(() => {
    console.log('Starting parallel region fetches...');
    REGIONS.forEach(region => {
      fetchRegionData(region);
    });
  }, []);

  // Set up periodic odds refresh
  useEffect(() => {
    const startPeriodicRefresh = () => {
      refreshTimeoutRef.current = setTimeout(() => {
        refreshOddsOnly();
        startPeriodicRefresh(); // Schedule next refresh
      }, ODDS_REFRESH_INTERVAL);
    };

    // Start the periodic refresh cycle
    startPeriodicRefresh();

    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, [refreshOddsOnly]);

  const isAnyLoading = Object.values(regionsData).some(region => region.isLoading);

  return {
    regionsData,
    isAnyLoading,
    refreshAllRegions,
    refreshOddsOnly
  };
};
