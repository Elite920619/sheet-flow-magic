
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUpRight, DollarSign, AlertTriangle } from 'lucide-react';

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWithdraw: (data: { amount: number; method: string; destination: any }) => void;
  isLoading: boolean;
  currentBalance: number;
  dailyLimit: number;
}

const WithdrawalModal: React.FC<WithdrawalModalProps> = ({
  isOpen,
  onClose,
  onWithdraw,
  isLoading,
  currentBalance,
  dailyLimit,
}) => {
  const [amount, setAmount] = useState<string>('');
  const [method, setMethod] = useState<string>('');
  const [bankAccount, setBankAccount] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [paypalEmail, setPaypalEmail] = useState('');

  const maxWithdrawal = Math.min(currentBalance, dailyLimit);

  const handleWithdraw = () => {
    const withdrawalAmount = parseFloat(amount);
    if (withdrawalAmount <= 0 || withdrawalAmount > maxWithdrawal) return;

    let destination = {};
    
    switch (method) {
      case 'bank_transfer':
        destination = { bankAccount, routingNumber };
        break;
      case 'paypal':
        destination = { paypalEmail };
        break;
    }

    onWithdraw({ amount: withdrawalAmount, method, destination });
    setAmount('');
    setMethod('');
    setBankAccount('');
    setRoutingNumber('');
    setPaypalEmail('');
  };

  const isValidAmount = amount && parseFloat(amount) > 0 && parseFloat(amount) <= maxWithdrawal;
  const isValidDestination = method === 'bank_transfer' ? bankAccount && routingNumber : 
                            method === 'paypal' ? paypalEmail : false;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-orange-600">
            <ArrowUpRight className="h-5 w-5 mr-2" />
            Withdraw Funds
          </DialogTitle>
          <DialogDescription>
            Current balance: ${currentBalance.toFixed(2)} • Daily limit: ${dailyLimit.toFixed(2)}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount">Withdrawal Amount</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-10"
                min="1"
                max={maxWithdrawal}
                step="0.01"
              />
            </div>
            <div className="text-xs text-muted-foreground">
              Maximum withdrawal: ${maxWithdrawal.toFixed(2)}
            </div>
          </div>

          {/* Withdrawal Method */}
          <div className="space-y-2">
            <Label>Withdrawal Method</Label>
            <Select value={method} onValueChange={setMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Select withdrawal method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                <SelectItem value="paypal">PayPal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bank Transfer Details */}
          {method === 'bank_transfer' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bankAccount">Bank Account Number</Label>
                <Input
                  id="bankAccount"
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value)}
                  placeholder="Enter account number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="routingNumber">Routing Number</Label>
                <Input
                  id="routingNumber"
                  value={routingNumber}
                  onChange={(e) => setRoutingNumber(e.target.value)}
                  placeholder="Enter routing number"
                />
              </div>
            </div>
          )}

          {/* PayPal Details */}
          {method === 'paypal' && (
            <div className="space-y-2">
              <Label htmlFor="paypalEmail">PayPal Email</Label>
              <Input
                id="paypalEmail"
                type="email"
                value={paypalEmail}
                onChange={(e) => setPaypalEmail(e.target.value)}
                placeholder="Enter PayPal email"
              />
            </div>
          )}

          {/* Preview */}
          {amount && parseFloat(amount) > 0 && (
            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Withdrawal Amount:</span>
                  <span className="font-medium">${parseFloat(amount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Processing Fee:</span>
                  <span className="font-medium">$0.00</span>
                </div>
                <div className="flex justify-between items-center border-t pt-2">
                  <span className="text-sm text-muted-foreground">You'll Receive:</span>
                  <span className="font-bold text-orange-600">
                    ${parseFloat(amount).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Warning */}
          <div className="flex items-start space-x-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
            <div className="text-sm text-yellow-800 dark:text-yellow-200">
              Withdrawal requests are processed within 1-3 business days. 
              Make sure your account details are correct.
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={handleWithdraw}
              disabled={!isValidAmount || !isValidDestination || isLoading}
              className="flex-1 bg-orange-600 hover:bg-orange-700"
            >
              {isLoading ? "Processing..." : "Request Withdrawal"}
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawalModal;
