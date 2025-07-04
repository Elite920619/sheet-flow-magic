
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, TrendingUp } from 'lucide-react';

interface GameCardProps {
  league: string;
  team1: string;
  team2: string;
  team1Logo?: string;
  team2Logo?: string;
  startTime: string;
  moneyline1: string;
  moneyline2: string;
  spread1: string;
  spread2: string;
  spreadOdds1: string;
  spreadOdds2: string;
  over: string;
  under: string;
  overOdds: string;
  underOdds: string;
  hasValueBet?: boolean;
}

const GameCard = ({
  league,
  team1,
  team2,
  startTime,
  moneyline1,
  moneyline2,
  spread1,
  spread2,
  spreadOdds1,
  spreadOdds2,
  over,
  under,
  overOdds,
  underOdds,
  hasValueBet = false
}: GameCardProps) => {
  return (
    <Card className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs text-blue-400 border-blue-400">
              {league}
            </Badge>
            {hasValueBet && (
              <Badge className="bg-green-500 text-white text-xs">
                <TrendingUp className="h-3 w-3 mr-1" />
                Value Bet
              </Badge>
            )}
          </div>
          <div className="flex items-center text-gray-400 text-sm">
            <Clock className="h-4 w-4 mr-1" />
            {startTime}
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="text-center flex-1">
            <p className="text-white font-semibold text-lg">{team1}</p>
          </div>
          <div className="text-gray-400 font-medium px-4">vs</div>
          <div className="text-center flex-1">
            <p className="text-white font-semibold text-lg">{team2}</p>
          </div>
        </div>

        <div className="space-y-3">
          {/* Moneyline */}
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm font-medium">Moneyline</span>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="bg-gray-700 border-gray-600 hover:bg-gray-600 text-white">
                {moneyline1}
              </Button>
              <Button variant="outline" size="sm" className="bg-gray-700 border-gray-600 hover:bg-gray-600 text-white">
                {moneyline2}
              </Button>
            </div>
          </div>

          {/* Spread */}
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm font-medium">Spread</span>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="bg-gray-700 border-gray-600 hover:bg-gray-600 text-white">
                <span className="text-xs mr-1">{spread1}</span>
                {spreadOdds1}
              </Button>
              <Button variant="outline" size="sm" className="bg-gray-700 border-gray-600 hover:bg-gray-600 text-white">
                <span className="text-xs mr-1">{spread2}</span>
                {spreadOdds2}
              </Button>
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm font-medium">Total</span>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="bg-gray-700 border-gray-600 hover:bg-gray-600 text-white">
                <span className="text-xs mr-1">O {over}</span>
                {overOdds}
              </Button>
              <Button variant="outline" size="sm" className="bg-gray-700 border-gray-600 hover:bg-gray-600 text-white">
                <span className="text-xs mr-1">U {under}</span>
                {underOdds}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameCard;
