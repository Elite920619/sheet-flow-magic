
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
    <div className="bg-slate-950 border-b border-slate-800/50 p-5 shadow-xl shadow-black/50">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-600/30 to-purple-700/30 border border-blue-500/30">
            <Activity className="h-6 w-6 text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
            Live Events
          </h1>
        </div>
        <Badge className="bg-gradient-to-r from-emerald-600/90 to-green-600/90 text-white animate-pulse px-4 py-2 text-sm shadow-xl shadow-emerald-600/30 border-0">
          <Activity className="h-3 w-3 mr-1" />
          {sortedEventsLength} Live
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-slate-900/60 border-slate-800/50 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300 group">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <div className="p-2 rounded-full bg-gradient-to-br from-emerald-600/30 to-green-600/30 group-hover:from-emerald-600/40 group-hover:to-green-600/40 transition-all duration-300">
                <Star className="h-5 w-5 text-emerald-400" />
              </div>
            </div>
            <div className="text-2xl font-bold text-emerald-400 mb-1">87%</div>
            <div className="text-emerald-300/80 text-xs font-medium">AI Accuracy</div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900/60 border-slate-800/50 hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300 group">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <div className="p-2 rounded-full bg-gradient-to-br from-amber-600/30 to-orange-600/30 group-hover:from-amber-600/40 group-hover:to-orange-600/40 transition-all duration-300">
                <Target className="h-5 w-5 text-amber-400" />
              </div>
            </div>
            <div className="text-2xl font-bold text-amber-400 mb-1">{availableMarkets}</div>
            <div className="text-amber-300/80 text-xs font-medium">Available Markets</div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900/60 border-slate-800/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 group">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <div className="p-2 rounded-full bg-gradient-to-br from-blue-600/30 to-indigo-600/30 group-hover:from-blue-600/40 group-hover:to-indigo-600/40 transition-all duration-300">
                <Zap className="h-5 w-5 text-blue-400" />
              </div>
            </div>
            <div className="text-2xl font-bold text-blue-400 mb-1">{uniqueSportsLength}</div>
            <div className="text-blue-300/80 text-xs font-medium">Sports Available</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LiveEventsHeader;
