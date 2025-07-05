
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Trophy, Target, Zap } from 'lucide-react';

interface LiveEventStatsProps {
  totalEvents: number;
  availableMarkets: number;
}

const LiveEventStats: React.FC<LiveEventStatsProps> = ({
  totalEvents,
  availableMarkets
}) => {
  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50 hover:shadow-lg transition-shadow">
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
            <div className="text-xl font-bold text-slate-200">87%</div>
          </div>
          <div className="text-slate-400 text-sm mb-2">AI Prediction Accuracy</div>
          <Progress value={87} className="h-1.5 bg-slate-800" />
        </CardContent>
      </Card>
      
      <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50 hover:shadow-lg transition-shadow">
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Target className="h-5 w-5 text-green-500 mr-2" />
            <div className="text-xl font-bold text-slate-200">{availableMarkets}</div>
          </div>
          <div className="text-slate-400 text-sm mb-2">Available Markets</div>
          <Progress value={(availableMarkets / totalEvents) * 100} className="h-1.5 bg-slate-800" />
        </CardContent>
      </Card>
      
      <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50 hover:shadow-lg transition-shadow">
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Zap className="h-5 w-5 text-blue-500 mr-2" />
            <div className="text-xl font-bold text-slate-200">2.3s</div>
          </div>
          <div className="text-slate-400 text-sm mb-2">Avg Update Speed</div>
          <Progress value={95} className="h-1.5 bg-slate-800" />
        </CardContent>
      </Card>
    </div>
  );
};

export default LiveEventStats;
