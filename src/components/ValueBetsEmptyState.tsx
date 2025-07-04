import React from 'react';
import { Card } from '@/components/ui/card';
import { Target } from 'lucide-react';

const ValueBetsEmptyState = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <Card className="p-8 text-center bg-card/80 backdrop-blur-sm border-border shadow-sm">
        <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">Ready to Find Value Bets</h3>
        <p className="text-muted-foreground mb-4">
          Enter bookmaker odds and your estimated win percentage above to discover value betting opportunities.
        </p>
      </Card>
    </div>
  );
};

export default ValueBetsEmptyState;