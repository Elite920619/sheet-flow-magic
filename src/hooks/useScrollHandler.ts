import { useEffect } from 'react';

interface UseScrollHandlerProps {
  hasMoreEvents: boolean;
  isLoadingMore: boolean;
  displayedCount: number;
  filteredEventsLength: number;
  onLoadMore: () => void;
}

export const useScrollHandler = ({
  hasMoreEvents,
  isLoadingMore,
  displayedCount,
  filteredEventsLength,
  onLoadMore
}: UseScrollHandlerProps) => {
  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      
      // Check if we're near the bottom (within 200px)
      const isNearBottom = target.scrollTop + target.clientHeight >= target.scrollHeight - 200;
      
      if (isNearBottom && hasMoreEvents && !isLoadingMore) {
        console.log('🔄 Loading more events...', {
          scrollTop: target.scrollTop,
          clientHeight: target.clientHeight,
          scrollHeight: target.scrollHeight,
          hasMoreEvents,
          displayedCount,
          filteredEventsLength
        });
        onLoadMore();
      }
    };

    // Find the scrollable container with the new class name
    const scrollContainer = document.querySelector('.flex-1.overflow-y-auto');
    
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    } else {
      console.warn('Scroll container not found');
    }
  }, [hasMoreEvents, isLoadingMore, displayedCount, filteredEventsLength, onLoadMore]);
};
