import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Activity, Star, Target, Zap } from 'lucide-react';

interface LiveEventsHeaderProps {
  sortedEventsLength: number;
  availableMarkets: number;
  uniqueSportsLength: number;
}

const LiveEventsHeader: React.FC<LiveEventsHeaderProps> = ({
  sortedEventsLength,
  availableMarkets,
  uniqueSportsLength,
}) => {
  return (
    <div className="bg-card/90 backdrop-blur-sm border-b border-border p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Activity className="h-6 w-6 text-blue-500" />
          <h1 className="text-2xl font-bold text-foreground">Live Events</h1>
        </div>
        <Badge className="bg-gradient-to-r from-green-400 to-green-500 text-white animate-pulse px-3 py-1">
          <Activity className="h-3 w-3 mr-1" />
          {sortedEventsLength} Live
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
      <Card className="bg-card/80 backdrop-blur-sm border-border hover:shadow-lg transition-shadow">
          <CardContent className="p-3 text-center">
            <div className="flex items-center justify-center mb-1">
              <Star className="h-4 w-4 text-emerald-500 mr-2" />
              <div className="text-lg font-bold text-emerald-500">87%</div>
            </div>
            <div className="text-emerald-500 text-xs">AI Accuracy</div>
          </CardContent>
        </Card>
        
      <Card className="bg-card/80 backdrop-blur-sm border-border hover:shadow-lg transition-shadow">
          <CardContent className="p-3 text-center">
            <div className="flex items-center justify-center mb-1">
              <Target className="h-4 w-4 text-orange-500 mr-2" />
              <div className="text-lg font-bold text-orange-500">{availableMarkets}</div>
            </div>
            <div className="text-orange-500 text-xs">Available Markets</div>
          </CardContent>
        </Card>
        
      <Card className="bg-card/80 backdrop-blur-sm border-border hover:shadow-lg transition-shadow">
          <CardContent className="p-3 text-center">
            <div className="flex items-center justify-center mb-1">
              <Zap className="h-4 w-4 text-blue-500 mr-2" />
              <div className="text-lg font-bold text-blue-500">{uniqueSportsLength}</div>
            </div>
            <div className="text-blue-500 text-xs">Sports Available</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LiveEventsHeader;