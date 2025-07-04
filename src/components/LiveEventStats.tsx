
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
    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="bg-card/80 backdrop-blur-sm border-border hover:shadow-lg transition-shadow">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center mb-2">
            <Trophy className="h-6 w-6 text-yellow-600 mr-2" />
            <div className="text-2xl font-bold text-foreground">87%</div>
          </div>
          <div className="text-muted-foreground text-sm mb-2">AI Prediction Accuracy</div>
          <Progress value={87} className="h-2" />
        </CardContent>
      </Card>
      
      <Card className="bg-card/80 backdrop-blur-sm border-border hover:shadow-lg transition-shadow">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center mb-2">
            <Target className="h-6 w-6 text-green-600 mr-2" />
            <div className="text-2xl font-bold text-foreground">{availableMarkets}</div>
          </div>
          <div className="text-muted-foreground text-sm mb-2">Available Markets</div>
          <Progress value={(availableMarkets / totalEvents) * 100} className="h-2" />
        </CardContent>
      </Card>
      
      <Card className="bg-card/80 backdrop-blur-sm border-border hover:shadow-lg transition-shadow">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center mb-2">
            <Zap className="h-6 w-6 text-blue-600 mr-2" />
            <div className="text-2xl font-bold text-foreground">2.3s</div>
          </div>
          <div className="text-muted-foreground text-sm mb-2">Avg Update Speed</div>
          <Progress value={95} className="h-2" />
        </CardContent>
      </Card>
    </div>
  );
};

export default LiveEventStats;
