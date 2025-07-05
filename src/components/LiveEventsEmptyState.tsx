
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
    <div className="flex items-center justify-center py-16">
      <Card className="p-6 text-center bg-slate-900/50 backdrop-blur-sm border-slate-800/50 shadow-sm">
        <Activity className="h-10 w-10 text-slate-400 mx-auto mb-3" />
        <h3 className="text-base font-medium text-slate-200 mb-2">
          {selectedCategory === 'all' ? 'No Live Events Found' : `No ${getSportLabel(selectedCategory)} Events`}
        </h3>
        <p className="text-slate-400 mb-4 text-sm">
          {selectedRegion === 'all' 
            ? 'No new events are currently available. You may have already bet on all available events.'
            : `No events found for ${regions.find(r => r.value === selectedRegion)?.label}.`
          }
        </p>
        <Button 
          onClick={onRefresh} 
          disabled={isRefreshing}
          className="bg-blue-600/90 hover:bg-blue-700/90 text-white border-blue-500/50 text-sm px-4 py-2"
        >
          <RefreshCw className={`h-3 w-3 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Try Again
        </Button>
      </Card>
    </div>
  );
};

export default LiveEventsEmptyState;
