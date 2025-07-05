
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import LiveEventsRegionSelector from './LiveEventsRegionSelector';

interface LiveEventsTabsHeaderProps {
  isRefreshing: boolean;
  selectedRegion: string;
  onRegionChange: (region: string) => void;
  pendingBetsCount?: number;
  activeTab?: 'live' | 'upcoming';
  onTabChange?: (tab: 'live' | 'upcoming') => void;
}

const LiveEventsTabsHeader: React.FC<LiveEventsTabsHeaderProps> = ({
  isRefreshing,
  selectedRegion,
  onRegionChange,
  pendingBetsCount = 0,
  activeTab = 'live',
  onTabChange
}) => {
  return (
    <div className="sticky top-0 z-20 bg-background/5 backdrop-blur-sm p-4 border-b">
      <div className="flex items-center justify-between mb-4">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger 
            value="live"
            onClick={() => onTabChange?.('live')}
            className={activeTab === 'live' ? 'bg-background text-foreground shadow-sm' : ''}
          >
            Live Events
          </TabsTrigger>
          <TabsTrigger 
            value="upcoming"
            onClick={() => onTabChange?.('upcoming')}
            className={activeTab === 'upcoming' ? 'bg-background text-foreground shadow-sm' : ''}
          >
            Upcoming Games
          </TabsTrigger>
        </TabsList>
        
        <div className="flex items-center gap-3">
          {pendingBetsCount > 0 && (
            <div className="flex items-center gap-2 text-sm text-blue-500">
              <Badge variant="outline" className="border-blue-500 text-blue-500">
                {pendingBetsCount} pending bets
              </Badge>
            </div>
          )}
          
          {isRefreshing && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Refreshing...
            </div>
          )}
          
          <LiveEventsRegionSelector 
            selectedRegion={selectedRegion}
            onRegionChange={onRegionChange}
          />
        </div>
      </div>
    </div>
  );
};

export default LiveEventsTabsHeader;
