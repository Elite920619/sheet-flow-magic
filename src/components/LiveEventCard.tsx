
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
    if (confidence >= 80) return 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-2xl shadow-emerald-600/40 glow-emerald';
    if (confidence >= 60) return 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-2xl shadow-amber-600/40';
    return 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-2xl shadow-red-600/40';
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
      className="premium-card glass-dark hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 transform hover:scale-[1.03] group border-slate-800/50"
      onClick={handleCardClick}
    >
      <CardContent className="p-5 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Badge className="bg-gradient-to-r from-blue-600/90 to-indigo-600/90 text-white text-xs px-4 py-2 font-semibold border-0 shadow-xl glow-blue">
              {event.league}
            </Badge>
            {isPlayoffGame && (
              <Badge className="bg-gradient-to-r from-purple-600/90 to-violet-600/90 text-white text-xs px-3 py-2 border-0 shadow-xl glow-purple">
                <Trophy className="h-3 w-3" />
              </Badge>
            )}
          </div>
          <Badge className={`${getStatusColor(event.betStatus)} text-white text-xs px-4 py-2 animate-pulse-premium border-0 shadow-2xl`}>
            <Activity className="h-3 w-3 mr-1" />
            Live
          </Badge>
        </div>

        {/* Teams & Score */}
        <div className="flex-1 mb-4">
          <div className="flex items-center justify-between mb-3 p-3 rounded-xl bg-slate-950/50 group-hover:bg-slate-900/60 transition-all duration-500 border border-slate-800/30">
            <span className="text-sm font-semibold text-premium-light truncate flex items-center">
              <div className="p-2 rounded-lg bg-emerald-600/30 mr-3 glow-emerald">
                <Plane className="h-4 w-4 text-emerald-400" />
              </div>
              {event.awayTeam}
            </span>
            <span className="text-xl font-bold text-blue-400 bg-slate-950/70 px-3 py-2 rounded-lg border border-slate-800/50">{event.awayScore}</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/50 group-hover:bg-slate-900/60 transition-all duration-500 border border-slate-800/30">
            <span className="text-sm font-semibold text-premium-light truncate flex items-center">
              <div className="p-2 rounded-lg bg-blue-600/30 mr-3 glow-blue">
                <Home className="h-4 w-4 text-blue-400" />
              </div>
              {event.homeTeam}
            </span>
            <span className="text-xl font-bold text-blue-400 bg-slate-950/70 px-3 py-2 rounded-lg border border-slate-800/50">{event.homeScore}</span>
          </div>
        </div>

        {/* Betting Options - Ultra-premium dark mode styling */}
        <div className="space-y-3 mb-4">
          <div className={`grid gap-3 text-xs ${hasValidDrawOdds && sportSupportsDraws ? 'grid-cols-3' : 'grid-cols-2'}`}>
            <Button
              size="sm"
              variant="outline"
              className="p-4 h-14 flex flex-col justify-center bg-gradient-to-br from-blue-700/90 to-blue-800/90 text-white hover:from-blue-600/90 hover:to-blue-700/90 border-blue-600/50 shadow-2xl backdrop-blur-xl transition-all duration-400 hover:scale-110 glow-blue"
              onClick={(e) => handleBetClick('home', e)}
            >
              <span className="font-bold text-base">{convertToDecimal(event.moneylineHome)}x</span>
            </Button>
            {hasValidDrawOdds && sportSupportsDraws && (
              <Button
                size="sm"
                variant="outline"
                className="p-4 h-14 flex flex-col justify-center bg-gradient-to-br from-amber-700/90 to-orange-700/90 text-white hover:from-amber-600/90 hover:to-orange-600/90 border-amber-600/50 shadow-2xl backdrop-blur-xl transition-all duration-400 hover:scale-110"
                onClick={(e) => handleBetClick('draw', e)}
              >
                <span className="font-bold text-base">{convertToDecimal(event.moneylineDraw)}x</span>
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              className="p-4 h-14 flex flex-col justify-center bg-gradient-to-br from-emerald-700/90 to-green-700/90 text-white hover:from-emerald-600/90 hover:to-green-600/90 border-emerald-600/50 shadow-2xl backdrop-blur-xl transition-all duration-400 hover:scale-110 glow-emerald"
              onClick={(e) => handleBetClick('away', e)}
            >
              <span className="font-bold text-base">{convertToDecimal(event.moneylineAway)}x</span>
            </Button>
          </div>
        </div>

        {/* Bottom Info - Ultra-premium styling */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800/50">
          <div className="flex items-center space-x-4 text-premium-subtle text-xs">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span className="font-semibold text-premium-muted">{event.timeLeft}</span>
            </div>
            <span className="text-slate-700">•</span>
            <span className="font-semibold text-premium-muted">{event.region}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={`text-xs px-4 py-2 ${getConfidenceColor(event.analysis.confidence)} border-0`}>
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
