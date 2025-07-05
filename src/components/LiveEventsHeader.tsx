
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
    <div className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-800/50 p-3 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Activity className="h-5 w-5 text-blue-400" />
          <h1 className="text-xl font-bold text-slate-200">Live Events</h1>
        </div>
        <Badge className="bg-gradient-to-r from-green-400 to-green-500 text-white animate-pulse px-2 py-1 text-xs">
          <Activity className="h-3 w-3 mr-1" />
          {sortedEventsLength} Live
        </Badge>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 hover:shadow-lg transition-shadow">
          <CardContent className="p-2.5 text-center">
            <div className="flex items-center justify-center mb-1">
              <Star className="h-3 w-3 text-emerald-400 mr-1.5" />
              <div className="text-base font-bold text-emerald-400">87%</div>
            </div>
            <div className="text-emerald-400 text-xs">AI Accuracy</div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 hover:shadow-lg transition-shadow">
          <CardContent className="p-2.5 text-center">
            <div className="flex items-center justify-center mb-1">
              <Target className="h-3 w-3 text-orange-400 mr-1.5" />
              <div className="text-base font-bold text-orange-400">{availableMarkets}</div>
            </div>
            <div className="text-orange-400 text-xs">Available Markets</div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 hover:shadow-lg transition-shadow">
          <CardContent className="p-2.5 text-center">
            <div className="flex items-center justify-center mb-1">
              <Zap className="h-3 w-3 text-blue-400 mr-1.5" />
              <div className="text-base font-bold text-blue-400">{uniqueSportsLength}</div>
            </div>
            <div className="text-blue-400 text-xs">Sports Available</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LiveEventsHeader;
