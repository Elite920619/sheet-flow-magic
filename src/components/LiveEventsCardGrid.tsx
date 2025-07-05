import React from 'react';
import { Loader2 } from 'lucide-react';
import LiveEventCard from './LiveEventCard';

interface LiveEventsCardGridProps {
  displayedEvents: any[];
  filteredEventsLength: number;
  selectedCategory: string;
  selectedRegion: string;
  uniqueSportsLength: number;
  getSportLabel: (sport: string) => string;
  onEventCardBet: (event: any, betType: string) => void;
  isLoadingMore: boolean;
  hasMoreEvents: boolean;
}

const LiveEventsCardGrid: React.FC<LiveEventsCardGridProps> = ({
  displayedEvents,
  filteredEventsLength,
  selectedCategory,
  selectedRegion,
  uniqueSportsLength,
  getSportLabel,
  onEventCardBet,
  isLoadingMore,
  hasMoreEvents
}) => {
  const regions = [
    { value: 'all', label: 'All Regions', flag: '🌍' },
    { value: 'us', label: 'United States', flag: '🇺🇸' },
    { value: 'uk', label: 'United Kingdom', flag: '🇬🇧' },
    { value: 'eu', label: 'Europe', flag: '🇪🇺' },
    { value: 'au', label: 'Australia', flag: '🇦🇺' }
  ];

  const handleCardClick = () => {
    // Do nothing - only bet buttons should trigger actions
  };

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {displayedEvents.map((event, index) => (
          <LiveEventCard
            key={`${event.id}-${index}`}
            event={event}
            isExpanded={false}
            onToggleExpanded={handleCardClick}
            onPlaceBet={onEventCardBet}
            gridIndex={index}
            gridColumns={4}
          />
        ))}
      </div>

      {/* Auto-loading indicator */}
      {isLoadingMore && (
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Loading more events...
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveEventsCardGrid;