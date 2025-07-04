
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, DollarSign } from 'lucide-react';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeposit: (amount: number) => void;
  isLoading: boolean;
  currentBalance: number;
}

const DepositModal: React.FC<DepositModalProps> = ({
  isOpen,
  onClose,
  onDeposit,
  isLoading,
  currentBalance,
}) => {
  const [amount, setAmount] = useState<string>('');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

  const quickAmounts = [25, 50, 100, 250, 500, 1000];

  const handleQuickAmount = (value: number) => {
    setAmount(value.toString());
    setSelectedAmount(value);
  };

  const handleDeposit = () => {
    const depositAmount = parseFloat(amount);
    if (depositAmount > 0) {
      onDeposit(depositAmount);
      setAmount('');
      setSelectedAmount(null);
    }
  };

  const handleInputChange = (value: string) => {
    setAmount(value);
    setSelectedAmount(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-green-600">
            <CreditCard className="h-5 w-5 mr-2" />
            Add Funds to Account
          </DialogTitle>
          <DialogDescription>
            Current balance: ${currentBalance.toFixed(2)}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Quick Amount Buttons */}
          <div>
            <Label className="text-sm font-medium mb-3">Quick Amounts</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {quickAmounts.map((value) => (
                <Button
                  key={value}
                  variant={selectedAmount === value ? "default" : "outline"}
                  onClick={() => handleQuickAmount(value)}
                  className="text-sm"
                >
                  ${value}
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount">Custom Amount</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => handleInputChange(e.target.value)}
                className="pl-10"
                min="1"
                step="0.01"
              />
            </div>
          </div>

          {/* Preview */}
          {amount && parseFloat(amount) > 0 && (
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Deposit Amount:</span>
                  <span className="font-medium">${parseFloat(amount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">New Balance:</span>
                  <span className="font-bold text-green-600">
                    ${(currentBalance + parseFloat(amount)).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={handleDeposit}
              disabled={!amount || parseFloat(amount) <= 0 || isLoading}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {isLoading ? "Processing..." : "Add Funds"}
            </Button>
            <Button 
              onClick={onClose}
              variant="outline"
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              🔒 Your payment information is secure and encrypted
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DepositModal;
