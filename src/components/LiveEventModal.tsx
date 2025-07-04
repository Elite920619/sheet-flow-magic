
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
      <DialogContent className="bg-card/80 border-gray-200 max-w-2xl max-h-[85vh] overflow-y-auto animate-scale-in">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge className="bg-gradient-to-r from-blue-400 to-blue-500 text-white">
                {event.league}
              </Badge>
              <Badge className="bg-gradient-to-r from-green-400 to-green-500 text-white animate-pulse">
                <Activity className="h-3 w-3 mr-1" />
                Live
              </Badge>
            </div>
            <div className="flex items-center space-x-3 text-gray-600 text-sm">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {event.timeLeft}
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                {event.attendance}
              </div>
            </div>
          </div>
          <DialogTitle className="text-xl font-bold text-gray-800 flex items-center mt-2">
            <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
            {event.awayTeam} vs {event.homeTeam}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Live betting opportunities with AI-powered analysis
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Live Score */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-800 flex items-center">
                <BarChart3 className="h-4 w-4 mr-2 text-blue-500" />
                Live Score
              </h3>
              <Badge className="bg-blue-100 text-blue-700">
                {event.quarter || 'Final'}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="font-bold text-gray-800 flex items-center justify-center mb-1">
                  {event.awayLogo} {event.awayTeam}
                </div>
                <div className="text-3xl font-bold text-blue-600">{event.awayScore}</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-gray-800 flex items-center justify-center mb-1">
                  {event.homeLogo} {event.homeTeam}
                </div>
                <div className="text-3xl font-bold text-blue-600">{event.homeScore}</div>
              </div>
            </div>
          </div>

          {/* Game Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center mb-2">
                <MapPin className="h-4 w-4 text-blue-500 mr-1" />
                <span className="text-sm font-medium text-gray-700">Venue</span>
              </div>
              <div className="text-sm text-gray-600">{event.venue}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center mb-2">
                <Thermometer className="h-4 w-4 text-orange-500 mr-1" />
                <span className="text-sm font-medium text-gray-700">Weather</span>
              </div>
              <div className="text-sm text-gray-600">{event.temperature}</div>
            </div>
          </div>

          {/* AI Analysis */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-800 flex items-center">
                <Target className="h-4 w-4 mr-2 text-green-500" />
                AI Prediction Analysis
              </h3>
              <Badge className={`${getConfidenceColor(event.analysis.confidence)}`}>
                <Zap className="h-3 w-3 mr-1" />
                {event.analysis.confidence}% Confidence
              </Badge>
            </div>
            <Progress value={event.analysis.confidence} className="h-3 mb-3" />
            <div className="text-sm text-gray-700 bg-card/80 p-3 rounded border">
              {event.analysis.prediction}
            </div>
            <div className="mt-3 text-sm text-gray-600">
              <strong>Momentum:</strong> {event.analysis.momentum}
            </div>
          </div>

          {/* Live Betting Options */}
          <div>
            <h3 className="font-bold text-gray-800 mb-3 flex items-center">
              <Target className="h-4 w-4 mr-2 text-purple-500" />
              Live Betting Markets
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Money Line</span>
                <div className="space-x-2">
                  <Badge className={`text-white ${getOddsColor(event.moneylineAway)}`}>
                    {event.awayTeam}: {event.moneylineAway}
                  </Badge>
                  <Badge className={`text-white ${getOddsColor(event.moneylineHome)}`}>
                    {event.homeTeam}: {event.moneylineHome}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Point Spread</span>
                <Badge className={`text-white ${getOddsColor(event.spread)}`}>
                  {event.spread}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Total Points</span>
                <Badge className="text-white bg-gradient-to-r from-purple-400 to-purple-500">
                  O/U {event.total}
                </Badge>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <Button 
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 font-bold transform hover:scale-105 transition-all duration-200"
            onClick={() => {
              onPlaceBet(event);
              onClose();
            }}
          >
            <Target className="h-4 w-4 mr-2" />
            Place Your Bet Now
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LiveEventModal;
