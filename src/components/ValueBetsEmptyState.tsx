
import React from 'react';
import { Card } from '@/components/ui/card';
import { Target } from 'lucide-react';

const ValueBetsEmptyState = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <Card className="p-6 text-center bg-slate-900/50 backdrop-blur-sm border-slate-800/50 shadow-sm">
        <Target className="h-10 w-10 text-slate-400 mx-auto mb-3" />
        <h3 className="text-base font-medium text-slate-200 mb-2">Ready to Find Value Bets</h3>
        <p className="text-slate-400 mb-3 text-sm">
          Enter bookmaker odds and your estimated win percentage above to discover value betting opportunities.
        </p>
      </Card>
    </div>
  );
};

export default ValueBetsEmptyState;
