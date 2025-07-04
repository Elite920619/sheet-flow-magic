import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import ValueBetCard from '@/components/ValueBetCard';

interface ValueBet {
  id: string;
  event: string;
  league: string;
  team1: string;
  team2: string;
  bet_type: string;
  odds: string;
  implied_prob: string;
  ai_prob: string;
  value: string;
  confidence: string;
  sportsbook: string;
  time_left: string;
}

interface ValueBetsGridProps {
  bets: ValueBet[];
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
            betType={bet.bet_type}
            odds={bet.odds}
            impliedProb={bet.implied_prob}
            aiProb={bet.ai_prob}
            value={bet.value}
            confidence={bet.confidence}
            sportsbook={bet.sportsbook}
            timeLeft={bet.time_left}
          />
        ))}
      </div>
    </ScrollArea>
  );
};

export default ValueBetsGrid;