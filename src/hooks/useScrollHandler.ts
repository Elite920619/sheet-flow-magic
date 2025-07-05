
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
        console.log('🔄 Loading more events...');
        onLoadMore();
      }
    };

    // Find the scrollable container
    const scrollContainer = document.querySelector('.flex-1.max-h-\\[calc\\(100vh-12rem\\)\\].overflow-y-auto');
    
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, [hasMoreEvents, isLoadingMore, displayedCount, filteredEventsLength, onLoadMore]);
};
