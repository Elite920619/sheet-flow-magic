
import { useState, useEffect, useMemo } from 'react';

interface UseLiveEventsFilteringProps {
  sortedEvents: any[];
  selectedCategory: string;
  selectedRegion: string;
}

export const useLiveEventsFiltering = ({
  sortedEvents,
  selectedCategory,
  selectedRegion,
}: UseLiveEventsFilteringProps) => {
  const [displayedEvents, setDisplayedEvents] = useState<any[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Filter events by category and region
  const filteredEventsByRegion = useMemo(() => {
    console.log('🎯 Filtering events:', {
      totalEvents: sortedEvents.length,
      selectedCategory,
      selectedRegion,
      sampleEvents: sortedEvents.slice(0, 3).map(e => ({ sport: e.sport, region: e.region }))
    });

    let filtered = sortedEvents;

    // Filter by sport category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(event => {
        const eventSport = event.sport?.toLowerCase();
        const selectedSport = selectedCategory.toLowerCase();
        const matches = eventSport === selectedSport;
        
        if (!matches) {
          console.log('🚫 Sport filter mismatch:', { eventSport, selectedSport });
        }
        
        return matches;
      });
    }

    // Filter by region
    if (selectedRegion !== 'all') {
      filtered = filtered.filter(event => {
        const eventRegion = event.region?.toLowerCase();
        const selectedRegionLower = selectedRegion.toLowerCase();
        const matches = eventRegion === selectedRegionLower;
        
        if (!matches) {
          console.log('🚫 Region filter mismatch:', { eventRegion, selectedRegionLower });
        }
        
        return matches;
      });
    }

    console.log('✅ Filtering complete:', {
      originalCount: sortedEvents.length,
      filteredCount: filtered.length,
      selectedCategory,
      selectedRegion
    });

    return filtered;
  }, [sortedEvents, selectedCategory, selectedRegion]);

  // Reset displayed events when filters change
  useEffect(() => {
    const initialCount = Math.min(12, filteredEventsByRegion.length);
    setDisplayedEvents(filteredEventsByRegion.slice(0, initialCount));
    console.log('🔄 Reset displayed events:', {
      initialCount,
      totalFiltered: filteredEventsByRegion.length
    });
  }, [filteredEventsByRegion]);

  const hasMoreEvents = displayedEvents.length < filteredEventsByRegion.length;

  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMoreEvents) return;

    setIsLoadingMore(true);
    console.log('📊 Loading more events...');

    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const currentLength = displayedEvents.length;
    const nextBatch = filteredEventsByRegion.slice(currentLength, currentLength + 12);
    
    setDisplayedEvents(prev => [...prev, ...nextBatch]);
    setIsLoadingMore(false);

    console.log('✅ Loaded more events:', {
      previousCount: currentLength,
      newCount: currentLength + nextBatch.length,
      totalAvailable: filteredEventsByRegion.length
    });
  };

  return {
    filteredEventsByRegion,
    displayedEvents,
    hasMoreEvents,
    isLoadingMore,
    handleLoadMore,
  };
};
