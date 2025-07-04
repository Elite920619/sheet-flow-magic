
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calculator, TrendingUp, Trophy, Home, Plane, Handshake } from 'lucide-react';
import { useEnhancedCredits } from '@/hooks/useEnhancedCredits';

interface BettingOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: any;
  betType?: string;
  onPlaceBet: (betData: any) => void;
}

const BettingOptionsModal = ({ isOpen, onClose, event, betType, onPlaceBet }: BettingOptionsModalProps) => {
  const [betAmount, setBetAmount] = useState<string>('50');
  const { credits, placeBet, isPlacingBet, checkSufficientFunds } = useEnhancedCredits();

  if (!event) return null;

  // Convert American odds to decimal odds (compensation rate)
  const convertToDecimal = (americanOdds: string) => {
    if (!americanOdds || americanOdds === 'N/A') return 1.00;
    
    const odds = parseFloat(americanOdds.replace(/[+]/g, ''));
    
    if (!odds || odds === 0) return 1.00;
    
    let decimal;
    if (odds > 0) {
      decimal = (odds / 100) + 1;
    } else {
      decimal = (100 / Math.abs(odds)) + 1;
    }
    
    return decimal;
  };

  const getBetDetails = () => {
    switch (betType) {
      case 'home':
        return {
          label: `${event.homeTeam} Win`,
          odds: event.moneylineHome,
          decimalOdds: convertToDecimal(event.moneylineHome),
          icon: <Home className="h-5 w-5" />,
          color: 'bg-blue-500',
          description: 'Home Team Victory'
        };
      case 'away':
        return {
          label: `${event.awayTeam} Win`,
          odds: event.moneylineAway,
          decimalOdds: convertToDecimal(event.moneylineAway),
          icon: <Plane className="h-5 w-5" />,
          color: 'bg-green-500',
          description: 'Away Team Victory'
        };
      case 'draw':
        return {
          label: 'Draw',
          odds: event.moneylineDraw || '+250',
          decimalOdds: convertToDecimal(event.moneylineDraw || '+250'),
          icon: <Handshake className="h-5 w-5" />,
          color: 'bg-orange-500',
          description: 'Match Ends in Draw'
        };
      default:
        return null;
    }
  };

  const betDetails = getBetDetails();
  if (!betDetails) return null;

  const calculatePotentialWin = (decimalOdds: number, amount: number) => {
    if (!decimalOdds || !amount || decimalOdds <= 0) return 0;
    return amount * (decimalOdds - 1);
  };

  const handlePlaceBet = async () => {
    const amount = parseFloat(betAmount);
    
    if (!checkSufficientFunds(amount)) {
      // The insufficient funds modal will be handled by the parent component
      onPlaceBet({
        event: `${event.awayTeam} @ ${event.homeTeam}`,
        type: 'Moneyline',
        selection: betDetails.label,
        odds: betDetails.odds,
        stake: amount,
        potentialWin: calculatePotentialWin(betDetails.decimalOdds, amount),
        totalReturn: amount + calculatePotentialWin(betDetails.decimalOdds, amount),
        league: event.league,
        region: event.region,
        insufficientFunds: true
      });
      return;
    }

    try {
      await placeBet({
        eventName: `${event.awayTeam} @ ${event.homeTeam}`,
        betType: 'Moneyline',
        odds: betDetails.odds,
        stake: amount,
        league: event.league,
        teams: `${event.awayTeam} vs ${event.homeTeam}`,
        sportsbook: 'SportsBet AI'
      });
      
      onClose();
      setBetAmount('50');
    } catch (error) {
      console.error('Error placing bet:', error);
    }
  };

  const betAmountNum = parseFloat(betAmount) || 0;
  const potentialWin = calculatePotentialWin(betDetails.decimalOdds, betAmountNum);
  const totalReturn = betAmountNum + potentialWin;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-1x1">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Place Your Bet
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {/* Event Info */}
          <Card className="bg-blur/80">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    {event.awayTeam}
                    <span className="text-muted-foreground">vs</span>
                    {event.homeTeam}
                  </h3>
                  <p className="text-sm text-gray-600">{event.league} • {event.region}</p>
                </div>
                <Badge className="bg-green-500 text-white">
                  {event.timeLeft}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Selected Bet Details */}
          <Card className="bg-blur/80">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Selected Bet
                </h2>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${betDetails.color} text-white`}>
                    {betDetails.icon}
                  </div>
                  <div>
                    <div className="font-medium">{betDetails.label}</div>
                    <div className="text-sm text-muted-foreground">{betDetails.description}</div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={`${betDetails.color} text-white mb-1`}>
                    {betDetails.decimalOdds.toFixed(2)}x
                  </Badge>
                  <div className="text-xs text-muted-foreground">
                    ({betDetails.odds})
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bet Amount Input */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-800 flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Enter Bet Amount
            </h4>
            <div className="space-y-3">
              <Input
                type="number"
                placeholder="Enter amount..."
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                className="text-lg"
              />
              
              {/* Quick Amount Buttons */}
              <div className="flex gap-2">
                {[10, 25, 50, 100].map((amount) => (
                  <Button
                    key={amount}
                    variant="outline"
                    size="sm"
                    onClick={() => setBetAmount(amount.toString())}
                  >
                    ${amount}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Bet Summary */}
          {betAmountNum > 0 && (
            <Card className=" bg-blur/80">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-3">Bet Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Selection:</span>
                    <span className="font-medium">{betDetails.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Compensation Rate:</span>
                    <span className="font-medium">{betDetails.decimalOdds.toFixed(2)}x</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Stake:</span>
                    <span className="font-medium">${betAmountNum.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Potential Win:</span>
                    <span className="font-medium text-green-600">${potentialWin.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-semibold">Total Return:</span>
                    <span className="font-bold text-green-600">${totalReturn.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Current Balance */}
          <div className="flex items-center justify-between p-3  bg-blur/80 rounded-lg border-border">
            <span className="text-sm text-gray-600">Current Balance:</span>
            <span className="font-medium">${credits?.balance?.toFixed(2) || '0.00'}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handlePlaceBet}
              disabled={isPlacingBet || !betAmount || betAmountNum <= 0}
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
            >
              {isPlacingBet ? 'Placing...' : `Place Bet $${betAmountNum.toFixed(2)}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BettingOptionsModal;
