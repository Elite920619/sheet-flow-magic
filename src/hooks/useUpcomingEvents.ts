
import { useState, useEffect } from 'react';
import { enhancedUpcomingEventsService } from '@/services/upcomingEvents/enhancedUpcomingEventsService';

export const useUpcomingEvents = () => {
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  const fetchUpcomingEvents = async (isManualRefresh: boolean = false) => {
    if (isManualRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
      setUpcomingEvents([]);
    }

    try {
      console.log('🚀 GET->DETECT->SHOW: Fetching comprehensive upcoming events...');
      const events = await enhancedUpcomingEventsService.fetchUpcomingEventsComprehensive(
        isManualRefresh, 
        upcomingEvents
      );
      setUpcomingEvents(events);
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (!initialLoadComplete) {
      console.log('🎬 Starting comprehensive upcoming events load...');
      fetchUpcomingEvents();
      setInitialLoadComplete(true);
    }
  }, [initialLoadComplete]);

  useEffect(() => {
    if (!initialLoadComplete) return;
    
    const interval = setInterval(() => {
      console.log('🔄 Scheduled 5-minute upcoming events refresh...');
      fetchUpcomingEvents(true);
    }, 300000);
    
    return () => clearInterval(interval);
  }, [initialLoadComplete]);

  return {
    upcomingEvents,
    isLoading,
    isRefreshing,
    refreshEvents: () => fetchUpcomingEvents(true)
  };
};
