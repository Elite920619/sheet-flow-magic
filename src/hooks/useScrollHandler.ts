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
      if (target.scrollTop + target.clientHeight >= target.scrollHeight - 100) {
        if (hasMoreEvents && !isLoadingMore) {
          onLoadMore();
        }
      }
    };

    // Target the scrollable container instead of window
    const scrollContainer = document.querySelector('.flex-1.max-h-\\[calc\\(100vh-8rem\\)\\].overflow-y-auto');
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, [hasMoreEvents, isLoadingMore, displayedCount, filteredEventsLength, onLoadMore]);
};