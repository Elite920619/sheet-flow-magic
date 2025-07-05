
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
    <div className="sticky top-0 z-20 bg-transparent backdrop-blur-sm p-2 border-b border-slate-800/50">
      <div className="flex items-center justify-between mb-2">
        <TabsList className="grid w-full grid-cols-2 max-w-md bg-slate-900/50 border-slate-800/50">
          <TabsTrigger 
            value="live"
            onClick={() => onTabChange?.('live')}
            className={`text-xs ${activeTab === 'live' ? 'bg-slate-800 text-slate-100 shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Live Events
          </TabsTrigger>
          <TabsTrigger 
            value="upcoming"
            onClick={() => onTabChange?.('upcoming')}
            className={`text-xs ${activeTab === 'upcoming' ? 'bg-slate-800 text-slate-100 shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Upcoming Games
          </TabsTrigger>
        </TabsList>
        
        <div className="flex items-center gap-2">
          {pendingBetsCount > 0 && (
            <div className="flex items-center gap-1 text-xs text-blue-400">
              <Badge variant="outline" className="border-blue-500/50 text-blue-400 bg-blue-950/30 text-xs px-1.5 py-0.5">
                {pendingBetsCount} pending bets
              </Badge>
            </div>
          )}
          
          {isRefreshing && (
            <div className="flex items-center text-xs text-slate-400">
              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
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
