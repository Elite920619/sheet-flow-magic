
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, TrendingUp, Target, DollarSign } from 'lucide-react';

interface BetCardProps {
  bet: {
    id: string; // Changed from number to string to match UUID
    event: string;
    betType: string;
    odds: string;
    stake: number;
    potentialPayout: number;
    actualPayout: number | null;
    status: string;
    placedAt: string;
    settledAt: string | null;
    league: string;
    sport: string;
    confidence: number;
    aiRecommended: boolean;
    profit?: number;
    timeLeft?: string;
    teams?: string;
  };
}

const BetCard: React.FC<BetCardProps> = ({ bet }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'won':
        return {
          icon: <CheckCircle className="h-3 w-3" />,
          color: 'bg-gradient-to-r from-green-400 to-green-500',
          textColor: 'text-green-600',
          bgColor: 'bg-gradient-to-br from-green-50 to-green-100'
        };
      case 'lost':
        return {
          icon: <XCircle className="h-3 w-3" />,
          color: 'bg-gradient-to-r from-red-400 to-red-500',
          textColor: 'text-red-600',
          bgColor: 'bg-gradient-to-br from-red-50 to-red-100'
        };
      case 'pending':
        return {
          icon: <Clock className="h-3 w-3" />,
          color: 'bg-gradient-to-r from-orange-400 to-orange-500',
          textColor: 'text-orange-600',
          bgColor: 'bg-gradient-to-br from-orange-50 to-orange-100'
        };
      default:
        return {
          icon: <Clock className="h-3 w-3" />,
          color: 'bg-gradient-to-r from-blue-400 to-blue-500',
          textColor: 'text-blue-600',
          bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100'
        };
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'bg-gradient-to-r from-green-400 to-green-500';
    if (confidence >= 70) return 'bg-gradient-to-r from-blue-400 to-blue-500';
    if (confidence >= 60) return 'bg-gradient-to-r from-orange-400 to-orange-500';
    return 'bg-gradient-to-r from-red-400 to-red-500';
  };

  const statusConfig = getStatusConfig(bet.status);

  return (
    <Card className={`${statusConfig.bgColor} border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden cursor-pointer`}>
      {/* Status indicator bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${statusConfig.color}`}></div>
      
      <CardContent className="p-3">
        <div className="space-y-2">
          {/* Header */}
          <div className="flex items-center justify-between">
            <Badge className="bg-gradient-to-r from-blue-400 to-blue-500 text-white text-xs px-2 py-0.5">
              {bet.league}
            </Badge>
            <Badge className={`${statusConfig.color} text-white text-xs px-2 py-0.5`}>
              <div className="flex items-center space-x-1">
                {statusConfig.icon}
                <span className="capitalize">{bet.status}</span>
              </div>
            </Badge>
          </div>

          {/* Event */}
          <div>
            <h3 className="font-bold text-gray-800 text-sm mb-1 truncate">
              {bet.event}
            </h3>
            <p className="text-gray-600 text-xs">{bet.betType}</p>
          </div>

          {/* Core Metrics */}
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">Odds</div>
              <Badge className="bg-gradient-to-r from-purple-400 to-purple-500 text-white text-xs px-1.5 py-0.5">
                {bet.odds}
              </Badge>
            </div>
            
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">Stake</div>
              <div className="text-gray-800 font-bold text-sm">${bet.stake}</div>
            </div>
            
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">Conf.</div>
              <Badge className={`${getConfidenceColor(bet.confidence)} text-white text-xs px-1.5 py-0.5`}>
                {bet.confidence}%
              </Badge>
            </div>
          </div>

          {/* Profit/Loss or Potential */}
          <div className="text-center p-2 bg-card/80/60 rounded-lg">
            {bet.status !== 'pending' ? (
              <>
                <div className="text-xs text-gray-500 mb-1">Profit/Loss</div>
                <div className={`font-bold text-sm ${(bet.profit || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {(bet.profit || 0) >= 0 ? '+' : ''}${(bet.profit || 0).toFixed(2)}
                </div>
              </>
            ) : (
              <>
                <div className="text-xs text-gray-500 mb-1">Potential</div>
                <div className="text-blue-600 font-bold text-sm">${bet.potentialPayout.toFixed(2)}</div>
              </>
            )}
          </div>

          {/* Live indicator for pending bets */}
          {bet.status === 'pending' && bet.timeLeft && (
            <div className="flex items-center justify-center space-x-2 text-orange-600">
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium">Live - {bet.timeLeft}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BetCard;
