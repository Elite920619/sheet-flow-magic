
import React from 'react';
import Header from '@/components/Header';
import CanvasBackground from '@/components/CanvasBackground';
import WalletDashboard from '@/components/WalletDashboard';
import { Wallet as WalletIcon } from 'lucide-react';

const Wallet = () => {
  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <CanvasBackground />
      <Header />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <WalletIcon className="h-8 w-8 text-blue-500" />
            <h1 className="text-3xl font-bold text-foreground">Wallet</h1>
          </div>
          <p className="text-muted-foreground">
            Manage your funds, deposits, withdrawals, and verification status
          </p>
        </div>
        
        <WalletDashboard />
      </div>
    </div>
  );
};

export default Wallet;
