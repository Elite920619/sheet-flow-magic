
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
    <div className="min-h-screen bg-background text-foreground relative">
      <CanvasBackground />
      <Header />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center">
            <TrendingUp className="mr-3 h-8 w-8 text-blue-600" />
            Advanced Analytics Dashboard
          </h1>
          <p className="text-muted-foreground">Comprehensive analysis of your betting performance and winning strategies</p>
        </div>

        {/* Enhanced KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card/80 backdrop-blur-sm border-border hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Total Profit</p>
                  <p className="text-3xl font-bold text-green-600">${totalProfit.toLocaleString()}</p>
                  <p className="text-xs text-green-600 mt-1">+12.3% this month</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/80 backdrop-blur-sm border-border hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Win Rate</p>
                  <p className="text-3xl font-bold text-blue-600">{avgWinRate.toFixed(1)}%</p>
                  <p className="text-xs text-blue-600 mt-1">Above industry avg</p>
                </div>
                <Target className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/80 backdrop-blur-sm border-border hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Total Bets</p>
                  <p className="text-3xl font-bold text-purple-600">{totalBets}</p>
                  <p className="text-xs text-purple-600 mt-1">Through October</p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/80 backdrop-blur-sm border-border hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">ROI</p>
                  <p className="text-3xl font-bold text-yellow-600">{((totalProfit / totalStaked) * 100).toFixed(1)}%</p>
                  <p className="text-xs text-yellow-600 mt-1">Excellent performance</p>
                </div>
                <Percent className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Winning Bets Analysis */}
        <Card className="mb-8 bg-card/80 backdrop-blur-sm border-border">
          <CardHeader>
            <CardTitle className="flex items-center text-foreground">
              <Trophy className="mr-2 h-5 w-5 text-yellow-600" />
              Winning Bets Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-2 text-foreground">Category</th>
                    <th className="text-left p-2 text-foreground">Record</th>
                    <th className="text-left p-2 text-foreground">Win Rate</th>
                    <th className="text-left p-2 text-foreground">Profit</th>
                    <th className="text-left p-2 text-foreground">Avg Odds</th>
                    <th className="text-left p-2 text-foreground">ROI</th>
                  </tr>
                </thead>
                <tbody>
                  {winningBetsAnalysis.map((category, index) => (
                    <tr key={index} className="border-b border-border/50 hover:bg-muted/20">
                      <td className="p-3 font-medium text-foreground">{category.category}</td>
                      <td className="p-3 text-foreground">{category.wins}-{category.total - category.wins}</td>
                      <td className="p-3">
                        <span className="text-green-600 font-medium">
                          {((category.wins / category.total) * 100).toFixed(1)}%
                        </span>
                      </td>
                      <td className="p-3 text-green-600 font-medium">${category.profit}</td>
                      <td className="p-3 text-foreground">{category.avgOdds}</td>
                      <td className="p-3 text-blue-600 font-medium">{category.roi}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Charts in Column Format - One per line */}
        <div className="space-y-8">
          {/* Profit & Performance Over Time */}
          <Card className="bg-card/80 backdrop-blur-sm border-border">
            <CardHeader>
              <CardTitle className="text-foreground">AI Model Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="w-full h-80">
                <AreaChart data={profitData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))" 
                    tickFormatter={(value) => value.split('-')[1]}
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area 
                    type="monotone" 
                    dataKey="profit" 
                    stroke="#10B981" 
                    fill="#10B981" 
                    fillOpacity={0.3}
                    strokeWidth={3}
                    connectNulls={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="winRate" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                    connectNulls={false}
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Sport Performance Distribution */}
          <Card className="bg-card/80 backdrop-blur-sm border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Profit Generation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-80 flex items-center justify-center">
                  <ChartContainer config={chartConfig} className="w-full h-full">
                    <PieChart>
                      <Pie
                        data={sportDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        innerRadius={40}
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
                <div className="space-y-3">
                  {sportDistribution.map((sport, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: sport.color }}></div>
                        <span className="ml-2 font-medium text-foreground">{sport.sport}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-green-600 font-medium">${sport.profit}</div>
                        <div className="text-xs text-muted-foreground">{sport.bets} bets</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Breakdown */}
          <Card className="bg-card/80 backdrop-blur-sm border-border">
            <CardHeader>
              <CardTitle className="flex items-center text-foreground">
                <Calendar className="mr-2 h-5 w-5 text-blue-600" />
                Monthly Performance Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="w-full h-80">
                <BarChart data={monthlyBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="totalStaked" fill="#8B5CF6" name="Staked" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="totalWon" fill="#10B981" name="Won" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Performance Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="bg-card/80 backdrop-blur-sm border-border">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">
                {winningBetsAnalysis.reduce((sum, cat) => sum + cat.wins, 0)}
              </div>
              <div className="text-muted-foreground text-sm mb-2">Total Winning Bets</div>
              <div className="text-xs text-green-600">
                {((winningBetsAnalysis.reduce((sum, cat) => sum + cat.wins, 0) / 
                   winningBetsAnalysis.reduce((sum, cat) => sum + cat.total, 0)) * 100).toFixed(1)}% Success Rate
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/80 backdrop-blur-sm border-border">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">
                ${winningBetsAnalysis.reduce((sum, cat) => sum + cat.profit, 0).toLocaleString()}
              </div>
              <div className="text-muted-foreground text-sm mb-2">Total Category Profit</div>
              <div className="text-xs text-blue-600">Across all winning categories</div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/80 backdrop-blur-sm border-border">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-purple-600 mb-2">
                {(winningBetsAnalysis.reduce((sum, cat) => sum + cat.roi, 0) / winningBetsAnalysis.length).toFixed(1)}%
              </div>
              <div className="text-muted-foreground text-sm mb-2">Average ROI</div>
              <div className="text-xs text-purple-600">Across winning categories</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
