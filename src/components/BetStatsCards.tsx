
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Target, TrendingUp, Activity, Clock } from 'lucide-react';

interface BetStatsCardsProps {
  totalBets: number;
  totalProfit: number;
  winRate: number;
  pendingBets: number;
}

const BetStatsCards: React.FC<BetStatsCardsProps> = ({
  totalBets,
  totalProfit,
  winRate,
  pendingBets
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card className="bg-card/80 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Bets</p>
              <p className="text-2xl font-bold text-gray-900">{totalBets}</p>
            </div>
            <Target className="h-8 w-8 text-blue-600" />
          </div>
          <Progress value={(totalBets / 10) * 100} className="mt-2 h-2" />
        </CardContent>
      </Card>
      
      <Card className="bg-card/80 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Net Profit</p>
              <p className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${totalProfit.toFixed(2)}
              </p>
            </div>
            <TrendingUp className={`h-8 w-8 ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`} />
          </div>
          <Progress value={Math.min(Math.abs(totalProfit) / 200 * 100, 100)} className="mt-2 h-2" />
        </CardContent>
      </Card>
      
      <Card className="bg-card/80 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Win Rate</p>
              <p className="text-2xl font-bold text-blue-600">{winRate.toFixed(1)}%</p>
            </div>
            <Activity className="h-8 w-8 text-blue-600" />
          </div>
          <Progress value={winRate} className="mt-2 h-2" />
        </CardContent>
      </Card>
      
      <Card className="bg-card/80 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Pending Bets</p>
              <p className="text-2xl font-bold text-amber-600">{pendingBets}</p>
            </div>
            <Clock className="h-8 w-8 text-amber-600" />
          </div>
          <Progress value={(pendingBets / totalBets) * 100} className="mt-2 h-2" />
        </CardContent>
      </Card>
    </div>
  );
};

export default BetStatsCards;
