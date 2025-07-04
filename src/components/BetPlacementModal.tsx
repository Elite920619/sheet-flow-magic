
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calculator, TrendingUp, Target, DollarSign } from 'lucide-react';
import { useBetIntegration } from '@/hooks/useBetIntegration';
import { useEnhancedCredits } from '@/hooks/useEnhancedCredits';

interface BetPlacementModalProps {
  isOpen: boolean;
  onClose: () => void;
  bet: any;
  onInsufficientFunds?: (amount: number) => void;
}

const BetPlacementModal: React.FC<BetPlacementModalProps> = ({ isOpen, onClose, bet, onInsufficientFunds }) => {
  const [stakeAmount, setStakeAmount] = useState('50');
  const { placeBet, isPlacing } = useBetIntegration();
  const { credits, checkSufficientFunds } = useEnhancedCredits();

  if (!bet) return null;

  const stake = parseFloat(stakeAmount) || 0;
  const oddsValue = parseFloat(bet.odds?.replace('+', '').replace('-', '') || '100');
  const isPositiveOdds = bet.odds?.startsWith('+');
  
  const potentialPayout = isPositiveOdds 
    ? stake + (stake * (oddsValue / 100))
    : stake + (stake / (oddsValue / 100));

  const profit = potentialPayout - stake;

  const handlePlaceBet = async () => {
    // Check sufficient funds before attempting to place the bet
    if (!checkSufficientFunds(stake)) {
      if (onInsufficientFunds) {
        onInsufficientFunds(stake);
        onClose();
        return;
      }
    }

    const success = await placeBet({
      event: bet.event,
      league: bet.league,
      team1: bet.team1,
      team2: bet.team2,
      betType: bet.betType,
      odds: bet.odds,
      stake: stake,
      potentialPayout: potentialPayout,
      sportsbook: bet.sportsbook
    });

    if (success) {
      onClose();
      setStakeAmount('50');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center">
            <Target className="mr-2 h-5 w-5 text-green-600" />
            Place Your Bet
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Bet Details Card */}
          <Card className="bg-muted/20 border-border">
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Game</span>
                  <span className="font-medium text-foreground">{bet.event}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">League</span>
                  <Badge variant="outline" className="text-blue-600 border-blue-600">
                    {bet.league}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Bet Type</span>
                  <span className="font-medium text-foreground">{bet.betType}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Odds</span>
                  <span className="font-bold text-green-600">{bet.odds}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Sportsbook</span>
                  <span className="text-sm text-foreground">{bet.sportsbook}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Analysis */}
          <Card className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 border-purple-600/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">AI Analysis</span>
                <Badge className="bg-purple-600 text-white">
                  {bet.confidence}% Confidence
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Implied Prob:</span>
                  <span className="ml-1 text-foreground">{bet.impliedProb}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">AI Prob:</span>
                  <span className="ml-1 text-green-600 font-medium">{bet.aiProb}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">Value Edge:</span>
                  <span className="ml-1 text-green-600 font-bold">{bet.value}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stake Input */}
          <div className="space-y-2">
            <Label htmlFor="stake" className="text-foreground">Bet Amount ($)</Label>
            <Input
              id="stake"
              type="number"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
              className="text-center text-lg font-bold bg-background border-border text-foreground"
              placeholder="Enter amount"
              min="1"
              max={credits?.balance || 1000}
            />
            <div className="flex gap-2">
              {[25, 50, 100, 250].map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  size="sm"
                  onClick={() => setStakeAmount(amount.toString())}
                  className="flex-1 border-border text-foreground hover:bg-muted"
                >
                  ${amount}
                </Button>
              ))}
            </div>
          </div>

          {/* Payout Calculator */}
          <Card className="bg-muted/10 border-border">
            <CardContent className="p-4">
              <div className="flex items-center mb-3">
                <Calculator className="mr-2 h-4 w-4 text-blue-600" />
                <span className="font-medium text-foreground">Payout Calculator</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Stake:</span>
                  <span className="font-medium text-foreground">${stake.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Potential Profit:</span>
                  <span className="font-medium text-green-600">${profit.toFixed(2)}</span>
                </div>
                <Separator className="bg-border" />
                <div className="flex justify-between text-lg">
                  <span className="font-semibold text-foreground">Total Payout:</span>
                  <span className="font-bold text-green-600">${potentialPayout.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Balance */}
          <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
            <span className="text-sm text-muted-foreground">Current Balance:</span>
            <span className="font-medium text-foreground flex items-center">
              <DollarSign className="h-4 w-4 mr-1" />
              {credits?.balance?.toFixed(2) || '0.00'}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1 border-border text-foreground hover:bg-muted"
              disabled={isPlacing}
            >
              Cancel
            </Button>
            <Button 
              onClick={handlePlaceBet}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              disabled={isPlacing || stake <= 0 || stake > (credits?.balance || 0)}
            >
              {isPlacing ? 'Placing...' : `Place Bet $${stake.toFixed(2)}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BetPlacementModal;
