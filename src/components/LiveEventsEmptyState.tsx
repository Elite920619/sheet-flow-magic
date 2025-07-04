import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, RefreshCw } from 'lucide-react';

interface LiveEventsEmptyStateProps {
  selectedCategory: string;
  selectedRegion: string;
  getSportLabel: (sport: string) => string;
  onRefresh: () => void;
  isRefreshing: boolean;
}

const LiveEventsEmptyState: React.FC<LiveEventsEmptyStateProps> = ({
  selectedCategory,
  selectedRegion,
  getSportLabel,
  onRefresh,
  isRefreshing
}) => {
  const regions = [
    { value: 'all', label: 'All Regions', flag: '🌍' },
    { value: 'us', label: 'United States', flag: '🇺🇸' },
    { value: 'uk', label: 'United Kingdom', flag: '🇬🇧' },
    { value: 'eu', label: 'Europe', flag: '🇪🇺' },
    { value: 'au', label: 'Australia', flag: '🇦🇺' }
  ];

  return (
    <div className="flex items-center justify-center py-20">
      <Card className="p-8 text-center bg-card/80 backdrop-blur-sm border-border shadow-sm">
        <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">
          {selectedCategory === 'all' ? 'No Live Events Found' : `No ${getSportLabel(selectedCategory)} Events`}
        </h3>
        <p className="text-muted-foreground mb-4">
          {selectedRegion === 'all' 
            ? 'No new events are currently available. You may have already bet on all available events.'
            : `No events found for ${regions.find(r => r.value === selectedRegion)?.label}.`
          }
        </p>
        <Button onClick={onRefresh} disabled={isRefreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Try Again
        </Button>
      </Card>
    </div>
  );
};

export default LiveEventsEmptyState;