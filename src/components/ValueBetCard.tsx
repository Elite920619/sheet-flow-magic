
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Star, Target, TrendingUp } from 'lucide-react';

interface ValueBetCardProps {
  event: string;
  league: string;
  team1: string;
  team2: string;
  betType: string;
  odds: string;
  impliedProb: string;
  aiProb: string;
  value: string;
  confidence: string;
  sportsbook: string;
  timeLeft: string;
}

const ValueBetCard = ({
  event,
  league,
  team1,
  team2,
  betType,
  odds,
  impliedProb,
  aiProb,
  value,
  confidence,
  sportsbook,
  timeLeft
}: ValueBetCardProps) => {
  const getConfidenceColor = (conf: string) => {
    const num = parseFloat(conf);
    if (num >= 80) return 'bg-gradient-to-r from-green-400 to-green-500';
    if (num >= 60) return 'bg-gradient-to-r from-orange-400 to-orange-500';
    return 'bg-gradient-to-r from-red-400 to-red-500';
  };

  const getValueColor = (val: string) => {
    const num = parseFloat(val.replace('%', '').replace('+', ''));
    if (num >= 15) return 'text-green-400 bg-green-900/30 border-green-500/30';
    if (num >= 10) return 'text-blue-400 bg-blue-900/30 border-blue-500/30';
    return 'text-purple-400 bg-purple-900/30 border-purple-500/30';
  };

  const getOddsColor = (odds: string) => {
    if (odds.startsWith('+')) return 'bg-gradient-to-r from-green-400 to-green-500';
    return 'bg-gradient-to-r from-blue-400 to-blue-500';
  };

  const handleCardClick = () => {
    console.log('Value bet clicked:', { event, betType, odds, value });
    // Future features can be implemented here:
    // - Open bet placement modal
    // - Show detailed analysis
    // - Navigate to detailed view
  };

  return (
    <Card 
      className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50 hover:border-blue-500/50 hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:scale-[1.02]"
      onClick={handleCardClick}
    >
      <CardContent className="p-3">
        {/* Header */}
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1.5">
              <Badge className="bg-gradient-to-r from-blue-400 to-blue-500 text-white text-xs px-1.5 py-0.5">
                {league}
              </Badge>
              <div className="flex items-center text-slate-400 text-xs">
                <Clock className="h-2.5 w-2.5 mr-1" />
                <span>{timeLeft}</span>
              </div>
            </div>
            <h3 className="text-xs font-bold text-slate-200 mb-1 text-center">
              {team1} vs {team2}
            </h3>
            <p className="text-xs text-slate-400 text-center">{betType}</p>
          </div>
          <div className={`flex items-center space-x-1 px-1.5 py-0.5 rounded-full text-xs font-bold ml-2 border ${getValueColor(value)}`}>
            <Star className="h-2.5 w-2.5" />
            <span>{value}</span>
          </div>
        </div>

        {/* Core Metrics */}
        <div className="grid grid-cols-3 gap-2 mb-2">
          <div className="text-center">
            <div className="text-xs text-slate-400 mb-1">Odds</div>
            <Badge className={`${getOddsColor(odds)} text-white text-xs px-1.5 py-0.5 font-bold`}>
              {odds}
            </Badge>
          </div>
          
          <div className="text-center">
            <div className="text-xs text-slate-400 mb-1">AI Prob</div>
            <div className="text-slate-200 font-bold text-xs">{aiProb}</div>
          </div>
          
          <div className="text-center">
            <div className="text-xs text-slate-400 mb-1">Conf</div>
            <Badge className={`${getConfidenceColor(confidence)} text-white text-xs px-1.5 py-0.5`}>
              {confidence}%
            </Badge>
          </div>
        </div>

        {/* Integrated Analysis Section */}
        <div className="bg-slate-950/30 p-2 rounded-lg border border-slate-800/50">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center space-x-1">
              <Target className="h-2.5 w-2.5 text-blue-500" />
              <span className="text-xs font-bold text-slate-200">Quick Analysis</span>
            </div>
            <TrendingUp className="h-2.5 w-2.5 text-green-500" />
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Value Edge:</span>
                <span className="font-bold text-green-400">{value}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Implied:</span>
                <span className="font-medium text-slate-200">{impliedProb}</span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Confidence:</span>
                <span className="font-bold text-orange-400">{confidence}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Source:</span>
                <span className="font-medium text-slate-200 text-xs truncate">{sportsbook}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ValueBetCard;
