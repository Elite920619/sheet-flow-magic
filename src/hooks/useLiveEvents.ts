
import { useState, useEffect } from 'react';
import { oddsService } from '@/services/oddsService';
import { useCachedLiveEvents } from './useCachedLiveEvents';
import { MockDataProvider } from '@/services/odds/mockDataProvider';

export const useLiveEvents = (region: string = 'all', eventType: 'live' | 'upcoming' = 'live') => {
  const [selectedSport, setSelectedSport] = useState('all');
  const [expandedEvents, setExpandedEvents] = useState<string[]>([]);
  const [liveEvents, setLiveEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [allDataLoaded, setAllDataLoaded] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [regionsProcessed, setRegionsProcessed] = useState(0);

  const {
    cachedEvents,
    isLoadingCache,
    startBackgroundSync,
    getUSEvents
  } = useCachedLiveEvents();

  const toggleEventDetails = (eventId: string, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    setExpandedEvents(prev => 
      prev.includes(eventId) 
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  const fetchParallelEvents = async (isManualRefresh: boolean = false) => {
    if (isManualRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
      setLiveEvents([]);
      setRegionsProcessed(0);
    }
    
    try {
      console.log(`🚀 Starting parallel ${eventType} events fetch with Get->Detect->Show...`);
      
      const accumulatedEvents = new Map<string, any>();
      
      // If refreshing, start with existing events to maintain continuity
      if (isManualRefresh && liveEvents.length > 0) {
        liveEvents.forEach(event => {
          accumulatedEvents.set(event.id, event);
        });
        console.log(`📋 Starting refresh with ${liveEvents.length} existing events`);
      }
      
      const onRegionComplete = (newEvents: any[]) => {
        console.log(`📊 Region completed: ${newEvents.length} total events now available`);
        
        // Filter events based on type (live vs upcoming)
        const filteredEvents = newEvents.filter(event => {
          if (eventType === 'live') {
            return event.isLive || event.timeLeft === 'LIVE' || 
                   event.timeLeft.includes('Q') || event.timeLeft.includes('H') ||
                   event.timeLeft.includes("'") || event.timeLeft.includes('P');
          } else {
            return !event.isLive && event.timeLeft === 'Upcoming';
          }
        });
        
        // Add new events to accumulated map (this will update existing ones or add new ones)
        filteredEvents.forEach(event => {
          accumulatedEvents.set(event.id, {
            ...event,
            _lastUpdated: new Date().toISOString()
          });
        });
        
        const allCurrentEvents = Array.from(accumulatedEvents.values());
        setLiveEvents(allCurrentEvents);
        setRegionsProcessed(prev => prev + 1);
        
        if (!initialLoadComplete && allCurrentEvents.length > 0) {
          setIsLoading(false);
          console.log(`🎯 First region ${eventType} data loaded, showing results immediately...`);
        }
      };
      
      let events;
      
      if (region === 'all') {
        events = await oddsService.fetchLiveEventsProgressive(onRegionComplete);
      } else {
        events = await oddsService.fetchLiveEventsByRegion(region);
        
        // Apply same filtering for single region
        const filteredEvents = events.filter(event => {
          if (eventType === 'live') {
            return event.isLive || event.timeLeft === 'LIVE' || 
                   event.timeLeft.includes('Q') || event.timeLeft.includes('H') ||
                   event.timeLeft.includes("'") || event.timeLeft.includes('P');
          } else {
            return !event.isLive && event.timeLeft === 'Upcoming';
          }
        });
        
        filteredEvents.forEach(event => {
          accumulatedEvents.set(event.id, {
            ...event,
            _lastUpdated: new Date().toISOString()
          });
        });
        setLiveEvents(Array.from(accumulatedEvents.values()));
      }
      
      console.log(`✅ Parallel ${eventType} events fetch complete: ${events?.length || 0} total events`);
      
    } catch (error) {
      console.error(`💥 Error in parallel ${eventType} event fetch:`, error);
      
      // Only generate fallback if we don't have existing data
      if (!isManualRefresh || liveEvents.length === 0) {
        const regions = ['us', 'uk', 'eu', 'au'];
        const fallbackEvents: any[] = [];
        
        regions.forEach(regionCode => {
          const regionEvents = MockDataProvider.generateRegionEvents(regionCode, 10);
          
          // Apply filtering to fallback data too
          const filteredFallback = regionEvents.filter(event => {
            if (eventType === 'live') {
              return event.timeLeft === 'LIVE' || 
                     event.timeLeft.includes('Q') || event.timeLeft.includes('H') ||
                     event.timeLeft.includes("'") || event.timeLeft.includes('P');
            } else {
              return event.timeLeft === 'Upcoming';
            }
          });
          
          fallbackEvents.push(...filteredFallback);
        });
        
        console.log(`📋 Generated ${fallbackEvents.length} regional mock ${eventType} events`);
        setLiveEvents(fallbackEvents);
      } else {
        console.log(`⚠️ Refresh failed but keeping ${liveEvents.length} existing events`);
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
      setAllDataLoaded(true);
    }
  };

  // Initial load with parallel processing
  useEffect(() => {
    if (!initialLoadComplete) {
      console.log('🎬 Starting initial parallel live events load...');
      fetchParallelEvents();
      setInitialLoadComplete(true);
    }
  }, [initialLoadComplete, eventType]);

  // Regular refresh interval (every 5 minutes)
  useEffect(() => {
    if (!initialLoadComplete) return;
    
    const interval = setInterval(() => {
      console.log('🔄 Scheduled 5-minute parallel refresh...');
      fetchParallelEvents(true);
    }, 300000); // 5 minutes (300,000 milliseconds)
    
    return () => clearInterval(interval);
  }, [initialLoadComplete, eventType]);

  const filteredEvents = selectedSport === 'all' 
    ? liveEvents 
    : liveEvents.filter(event => event.sport === selectedSport);

  const getBetsByCategory = (category: string) => {
    if (category === 'all') return liveEvents.length;
    return liveEvents.filter(event => event.sport === category).length;
  };

  return {
    selectedSport,
    setSelectedSport,
    expandedEvents,
    toggleEventDetails,
    liveEvents,
    filteredEvents,
    getBetsByCategory,
    isLoading,
    isRefreshing,
    allDataLoaded,
    regionsProcessed,
    refreshEvents: () => fetchParallelEvents(true)
  };
};
