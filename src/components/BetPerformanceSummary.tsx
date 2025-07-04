
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

interface BetPerformanceSummaryProps {
  totalStaked: number;
  totalProfit: number;
}

const BetPerformanceSummary: React.FC<BetPerformanceSummaryProps> = ({
  totalStaked,
  totalProfit
}) => {
  return (
    <Card className="bg-card/80 border border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center text-gray-900">
          <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
          Performance Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">${totalStaked.toFixed(2)}</div>
            <div className="text-sm text-gray-500">Total Staked</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold mb-1 ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalProfit >= 0 ? '+' : ''}${totalProfit.toFixed(2)}
            </div>
            <div className="text-sm text-gray-500">Net Profit</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {((totalProfit / totalStaked) * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-500">ROI</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BetPerformanceSummary;
