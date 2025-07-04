
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CreditCard, Wallet } from 'lucide-react';

interface InsufficientFundsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBalance: number;
  requiredAmount: number;
  onDeposit: () => void;
}

const InsufficientFundsModal: React.FC<InsufficientFundsModalProps> = ({
  isOpen,
  onClose,
  currentBalance,
  requiredAmount,
  onDeposit,
}) => {
  const shortfall = requiredAmount - currentBalance;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center text-red-400">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Insufficient Funds
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            You don't have enough funds to place this bet.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-red-500/10 p-4 rounded-lg border border-red-500/20">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Current Balance:</span>
                <span className="font-medium text-foreground">${currentBalance.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Required Amount:</span>
                <span className="font-medium text-foreground">${requiredAmount.toFixed(2)}</span>
              </div>
              <hr className="border-red-500/20" />
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-red-400">Shortfall:</span>
                <span className="font-bold text-red-400">${shortfall.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={onDeposit}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Add Funds
            </Button>
            <Button 
              onClick={onClose}
              variant="outline"
              className="flex-1 border-border text-foreground hover:bg-muted"
            >
              Cancel
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              💡 Tip: Add at least ${shortfall.toFixed(2)} to place this bet
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InsufficientFundsModal;
