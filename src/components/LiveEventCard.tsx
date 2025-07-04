
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
      case 'Available': return 'bg-gradient-to-r from-emerald-600/90 to-green-600/90 hover:from-emerald-700/90 hover:to-green-700/90 glow-emerald';
      case 'Limited': return 'bg-gradient-to-r from-amber-600/90 to-orange-600/90 hover:from-amber-700/90 hover:to-orange-700/90';
      case 'Suspended': return 'bg-gradient-to-r from-red-600/90 to-red-700/90 hover:from-red-700/90 hover:to-red-800/90';
      default: return 'bg-gradient-to-r from-blue-600/90 to-indigo-600/90 hover:from-blue-700/90 hover:to-indigo-700/90 glow-blue';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-xl shadow-emerald-600/40 glow-emerald';
    if (confidence >= 60) return 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-xl shadow-amber-600/40';
    return 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-xl shadow-red-600/40';
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
      className="bg-slate-900/70 border-slate-800/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 transform hover:scale-[1.02] group"
      onClick={handleCardClick}
    >
      <CardContent className="p-3 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-1.5">
            <Badge className="bg-gradient-to-r from-blue-600/90 to-indigo-600/90 text-white text-xs px-2 py-0.5 font-medium border-0 shadow-lg">
              {event.league}
            </Badge>
            {isPlayoffGame && (
              <Badge className="bg-gradient-to-r from-purple-600/90 to-violet-600/90 text-white text-xs px-1.5 py-0.5 border-0 shadow-lg">
                <Trophy className="h-2.5 w-2.5" />
              </Badge>
            )}
          </div>
          <Badge className={`${getStatusColor(event.betStatus)} text-white text-xs px-2 py-0.5 animate-pulse border-0 shadow-lg`}>
            <Activity className="h-2.5 w-2.5 mr-1" />
            Live
          </Badge>
        </div>

        {/* Teams & Score */}
        <div className="flex-1 mb-2">
          <div className="flex items-center justify-between mb-1.5 p-1.5 rounded-md bg-slate-950/50 group-hover:bg-slate-900/60 transition-all duration-300 border border-slate-800/30">
            <span className="text-xs font-medium text-slate-200 truncate flex items-center">
              <div className="p-0.5 rounded bg-emerald-600/30 mr-1.5">
                <Plane className="h-2.5 w-2.5 text-emerald-400" />
              </div>
              {event.awayTeam}
            </span>
            <span className="text-sm font-bold text-blue-400 bg-slate-950/70 px-1.5 py-0.5 rounded border border-slate-800/50">{event.awayScore}</span>
          </div>
          <div className="flex items-center justify-between p-1.5 rounded-md bg-slate-950/50 group-hover:bg-slate-900/60 transition-all duration-300 border border-slate-800/30">
            <span className="text-xs font-medium text-slate-200 truncate flex items-center">
              <div className="p-0.5 rounded bg-blue-600/30 mr-1.5">
                <Home className="h-2.5 w-2.5 text-blue-400" />
              </div>
              {event.homeTeam}
            </span>
            <span className="text-sm font-bold text-blue-400 bg-slate-950/70 px-1.5 py-0.5 rounded border border-slate-800/50">{event.homeScore}</span>
          </div>
        </div>

        {/* Betting Options */}
        <div className="space-y-1.5 mb-2">
          <div className={`grid gap-1.5 text-xs ${hasValidDrawOdds && sportSupportsDraws ? 'grid-cols-3' : 'grid-cols-2'}`}>
            <Button
              size="sm"
              variant="outline"
              className="p-2 h-8 flex flex-col justify-center bg-gradient-to-br from-blue-700/90 to-blue-800/90 text-white hover:from-blue-600/90 hover:to-blue-700/90 border-blue-600/50 shadow-lg transition-all duration-300 hover:scale-105"
              onClick={(e) => handleBetClick('home', e)}
            >
              <span className="font-bold text-xs">{convertToDecimal(event.moneylineHome)}x</span>
            </Button>
            {hasValidDrawOdds && sportSupportsDraws && (
              <Button
                size="sm"
                variant="outline"
                className="p-2 h-8 flex flex-col justify-center bg-gradient-to-br from-amber-700/90 to-orange-700/90 text-white hover:from-amber-600/90 hover:to-orange-600/90 border-amber-600/50 shadow-lg transition-all duration-300 hover:scale-105"
                onClick={(e) => handleBetClick('draw', e)}
              >
                <span className="font-bold text-xs">{convertToDecimal(event.moneylineDraw)}x</span>
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              className="p-2 h-8 flex flex-col justify-center bg-gradient-to-br from-emerald-700/90 to-green-700/90 text-white hover:from-emerald-600/90 hover:to-green-600/90 border-emerald-600/50 shadow-lg transition-all duration-300 hover:scale-105"
              onClick={(e) => handleBetClick('away', e)}
            >
              <span className="font-bold text-xs">{convertToDecimal(event.moneylineAway)}x</span>
            </Button>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="flex items-center justify-between pt-1.5 border-t border-slate-800/50">
          <div className="flex items-center space-x-2 text-slate-400 text-xs">
            <div className="flex items-center space-x-0.5">
              <Clock className="h-2.5 w-2.5" />
              <span className="font-medium text-slate-300">{event.timeLeft}</span>
            </div>
            <span className="text-slate-700">•</span>
            <span className="font-medium text-slate-300 text-xs">{event.region}</span>
          </div>
          <div className="flex items-center space-x-0.5">
            <Badge className={`text-xs px-2 py-0.5 ${getConfidenceColor(event.analysis.confidence)} border-0`}>
              <Star className="h-2.5 w-2.5 mr-0.5" />
              {event.analysis.confidence}%
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveEventCard;
