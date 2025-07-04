
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
    <div className="bg-ultra-dark border-b border-slate-800/50 p-6 shadow-2xl shadow-black/60">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-600/30 to-purple-700/30 backdrop-blur-xl border border-blue-500/30 glow-blue">
            <Activity className="h-7 w-7 text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
            Live Events
          </h1>
        </div>
        <Badge className="bg-gradient-to-r from-emerald-600/90 to-green-600/90 text-white animate-pulse-premium px-6 py-3 text-sm shadow-2xl shadow-emerald-600/40 border-0">
          <Activity className="h-4 w-4 mr-2" />
          {sortedEventsLength} Live
        </Badge>
      </div>

      {/* Ultra-premium Stats Cards */}
      <div className="grid grid-cols-3 gap-6">
        <Card className="premium-card glass-dark hover:shadow-emerald-500/20 hover:shadow-2xl transition-all duration-500 group border-slate-800/50">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-3">
              <div className="p-3 rounded-full bg-gradient-to-br from-emerald-600/30 to-green-600/30 group-hover:from-emerald-600/40 group-hover:to-green-600/40 transition-all duration-500 glow-emerald">
                <Star className="h-6 w-6 text-emerald-400" />
              </div>
            </div>
            <div className="text-3xl font-bold text-emerald-400 mb-2 bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">87%</div>
            <div className="text-emerald-300/90 text-sm font-medium">AI Accuracy</div>
          </CardContent>
        </Card>
        
        <Card className="premium-card glass-dark hover:shadow-amber-500/20 hover:shadow-2xl transition-all duration-500 group border-slate-800/50">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-3">
              <div className="p-3 rounded-full bg-gradient-to-br from-amber-600/30 to-orange-600/30 group-hover:from-amber-600/40 group-hover:to-orange-600/40 transition-all duration-500">
                <Target className="h-6 w-6 text-amber-400" />
              </div>
            </div>
            <div className="text-3xl font-bold text-amber-400 mb-2 bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">{availableMarkets}</div>
            <div className="text-amber-300/90 text-sm font-medium">Available Markets</div>
          </CardContent>
        </Card>
        
        <Card className="premium-card glass-dark hover:shadow-blue-500/20 hover:shadow-2xl transition-all duration-500 group border-slate-800/50">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-3">
              <div className="p-3 rounded-full bg-gradient-to-br from-blue-600/30 to-indigo-600/30 group-hover:from-blue-600/40 group-hover:to-indigo-600/40 transition-all duration-500 glow-blue">
                <Zap className="h-6 w-6 text-blue-400" />
              </div>
            </div>
            <div className="text-3xl font-bold text-blue-400 mb-2 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">{uniqueSportsLength}</div>
            <div className="text-blue-300/90 text-sm font-medium">Sports Available</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LiveEventsHeader;
