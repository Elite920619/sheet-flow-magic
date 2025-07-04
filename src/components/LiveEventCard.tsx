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
      case 'Available': return 'bg-green-400 hover:bg-green-500';
      case 'Limited': return 'bg-orange-400 hover:bg-orange-500';
      case 'Suspended': return 'bg-red-400 hover:bg-red-500';
      default: return 'bg-blue-400 hover:bg-blue-500';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'bg-gradient-to-r from-green-400 to-green-500 text-white';
    if (confidence >= 60) return 'bg-gradient-to-r from-orange-400 to-orange-500 text-white';
    return 'bg-gradient-to-r from-red-400 to-red-500 text-white';
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
      className="bg-card/80 border-border backdrop-blur-sm hover:shadow-md transition-all duration-300 transform hover:scale-105"
      onClick={handleCardClick}
    >
      <CardContent className="p-3 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Badge className="bg-gradient-to-r from-blue-400 to-blue-500 text-white text-xs px-2 py-0.5">
              {event.league}
            </Badge>
            {isPlayoffGame && (
              <Badge className="bg-gradient-to-r from-purple-400 to-purple-500 text-white text-xs px-2 py-0.5">
                <Trophy className="h-3 w-3" />
              </Badge>
            )}
          </div>
          <Badge className={`${getStatusColor(event.betStatus)} text-white text-xs px-2 py-0.5 animate-pulse`}>
            <Activity className="h-2 w-2 mr-1" />
            Live
          </Badge>
        </div>

        {/* Teams & Score */}
        <div className="flex-1 mb-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-800 truncate flex items-center">
              <Plane className="h-3 w-3 mr-1 text-green-600" />
              {event.awayTeam}
            </span>
            <span className="text-lg font-bold text-blue-600">{event.awayScore}</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-800 truncate flex items-center">
              <Home className="h-3 w-3 mr-1 text-blue-600" />
              {event.homeTeam}
            </span>
            <span className="text-lg font-bold text-blue-600">{event.homeScore}</span>
          </div>
        </div>

        {/* Betting Options - Show 2 or 3 columns based on draw odds availability and game type */}
        <div className="space-y-1 mb-2">
          <div className={`grid gap-1 text-xs ${hasValidDrawOdds && sportSupportsDraws ? 'grid-cols-3' : 'grid-cols-2'}`}>
            <Button
              size="sm"
              variant="outline"
              className="p-2 h-10 flex flex-col justify-center bg-blue-800 text-white hover:bg-blue-600"
              onClick={(e) => handleBetClick('home', e)}
            >
              <span className="font-bold text-sm">{convertToDecimal(event.moneylineHome)}x</span>
            </Button>
            {hasValidDrawOdds && sportSupportsDraws && (
              <Button
                size="sm"
                variant="outline"
                className="p-2 h-10 flex flex-col justify-center bg-orange-800 text-white hover:bg-orange-600"
                onClick={(e) => handleBetClick('draw', e)}
              >
                <span className="font-bold text-sm">{convertToDecimal(event.moneylineDraw)}x</span>
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              className="p-2 h-10 flex flex-col justify-center bg-green-800 text-white hover:bg-green-600"
              onClick={(e) => handleBetClick('away', e)}
            >
              <span className="font-bold text-sm">{convertToDecimal(event.moneylineAway)}x</span>
            </Button>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-gray-600 text-xs">
            <Clock className="h-3 w-3" />
            <span>{event.timeLeft}</span>
            <span className="text-gray-400">•</span>
            <span className="font-medium">{event.region}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Badge className={`text-xs px-2 py-0.5 ${getConfidenceColor(event.analysis.confidence)}`}>
              <Star className="h-2 w-2 mr-1" />
              {event.analysis.confidence}%
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveEventCard;
