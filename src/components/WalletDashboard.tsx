
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CreditCard, 
  Shield, 
  History,
  TrendingUp,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useWallet } from '@/hooks/useWallet';
import { useKYC } from '@/hooks/useKYC';
import DepositModal from './DepositModal';
import WithdrawalModal from './WithdrawalModal';
import KYCModal from './KYCModal';

const WalletDashboard = () => {
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdrawal, setShowWithdrawal] = useState(false);
  const [showKYC, setShowKYC] = useState(false);
  
  const { wallet, transactions, isLoading, deposit, isDepositing, withdraw, isWithdrawing } = useWallet();
  const { kyc } = useKYC();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
      case 'bet_credit':
      case 'bonus':
      case 'refund':
        return <ArrowDownLeft className="h-4 w-4 text-green-500" />;
      case 'withdrawal':
      case 'bet_debit':
        return <ArrowUpRight className="h-4 w-4 text-red-500" />;
      default:
        return <TrendingUp className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'processing': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'failed': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getKYCStatusIcon = () => {
    if (!kyc) return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    
    switch (kyc.kyc_status) {
      case 'verified': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Wallet Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <Wallet className="h-5 w-5 mr-2" />
              Main Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">
              {formatCurrency(wallet?.balance || 0)}
            </div>
            <div className="text-blue-100 text-sm">
              Available for betting and withdrawal
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/95 backdrop-blur-sm border-border">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <Shield className="h-5 w-5 mr-2 text-green-500" />
              Verification Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-2">
              {getKYCStatusIcon()}
              <span className="font-medium capitalize">
                {kyc?.kyc_status || 'Pending'}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              Level {kyc?.verification_level || 1} • Daily limit: {formatCurrency(kyc?.daily_limit || 1000)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/95 backdrop-blur-sm border-border">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <History className="h-5 w-5 mr-2 text-orange-500" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">
              {transactions.length}
            </div>
            <div className="text-sm text-muted-foreground">
              Total transactions this month
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        <Button 
          onClick={() => setShowDeposit(true)}
          className="bg-green-600 hover:bg-green-700"
          disabled={isDepositing}
        >
          <ArrowDownLeft className="h-4 w-4 mr-2" />
          {isDepositing ? 'Processing...' : 'Deposit Funds'}
        </Button>
        
        <Button 
          onClick={() => setShowWithdrawal(true)}
          variant="outline"
          disabled={isWithdrawing || !wallet?.balance}
        >
          <ArrowUpRight className="h-4 w-4 mr-2" />
          {isWithdrawing ? 'Processing...' : 'Withdraw Funds'}
        </Button>
        
        <Button 
          onClick={() => setShowKYC(true)}
          variant="outline"
          className="border-orange-500/50 text-orange-400 hover:bg-orange-500/10"
        >
          <Shield className="h-4 w-4 mr-2" />
          Verify Identity
        </Button>
      </div>

      {/* Transaction History */}
      <Card className="bg-card/95 backdrop-blur-sm border-border">
        <CardHeader>
          <CardTitle className="flex items-center">
            <History className="h-5 w-5 mr-2" />
            Transaction History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <div className="space-y-4">
              {transactions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Wallet className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No transactions yet</p>
                  <p className="text-sm">Start by making your first deposit</p>
                </div>
              ) : (
                transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/50">
                    <div className="flex items-center space-x-3">
                      {getTransactionIcon(transaction.transaction_type)}
                      <div>
                        <div className="font-medium capitalize">
                          {transaction.transaction_type.replace('_', ' ')}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(transaction.created_at).toLocaleDateString()} • 
                          {transaction.description || 'No description'}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold ${
                        ['deposit', 'bet_credit', 'bonus', 'refund'].includes(transaction.transaction_type)
                          ? 'text-green-400' 
                          : 'text-red-400'
                      }`}>
                        {['deposit', 'bet_credit', 'bonus', 'refund'].includes(transaction.transaction_type) ? '+' : '-'}
                        {formatCurrency(Math.abs(transaction.amount))}
                      </div>
                      <Badge className={`text-xs ${getStatusColor(transaction.status)}`}>
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Modals */}
      <DepositModal
        isOpen={showDeposit}
        onClose={() => setShowDeposit(false)}
        onDeposit={(amount) => deposit({ amount, paymentMethod: 'card' })}
        isLoading={isDepositing}
        currentBalance={wallet?.balance || 0}
      />

      <WithdrawalModal
        isOpen={showWithdrawal}
        onClose={() => setShowWithdrawal(false)}
        onWithdraw={withdraw}
        isLoading={isWithdrawing}
        currentBalance={wallet?.balance || 0}
        dailyLimit={kyc?.daily_limit || 1000}
      />

      <KYCModal
        isOpen={showKYC}
        onClose={() => setShowKYC(false)}
        kyc={kyc}
      />
    </div>
  );
};

export default WalletDashboard;
