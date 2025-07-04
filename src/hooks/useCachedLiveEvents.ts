import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SyncStatus {
  id: string;
  sync_type: string;
  status: string;
  started_at: string;
  completed_at?: string;
  events_synced: number;
  regions_completed: string[];
}

export const useCachedLiveEvents = () => {
  const [cachedEvents, setCachedEvents] = useState<any[]>([]);
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
  const [isLoadingCache, setIsLoadingCache] = useState(true);
  const [backgroundSyncRunning, setBackgroundSyncRunning] = useState(false);

  // Load cached events from database
  const loadCachedEvents = async () => {
    try {
      setIsLoadingCache(true);
      const { data, error } = await supabase
        .from('cached_live_events')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;

      const events = data?.map(record => ({
        ...(record.event_data as object),
        _cacheId: record.id,
        _lastUpdated: record.updated_at
      })) || [];

      setCachedEvents(events);
      console.log('Loaded cached events:', events.length);
    } catch (error) {
      console.error('Error loading cached events:', error);
      setCachedEvents([]);
    } finally {
      setIsLoadingCache(false);
    }
  };

  // Get current sync status
  const getSyncStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('live_events_sync_status')
        .select('*')
        .order('started_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      setSyncStatus(data);
      return data;
    } catch (error) {
      console.error('Error getting sync status:', error);
      return null;
    }
  };

  // Start background sync
  const startBackgroundSync = async (syncType: 'initial' | 'periodic' = 'initial', onComplete?: () => void) => {
    try {
      setBackgroundSyncRunning(true);
      console.log('Starting background sync:', syncType);

      const { data, error } = await supabase.functions.invoke('live-events-sync', {
        body: { action: 'sync', syncType }
      });

      if (error) throw error;
      
      console.log('Background sync started:', data);
      
      // Poll for completion
      const pollInterval = setInterval(async () => {
        const status = await getSyncStatus();
        if (status?.status === 'completed') {
          clearInterval(pollInterval);
          setBackgroundSyncRunning(false);
          await loadCachedEvents(); // Reload cached events
          console.log('Background sync completed - all regions loaded');
          if (onComplete) onComplete();
        } else if (status?.status === 'error') {
          clearInterval(pollInterval);
          setBackgroundSyncRunning(false);
          console.error('Background sync failed');
        }
      }, 2000);

      // Stop polling after 5 minutes max
      setTimeout(() => {
        clearInterval(pollInterval);
        setBackgroundSyncRunning(false);
      }, 300000);

    } catch (error) {
      console.error('Error starting background sync:', error);
      setBackgroundSyncRunning(false);
    }
  };

  // Get US events first
  const getUSEvents = () => {
    return cachedEvents.filter(event => 
      event.region?.toLowerCase() === 'us' || 
      event.region?.toLowerCase() === 'united states'
    );
  };

  // Initial load
  useEffect(() => {
    loadCachedEvents();
    getSyncStatus();
  }, []);

  // Set up periodic sync (every 10 minutes)
  useEffect(() => {
    const periodicSync = setInterval(() => {
      if (!backgroundSyncRunning) {
        startBackgroundSync('periodic');
      }
    }, 600000); // 10 minutes

    return () => clearInterval(periodicSync);
  }, [backgroundSyncRunning]);

  // Listen for real-time updates to cached events
  useEffect(() => {
    const channel = supabase
      .channel('cached_live_events_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cached_live_events'
        },
        () => {
          console.log('Cached events updated, reloading...');
          loadCachedEvents();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    cachedEvents,
    syncStatus,
    isLoadingCache,
    backgroundSyncRunning,
    loadCachedEvents,
    startBackgroundSync,
    getSyncStatus,
    getUSEvents
  };
};