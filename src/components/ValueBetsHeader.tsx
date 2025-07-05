
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Activity } from 'lucide-react';

interface ValueBetsHeaderProps {
  filteredBetsCount: number;
}

const ValueBetsHeader = ({ filteredBetsCount }: ValueBetsHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center space-x-2">
        <TrendingUp className="h-5 w-5 text-blue-400" />
        <h1 className="text-xl font-bold text-slate-200">Value Bets</h1>
      </div>
      <Badge className="bg-gradient-to-r from-green-400 to-green-500 text-white animate-pulse px-2 py-1 text-xs">
        <Activity className="h-3 w-3 mr-1" />
        {filteredBetsCount} Live
      </Badge>
    </div>
  );
};

export default ValueBetsHeader;
