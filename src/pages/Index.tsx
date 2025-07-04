import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Activity, DollarSign, Target, Zap, Users, Trophy, Bell, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import CanvasBackground from '@/components/CanvasBackground';

const Dashboard = () => {
  // Extended performance data through December
  const performanceData = [
    { month: 'Jan', profit: 250, bets: 15, winRate: 67 },
    { month: 'Feb', profit: 420, bets: 22, winRate: 73 },
    { month: 'Mar', profit: 180, bets: 18, winRate: 61 },
    { month: 'Apr', profit: 650, bets: 28, winRate: 79 },
    { month: 'May', profit: 380, bets: 24, winRate: 71 },
    { month: 'Jun', profit: 890, bets: 32, winRate: 81 },
    { month: 'Jul', profit: 520, bets: 26, winRate: 69 },
    { month: 'Aug', profit: 720, bets: 30, winRate: 77 },
    { month: 'Sep', profit: 940, bets: 35, winRate: 83 },
    { month: 'Oct', profit: 680, bets: 29, winRate: 75 },
    { month: 'Nov', profit: 1150, bets: 38, winRate: 85 },
    { month: 'Dec', profit: 1350, bets: 42, winRate: 88 }
  ];

  const bettingData = [
    { sport: 'NBA', bets: 45, winRate: 73, profit: 1250 },
    { sport: 'NFL', bets: 32, winRate: 69, profit: 890 },
    { sport: 'MLB', bets: 28, winRate: 75, profit: 1120 },
    { sport: 'NHL', bets: 18, winRate: 67, profit: 650 },
    { sport: 'Soccer', bets: 22, winRate: 71, profit: 780 }
  ];

  const pieData = [
    { name: 'Won', value: 68, color: '#10b981' },
    { name: 'Lost', value: 25, color: '#ef4444' },
    { name: 'Pending', value: 7, color: '#f59e0b' }
  ];

  const recentBets = [
    { id: 1, event: 'Lakers vs Warriors', type: 'Moneyline', odds: '+150', stake: 100, status: 'won', profit: 150 },
    { id: 2, event: 'Chiefs vs Bills', type: 'Over 47.5', odds: '-110', stake: 75, status: 'pending', profit: null },
    { id: 3, event: 'Celtics vs Heat', type: 'Spread -3.5', odds: '+105', stake: 80, status: 'lost', profit: -80 },
    { id: 4, event: 'Dodgers vs Padres', type: 'Under 8.5', odds: '-105', stake: 60, status: 'won', profit: 57 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'won': return 'bg-green-600';
      case 'lost': return 'bg-red-600';
      case 'pending': return 'bg-amber-600';
      default: return 'bg-gray-600';
    }
  };

  const getOddsColor = (odds: string) => {
    const numericOdds = parseFloat(odds.replace(/[^-\d.]/g, ''));
    if (numericOdds > 150) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    if (numericOdds > 0) return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
    if (numericOdds < -200) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <CanvasBackground />
      <Header />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Sports Betting Dashboard
          </h1>
          <p className="text-muted-foreground">
            Your complete betting analytics and performance overview
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card/80 backdrop-blur-sm border-border shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Total Profit</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">$8,725</p>
                  <p className="text-green-600 dark:text-green-400 text-sm">+12.5% from last month</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-border shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Win Rate</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">73.2%</p>
                  <p className="text-blue-600 dark:text-blue-400 text-sm">+2.1% from last month</p>
                </div>
                <Target className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-border shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Active Bets</p>
                  <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">12</p>
                  <p className="text-amber-600 dark:text-amber-400 text-sm">$1,250 at risk</p>
                </div>
                <Activity className="h-8 w-8 text-amber-600 dark:text-amber-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-border shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">ROI</p>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">15.8%</p>
                  <p className="text-purple-600 dark:text-purple-400 text-sm">Above average</p>
                </div>
                <DollarSign className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Performance Overview */}
          <Card className="bg-card/80 backdrop-blur-sm border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-foreground">Performance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="month" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        color: 'hsl(var(--foreground))'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="profit" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Betting Distribution */}
          <Card className="bg-card/80 backdrop-blur-sm border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-foreground">Betting Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        color: 'hsl(var(--foreground))'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center space-x-4 mt-4">
                {pieData.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm text-muted-foreground">{item.name} ({item.value}%)</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sports Performance */}
        <Card className="mb-8 bg-card/80 backdrop-blur-sm border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-foreground">Sports Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bettingData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="sport" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))'
                    }}
                  />
                  <Bar dataKey="profit" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Bets */}
        <Card className="bg-card/80 backdrop-blur-sm border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-foreground">Recent Bets</CardTitle>
            <Link to="/my-bets">
              <Button variant="outline" size="sm" className="border-border text-foreground hover:bg-muted">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {recentBets.map((bet) => (
                <div key={bet.id} className="bg-muted/50 rounded-lg p-4 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-foreground text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                      {bet.event}
                    </h4>
                    <Badge className={`${getStatusColor(bet.status)} text-white text-xs`}>
                      {bet.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground text-xs">Type</p>
                      <p className="text-foreground font-medium text-xs">{bet.type}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Odds</p>
                      <Badge className={`${getOddsColor(bet.odds)} text-xs`}>
                        {bet.odds}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Stake</p>
                      <p className="text-foreground font-medium text-xs">${bet.stake}</p>
                    </div>
                  </div>
                  {bet.profit !== null && (
                    <div className="mt-2 text-right">
                      <span className={`text-sm font-semibold ${bet.profit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {bet.profit >= 0 ? '+' : ''}${bet.profit}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
