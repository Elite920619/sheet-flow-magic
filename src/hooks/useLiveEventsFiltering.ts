import { useState, useEffect, useMemo } from 'react';
import { useUserBets } from './useUserBets';

const EVENTS_PER_LOAD = 10;

interface UseLiveEventsFilteringProps {
  sortedEvents: any[];
  selectedCategory: string;
  selectedRegion: string;
}

export const useLiveEventsFiltering = ({
  sortedEvents,
  selectedCategory,
  selectedRegion
}: UseLiveEventsFilteringProps) => {
  const [displayedCount, setDisplayedCount] = useState(EVENTS_PER_LOAD);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const { bets } = useUserBets();

  // Filter out events that have been bet on
  const filteredEventsByRegion = useMemo(() => {
    return sortedEvents
      .filter(event => selectedRegion === 'all' || event.region?.toLowerCase() === selectedRegion)
      .filter(event => {
        // Filter out events that user has already bet on
        const eventKey = `${event.awayTeam} @ ${event.homeTeam}`;
        return !bets.some(bet => bet.event_name === eventKey || bet.teams === `${event.awayTeam} vs ${event.homeTeam}`);
      });
  }, [sortedEvents, selectedRegion, bets]);

  // Get currently displayed events
  const displayedEvents = filteredEventsByRegion.slice(0, displayedCount);
  const hasMoreEvents = displayedCount < filteredEventsByRegion.length;

  // Reset displayed count when filters change
  useEffect(() => {
    setDisplayedCount(EVENTS_PER_LOAD);
  }, [filteredEventsByRegion.length, selectedCategory, selectedRegion]);

  const handleLoadMore = () => {
    if (isLoadingMore || !hasMoreEvents) return;
    
    setIsLoadingMore(true);
    // Show loading for 1-2 seconds for better UX
    setTimeout(() => {
      const newCount = displayedCount + EVENTS_PER_LOAD;
      setDisplayedCount(newCount);
      setIsLoadingMore(false);
    }, 1500);
  };

  return {
    filteredEventsByRegion,
    displayedEvents,
    hasMoreEvents,
    isLoadingMore,
    handleLoadMore
  };
};