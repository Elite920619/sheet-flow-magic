
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
  const [displayedCount, setDisplayedCount] = useState(20);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Reset displayed count when filters change
  useEffect(() => {
    setDisplayedCount(20);
  }, [selectedCategory, selectedRegion, sortedEvents.length]);

  // Filter events by region and category
  const filteredEventsByRegion = useMemo(() => {
    let filtered = sortedEvents;
    
    // Filter by region
    if (selectedRegion !== 'all') {
      filtered = filtered.filter(event => 
        event.region?.toLowerCase() === selectedRegion.toLowerCase()
      );
    }
    
    // Filter by category (already handled by parent component)
    return filtered;
  }, [sortedEvents, selectedRegion]);

  // Get displayed events (limited by displayedCount)
  const displayedEvents = useMemo(() => {
    return filteredEventsByRegion.slice(0, displayedCount);
  }, [filteredEventsByRegion, displayedCount]);

  // Check if there are more events to load
  const hasMoreEvents = displayedCount < filteredEventsByRegion.length;

  // Load more events function
  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMoreEvents) return;
    
    setIsLoadingMore(true);
    
    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setDisplayedCount(prev => prev + 10);
    setIsLoadingMore(false);
  };

  return {
    filteredEventsByRegion,
    displayedEvents,
    hasMoreEvents,
    isLoadingMore,
    handleLoadMore,
  };
};
