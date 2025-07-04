
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import ValueBetCard from '@/components/ValueBetCard';
import { FoundValueBet } from '@/hooks/useValueBetAnalysis';

interface ValueBetsGridProps {
  bets: FoundValueBet[];
}

const ValueBetsGrid = ({ bets }: ValueBetsGridProps) => {
  return (
    <ScrollArea className="h-full p-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 auto-rows-max">
        {bets.map((bet) => (
          <ValueBetCard
            key={bet.id}
            event={bet.event}
            league={bet.league}
            team1={bet.team1}
            team2={bet.team2}
            betType={bet.betType}
            odds={bet.odds}
            impliedProb={bet.impliedProb}
            aiProb={bet.aiProb}
            value={bet.value}
            confidence={bet.confidence}
            sportsbook={bet.sportsbook}
            timeLeft={bet.timeLeft}
          />
        ))}
      </div>
    </ScrollArea>
  );
};

export default ValueBetsGrid;
