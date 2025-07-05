
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Clock, Activity, Target, Users, MapPin, Thermometer, TrendingUp, BarChart3, Zap, Star, Trophy } from 'lucide-react';

interface LiveEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: any;
  onPlaceBet: (event: any) => void;
}

const LiveEventModal: React.FC<LiveEventModalProps> = ({ isOpen, onClose, event, onPlaceBet }) => {
  if (!event) return null;

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'bg-gradient-to-r from-green-400 to-green-500 text-white';
    if (confidence >= 60) return 'bg-gradient-to-r from-orange-400 to-orange-500 text-white';
    return 'bg-gradient-to-r from-red-400 to-red-500 text-white';
  };

  const getOddsColor = (odds: string) => {
    const numericOdds = parseFloat(odds.replace(/[^-\d.]/g, ''));
    if (numericOdds > 150) return 'bg-gradient-to-r from-green-400 to-green-500';
    if (numericOdds > 0) return 'bg-gradient-to-r from-blue-400 to-blue-500';
    return 'bg-gradient-to-r from-purple-400 to-purple-500';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900/95 border-slate-800/50 max-w-2xl max-h-[85vh] overflow-y-auto animate-scale-in backdrop-blur-sm">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge className="bg-gradient-to-r from-blue-400 to-blue-500 text-white text-xs">
                {event.league}
              </Badge>
              <Badge className="bg-gradient-to-r from-green-400 to-green-500 text-white animate-pulse text-xs">
                <Activity className="h-2.5 w-2.5 mr-1" />
                Live
              </Badge>
            </div>
            <div className="flex items-center space-x-3 text-slate-400 text-sm">
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {event.timeLeft}
              </div>
              <div className="flex items-center">
                <Users className="h-3 w-3 mr-1" />
                {event.attendance}
              </div>
            </div>
          </div>
          <DialogTitle className="text-lg font-bold text-slate-200 flex items-center mt-2">
            <Trophy className="h-4 w-4 mr-2 text-yellow-500" />
            {event.awayTeam} vs {event.homeTeam}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Live betting opportunities with AI-powered analysis
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {/* Live Score */}
          <div className="bg-slate-950/50 rounded-lg p-3 border border-slate-800/50">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-slate-200 flex items-center text-sm">
                <BarChart3 className="h-3 w-3 mr-2 text-blue-500" />
                Live Score
              </h3>
              <Badge className="bg-blue-900/50 text-blue-300 text-xs">
                {event.quarter || 'Final'}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <div className="font-bold text-slate-200 flex items-center justify-center mb-1 text-sm">
                  {event.awayLogo} {event.awayTeam}
                </div>
                <div className="text-2xl font-bold text-blue-400">{event.awayScore}</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-slate-200 flex items-center justify-center mb-1 text-sm">
                  {event.homeLogo} {event.homeTeam}
                </div>
                <div className="text-2xl font-bold text-blue-400">{event.homeScore}</div>
              </div>
            </div>
          </div>

          {/* Game Details */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-950/30 p-2 rounded-lg border border-slate-800/50">
              <div className="flex items-center mb-1">
                <MapPin className="h-3 w-3 text-blue-500 mr-1" />
                <span className="text-xs font-medium text-slate-300">Venue</span>
              </div>
              <div className="text-xs text-slate-400">{event.venue}</div>
            </div>
            <div className="bg-slate-950/30 p-2 rounded-lg border border-slate-800/50">
              <div className="flex items-center mb-1">
                <Thermometer className="h-3 w-3 text-orange-500 mr-1" />
                <span className="text-xs font-medium text-slate-300">Weather</span>
              </div>
              <div className="text-xs text-slate-400">{event.temperature}</div>
            </div>
          </div>

          {/* AI Analysis */}
          <div className="bg-slate-950/30 p-3 rounded-lg border border-slate-800/50">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-slate-200 flex items-center text-sm">
                <Target className="h-3 w-3 mr-2 text-green-500" />
                AI Prediction Analysis
              </h3>
              <Badge className={`${getConfidenceColor(event.analysis.confidence)} text-xs`}>
                <Zap className="h-2.5 w-2.5 mr-1" />
                {event.analysis.confidence}% Confidence
              </Badge>
            </div>
            <Progress value={event.analysis.confidence} className="h-2 mb-2 bg-slate-800" />
            <div className="text-xs text-slate-300 bg-slate-900/50 p-2 rounded border border-slate-800/50">
              {event.analysis.prediction}
            </div>
            <div className="mt-2 text-xs text-slate-400">
              <strong>Momentum:</strong> {event.analysis.momentum}
            </div>
          </div>

          {/* Live Betting Options */}
          <div>
            <h3 className="font-bold text-slate-200 mb-2 flex items-center text-sm">
              <Target className="h-3 w-3 mr-2 text-purple-500" />
              Live Betting Markets
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-slate-950/30 rounded-lg border border-slate-800/50">
                <span className="font-medium text-slate-300 text-xs">Money Line</span>
                <div className="space-x-2">
                  <Badge className={`text-white text-xs ${getOddsColor(event.moneylineAway)}`}>
                    {event.awayTeam}: {event.moneylineAway}
                  </Badge>
                  <Badge className={`text-white text-xs ${getOddsColor(event.moneylineHome)}`}>
                    {event.homeTeam}: {event.moneylineHome}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-950/30 rounded-lg border border-slate-800/50">
                <span className="font-medium text-slate-300 text-xs">Point Spread</span>
                <Badge className={`text-white text-xs ${getOddsColor(event.spread)}`}>
                  {event.spread}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-950/30 rounded-lg border border-slate-800/50">
                <span className="font-medium text-slate-300 text-xs">Total Points</span>
                <Badge className="text-white bg-gradient-to-r from-purple-400 to-purple-500 text-xs">
                  O/U {event.total}
                </Badge>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <Button 
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2 font-bold transform hover:scale-105 transition-all duration-200 text-sm"
            onClick={() => {
              onPlaceBet(event);
              onClose();
            }}
          >
            <Target className="h-3 w-3 mr-2" />
            Place Your Bet Now
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LiveEventModal;
