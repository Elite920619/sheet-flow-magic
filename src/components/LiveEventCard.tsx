
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Clock, Activity, Target, Users, MapPin, Thermometer, TrendingUp, BarChart3, Zap, Star, Calculator, Home, Plane, Handshake, Trophy } from 'lucide-react';

interface LiveEventCardProps {
  event: any;
  isExpanded: boolean;
  onToggleExpanded: (eventId: string, event: React.MouseEvent) => void;
  onPlaceBet: (event: any, betType: string) => void;
  gridIndex: number;
  gridColumns: number;
}

const LiveEventCard: React.FC<LiveEventCardProps> = ({
  event,
  isExpanded,
  onToggleExpanded,
  onPlaceBet,
  gridIndex,
  gridColumns
}) => {
  // Convert American odds to decimal odds (compensation rate)
  const convertToDecimal = (americanOdds: string) => {
    if (!americanOdds || americanOdds === 'N/A') return '1.00';
    
    const odds = parseFloat(americanOdds.replace(/[+]/g, ''));
    
    if (!odds || odds === 0) return '1.00';
    
    let decimal;
    if (odds > 0) {
      decimal = (odds / 100) + 1;
    } else {
      decimal = (100 / Math.abs(odds)) + 1;
    }
    
    return decimal.toFixed(2);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-gradient-to-r from-emerald-500/90 to-green-500/90 hover:from-emerald-600/90 hover:to-green-600/90';
      case 'Limited': return 'bg-gradient-to-r from-amber-500/90 to-orange-500/90 hover:from-amber-600/90 hover:to-orange-600/90';
      case 'Suspended': return 'bg-gradient-to-r from-red-500/90 to-red-600/90 hover:from-red-600/90 hover:to-red-700/90';
      default: return 'bg-gradient-to-r from-blue-500/90 to-indigo-500/90 hover:from-blue-600/90 hover:to-indigo-600/90';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/25';
    if (confidence >= 60) return 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25';
    return 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25';
  };

  const handleBetClick = (betType: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onPlaceBet(event, betType);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Do nothing - card clicks are disabled
  };

  // Check if this is a playoff game
  const isPlayoffGame = event.gameType && event.gameType !== 'Regular Season';
  
  // Check if draw odds are available and valid (for regular season games only)
  const hasValidDrawOdds = !isPlayoffGame && 
    event.moneylineDraw && 
    event.moneylineDraw !== 'N/A' && 
    event.moneylineDraw !== null &&
    convertToDecimal(event.moneylineDraw) !== '1.00';

  // Sports that typically have draw outcomes (but only in regular season)
  const sportsWithDraws = ['soccer', 'rugby', 'hockey'];
  const sportSupportsDraws = sportsWithDraws.includes(event.sport);

  return (
    <Card 
      className="glass-dark card-enhanced hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 transform hover:scale-[1.02] group border-slate-700/50"
      onClick={handleCardClick}
    >
      <CardContent className="p-4 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Badge className="bg-gradient-to-r from-blue-500/90 to-indigo-500/90 text-white text-xs px-3 py-1 font-medium border-0 shadow-md">
              {event.league}
            </Badge>
            {isPlayoffGame && (
              <Badge className="bg-gradient-to-r from-purple-500/90 to-violet-500/90 text-white text-xs px-2 py-1 border-0 shadow-md">
                <Trophy className="h-3 w-3" />
              </Badge>
            )}
          </div>
          <Badge className={`${getStatusColor(event.betStatus)} text-white text-xs px-3 py-1 animate-pulse border-0 shadow-lg`}>
            <Activity className="h-3 w-3 mr-1" />
            Live
          </Badge>
        </div>

        {/* Teams & Score */}
        <div className="flex-1 mb-3">
          <div className="flex items-center justify-between mb-2 p-2 rounded-lg bg-slate-800/30 group-hover:bg-slate-800/50 transition-all duration-300">
            <span className="text-sm font-medium text-slate-200 truncate flex items-center">
              <div className="p-1 rounded bg-emerald-500/20 mr-2">
                <Plane className="h-3 w-3 text-emerald-400" />
              </div>
              {event.awayTeam}
            </span>
            <span className="text-lg font-bold text-blue-400 bg-slate-900/50 px-2 py-1 rounded">{event.awayScore}</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/30 group-hover:bg-slate-800/50 transition-all duration-300">
            <span className="text-sm font-medium text-slate-200 truncate flex items-center">
              <div className="p-1 rounded bg-blue-500/20 mr-2">
                <Home className="h-3 w-3 text-blue-400" />
              </div>
              {event.homeTeam}
            </span>
            <span className="text-lg font-bold text-blue-400 bg-slate-900/50 px-2 py-1 rounded">{event.homeScore}</span>
          </div>
        </div>

        {/* Betting Options - Enhanced dark mode styling */}
        <div className="space-y-2 mb-3">
          <div className={`grid gap-2 text-xs ${hasValidDrawOdds && sportSupportsDraws ? 'grid-cols-3' : 'grid-cols-2'}`}>
            <Button
              size="sm"
              variant="outline"
              className="p-3 h-12 flex flex-col justify-center bg-gradient-to-br from-blue-600/80 to-blue-700/80 text-white hover:from-blue-500/80 hover:to-blue-600/80 border-blue-500/50 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105"
              onClick={(e) => handleBetClick('home', e)}
            >
              <span className="font-bold text-sm">{convertToDecimal(event.moneylineHome)}x</span>
            </Button>
            {hasValidDrawOdds && sportSupportsDraws && (
              <Button
                size="sm"
                variant="outline"
                className="p-3 h-12 flex flex-col justify-center bg-gradient-to-br from-amber-600/80 to-orange-600/80 text-white hover:from-amber-500/80 hover:to-orange-500/80 border-amber-500/50 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105"
                onClick={(e) => handleBetClick('draw', e)}
              >
                <span className="font-bold text-sm">{convertToDecimal(event.moneylineDraw)}x</span>
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              className="p-3 h-12 flex flex-col justify-center bg-gradient-to-br from-emerald-600/80 to-green-600/80 text-white hover:from-emerald-500/80 hover:to-green-500/80 border-emerald-500/50 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105"
              onClick={(e) => handleBetClick('away', e)}
            >
              <span className="font-bold text-sm">{convertToDecimal(event.moneylineAway)}x</span>
            </Button>
          </div>
        </div>

        {/* Bottom Info - Enhanced styling */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
          <div className="flex items-center space-x-3 text-slate-400 text-xs">
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span className="font-medium">{event.timeLeft}</span>
            </div>
            <span className="text-slate-600">•</span>
            <span className="font-medium text-slate-300">{event.region}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Badge className={`text-xs px-3 py-1 ${getConfidenceColor(event.analysis.confidence)} border-0`}>
              <Star className="h-3 w-3 mr-1" />
              {event.analysis.confidence}%
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveEventCard;
