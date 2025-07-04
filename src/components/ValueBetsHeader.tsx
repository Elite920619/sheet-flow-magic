import React from 'react';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Activity } from 'lucide-react';

interface ValueBetsHeaderProps {
  filteredBetsCount: number;
}

const ValueBetsHeader = ({ filteredBetsCount }: ValueBetsHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-3">
        <TrendingUp className="h-6 w-6 text-blue-500" />
        <h1 className="text-2xl font-bold text-foreground">Value Bets</h1>
      </div>
      <Badge className="bg-gradient-to-r from-green-400 to-green-500 text-white animate-pulse px-3 py-1">
        <Activity className="h-3 w-3 mr-1" />
        {filteredBetsCount} Live
      </Badge>
    </div>
  );
};

export default ValueBetsHeader;