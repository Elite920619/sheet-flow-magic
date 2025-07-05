
import React from 'react';
import Header from '@/components/Header';
import CanvasBackground from '@/components/CanvasBackground';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Target, Trophy, Calendar, Percent, BarChart3, Activity } from 'lucide-react';

const Analytics = () => {
  // Extended data through December with current values only up to October
  const profitData = [
    { date: '2024-01', profit: 120, bets: 45, winRate: 68, roi: 8.5 },
    { date: '2024-02', profit: 340, bets: 52, winRate: 72, roi: 12.3 },
    { date: '2024-03', profit: -80, bets: 38, winRate: 45, roi: -4.2 },
    { date: '2024-04', profit: 580, bets: 67, winRate: 78, roi: 18.7 },
    { date: '2024-05', profit: 220, bets: 41, winRate: 65, roi: 9.8 },
    { date: '2024-06', profit: 750, bets: 73, winRate: 82, roi: 22.4 },
    { date: '2024-07', profit: 890, bets: 89, winRate: 79, roi: 24.1 },
    { date: '2024-08', profit: 1240, bets: 102, winRate: 85, roi: 28.3 },
    { date: '2024-09', profit: 980, bets: 87, winRate: 74, roi: 21.7 },
    { date: '2024-10', profit: 1450, bets: 115, winRate: 87, roi: 31.2 },
    { date: '2024-11', profit: null, bets: null, winRate: null, roi: null },
    { date: '2024-12', profit: null, bets: null, winRate: null, roi: null },
  ];

  const winningBetsAnalysis = [
    { category: 'NFL Spreads', wins: 45, total: 68, profit: 1250, avgOdds: '+110', roi: 18.4 },
    { category: 'NBA Totals', wins: 38, total: 52, profit: 890, avgOdds: '-105', roi: 22.1 },
    { category: 'Soccer ML', wins: 29, total: 41, profit: 650, avgOdds: '+140', roi: 15.8 },
    { category: 'MLB O/U', wins: 33, total: 47, profit: 720, avgOdds: '-110', roi: 19.3 },
    { category: 'NHL Puck Line', wins: 22, total: 35, profit: 480, avgOdds: '+125', roi: 16.7 }
  ];

  // Extended monthly breakdown through December with current data only up to October
  const monthlyBreakdown = [
    { month: 'Jan', totalStaked: 2500, totalWon: 2620, netProfit: 120, winningBets: 31, totalBets: 45 },
    { month: 'Feb', totalStaked: 3200, totalWon: 3540, netProfit: 340, winningBets: 37, totalBets: 52 },
    { month: 'Mar', totalStaked: 2800, totalWon: 2720, netProfit: -80, winningBets: 17, totalBets: 38 },
    { month: 'Apr', totalStaked: 4100, totalWon: 4680, netProfit: 580, winningBets: 52, totalBets: 67 },
    { month: 'May', totalStaked: 2900, totalWon: 3120, netProfit: 220, winningBets: 27, totalBets: 41 },
    { month: 'Jun', totalStaked: 4500, totalWon: 5250, netProfit: 750, winningBets: 60, totalBets: 73 },
    { month: 'Jul', totalStaked: 5100, totalWon: 5990, netProfit: 890, winningBets: 70, totalBets: 89 },
    { month: 'Aug', totalStaked: 4800, totalWon: 6040, netProfit: 1240, winningBets: 87, totalBets: 102 },
    { month: 'Sep', totalStaked: 4200, totalWon: 5180, netProfit: 980, winningBets: 64, totalBets: 87 },
    { month: 'Oct', totalStaked: 5500, totalWon: 6950, netProfit: 1450, winningBets: 100, totalBets: 115 },
    { month: 'Nov', totalStaked: null, totalWon: null, netProfit: null, winningBets: null, totalBets: null },
    { month: 'Dec', totalStaked: null, totalWon: null, netProfit: null, winningBets: null, totalBets: null },
  ];

  const sportDistribution = [
    { sport: 'NBA', value: 35, color: '#3B82F6', profit: 1240, bets: 89 },
    { sport: 'NFL', value: 25, color: '#10B981', profit: 980, bets: 67 },
    { sport: 'MLB', value: 20, color: '#F59E0B', profit: 720, bets: 54 },
    { sport: 'NHL', value: 15, color: '#8B5CF6', profit: 480, bets: 35 },
    { sport: 'Other', value: 5, color: '#6B7280', profit: 180, bets: 12 },
  ];

  const chartConfig = {
    profit: { label: "Profit", color: "hsl(var(--chart-1))" },
    bets: { label: "Bets", color: "hsl(var(--chart-2))" },
    winRate: { label: "Win Rate", color: "hsl(var(--chart-3))" },
    roi: { label: "ROI", color: "hsl(var(--chart-4))" }
  };

  // Calculate totals only from available data (up to October)
  const totalProfit = profitData.filter(d => d.profit !== null).reduce((sum, month) => sum + month.profit, 0);
  const totalBets = profitData.filter(d => d.bets !== null).reduce((sum, month) => sum + month.bets, 0);
  const avgWinRate = profitData.filter(d => d.winRate !== null).reduce((sum, month) => sum + month.winRate, 0) / profitData.filter(d => d.winRate !== null).length;
  const totalStaked = monthlyBreakdown.filter(d => d.totalStaked !== null).reduce((sum, month) => sum + month.totalStaked, 0);

  return (
    <div className="min-h-screen bg-transparent text-foreground relative">
      <CanvasBackground />
      <Header />
      
      <div className="relative z-10 max-w-12xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-200 mb-2 flex items-center">
            <TrendingUp className="mr-2 h-6 w-6 text-blue-400" />
            Advanced Analytics Dashboard
          </h1>
        </div>

        {/* Enhanced KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50 hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-xs">Total Profit</p>
                  <p className="text-2xl font-bold text-green-400">${totalProfit.toLocaleString()}</p>
                  <p className="text-xs text-green-400 mt-1">+12.3% this month</p>
                </div>
                <TrendingUp className="h-6 w-6 text-green-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50 hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-xs">Win Rate</p>
                  <p className="text-2xl font-bold text-blue-400">{avgWinRate.toFixed(1)}%</p>
                  <p className="text-xs text-blue-400 mt-1">Above industry avg</p>
                </div>
                <Target className="h-6 w-6 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50 hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-xs">Total Bets</p>
                  <p className="text-2xl font-bold text-purple-400">{totalBets}</p>
                  <p className="text-xs text-purple-400 mt-1">Through October</p>
                </div>
                <BarChart3 className="h-6 w-6 text-purple-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50 hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-xs">ROI</p>
                  <p className="text-2xl font-bold text-yellow-400">{((totalProfit / totalStaked) * 100).toFixed(1)}%</p>
                  <p className="text-xs text-yellow-400 mt-1">Excellent performance</p>
                </div>
                <Percent className="h-6 w-6 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Winning Bets Analysis */}
        <Card className="mb-6 bg-slate-900/50 backdrop-blur-sm border-slate-800/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-slate-200 text-base">
              <Trophy className="mr-2 h-4 w-4 text-yellow-400" />
              Winning Bets Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700/50">
                    <th className="text-left p-2 text-slate-200 text-xs">Category</th>
                    <th className="text-left p-2 text-slate-200 text-xs">Record</th>
                    <th className="text-left p-2 text-slate-200 text-xs">Win Rate</th>
                    <th className="text-left p-2 text-slate-200 text-xs">Profit</th>
                    <th className="text-left p-2 text-slate-200 text-xs">Avg Odds</th>
                    <th className="text-left p-2 text-slate-200 text-xs">ROI</th>
                  </tr>
                </thead>
                <tbody>
                  {winningBetsAnalysis.map((category, index) => (
                    <tr key={index} className="border-b border-slate-700/30 hover:bg-slate-800/20">
                      <td className="p-2 font-medium text-slate-200 text-xs">{category.category}</td>
                      <td className="p-2 text-slate-300 text-xs">{category.wins}-{category.total - category.wins}</td>
                      <td className="p-2">
                        <span className="text-green-400 font-medium text-xs">
                          {((category.wins / category.total) * 100).toFixed(1)}%
                        </span>
                      </td>
                      <td className="p-2 text-green-400 font-medium text-xs">${category.profit}</td>
                      <td className="p-2 text-slate-300 text-xs">{category.avgOdds}</td>
                      <td className="p-2 text-blue-400 font-medium text-xs">{category.roi}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Charts in Column Format - One per line */}
        <div className="space-y-6">
          {/* AI Model Performance */}
          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-slate-200 text-base">AI Model Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="w-full h-64">
                <AreaChart data={profitData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#94a3b8" 
                    tickFormatter={(value) => value.split('-')[1]}
                    fontSize={11}
                  />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area 
                    type="monotone" 
                    dataKey="profit" 
                    stroke="#10B981" 
                    fill="#10B981" 
                    fillOpacity={0.3}
                    strokeWidth={2}
                    connectNulls={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="winRate" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 3 }}
                    connectNulls={false}
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Sport Performance Distribution */}
          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-slate-200 text-base">Profit Generation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-64 flex items-center justify-center">
                  <ChartContainer config={chartConfig} className="w-full h-full">
                    <PieChart>
                      <Pie
                        data={sportDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        innerRadius={30}
                        dataKey="profit"
                        label={({ sport, profit }) => `${sport}: $${profit}`}
                        labelLine={false}
                      >
                        {sportDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ChartContainer>
                </div>
                <div className="space-y-2">
                  {sportDistribution.map((sport, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-slate-800/20 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded" style={{ backgroundColor: sport.color }}></div>
                        <span className="ml-2 font-medium text-slate-200 text-xs">{sport.sport}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-green-400 font-medium text-xs">${sport.profit}</div>
                        <div className="text-xs text-slate-400">{sport.bets} bets</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Breakdown */}
          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-slate-200 text-base">
                <Calendar className="mr-2 h-4 w-4 text-blue-400" />
                Monthly Performance Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="w-full h-64">
                <BarChart data={monthlyBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="totalStaked" fill="#8B5CF6" name="Staked" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="totalWon" fill="#10B981" name="Won" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Performance Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50">
            <CardContent className="p-4 text-center">
              <div className="text-xl font-bold text-green-400 mb-2">
                {winningBetsAnalysis.reduce((sum, cat) => sum + cat.wins, 0)}
              </div>
              <div className="text-slate-400 text-xs mb-2">Total Winning Bets</div>
              <div className="text-xs text-green-400">
                {((winningBetsAnalysis.reduce((sum, cat) => sum + cat.wins, 0) / 
                   winningBetsAnalysis.reduce((sum, cat) => sum + cat.total, 0)) * 100).toFixed(1)}% Success Rate
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50">
            <CardContent className="p-4 text-center">
              <div className="text-xl font-bold text-blue-400 mb-2">
                ${winningBetsAnalysis.reduce((sum, cat) => sum + cat.profit, 0).toLocaleString()}
              </div>
              <div className="text-slate-400 text-xs mb-2">Total Category Profit</div>
              <div className="text-xs text-blue-400">Across all winning categories</div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50">
            <CardContent className="p-4 text-center">
              <div className="text-xl font-bold text-purple-400 mb-2">
                {(winningBetsAnalysis.reduce((sum, cat) => sum + cat.roi, 0) / winningBetsAnalysis.length).toFixed(1)}%
              </div>
              <div className="text-slate-400 text-xs mb-2">Average ROI</div>
              <div className="text-xs text-purple-400">Across winning categories</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
