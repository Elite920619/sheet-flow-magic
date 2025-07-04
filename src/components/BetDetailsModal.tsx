
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Target, Clock, DollarSign, BarChart3, PieChart as PieChartIcon, Activity } from 'lucide-react';

interface BetDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  bet: {
    event: string;
    league: string;
    team1: string;
    team2: string;
    betType: string;
    odds: string;
    impliedProb: string;
    aiProb: string;
    value: string;
    confidence: string;
    sportsbook: string;
    timeLeft: string;
  } | null;
}

const BetDetailsModal: React.FC<BetDetailsModalProps> = ({ isOpen, onClose, bet }) => {
  if (!bet) return null;

  // Mock data for charts
  const oddsHistory = [
    { time: '1h ago', odds: 2.10, value: 8.2 },
    { time: '45m ago', odds: 2.15, value: 9.1 },
    { time: '30m ago', odds: 2.20, value: 10.5 },
    { time: '15m ago', odds: 2.25, value: 12.3 },
    { time: 'Now', odds: parseFloat(bet.odds.replace('+', '')) / 100 + 1, value: parseFloat(bet.value.replace('+', '').replace('%', '')) }
  ];

  const bookmakerComparison = [
    { bookmaker: bet.sportsbook, odds: bet.odds, value: parseFloat(bet.value.replace('+', '').replace('%', '')) },
    { bookmaker: 'DraftKings', odds: '+185', value: 8.5 },
    { bookmaker: 'FanDuel', odds: '+190', value: 9.2 },
    { bookmaker: 'BetMGM', odds: '+180', value: 7.8 },
  ];

  const probabilityData = [
    { name: 'AI Probability', value: parseFloat(bet.aiProb.replace('%', '')), color: '#10b981' },
    { name: 'Market Probability', value: parseFloat(bet.impliedProb.replace('%', '')), color: '#3b82f6' },
    { name: 'Difference', value: parseFloat(bet.aiProb.replace('%', '')) - parseFloat(bet.impliedProb.replace('%', '')), color: '#f59e0b' }
  ];

  const chartConfig = {
    odds: { label: "Odds", color: "#3b82f6" },
    value: { label: "Value %", color: "#10b981" }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto bg-background text-foreground">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center">
            <Target className="h-6 w-6 mr-2 text-green-600" />
            Bet Analysis: {bet.team1} vs {bet.team2}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-card border-border">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{bet.value}</div>
                <div className="text-sm text-muted-foreground">Value Edge</div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{bet.confidence}%</div>
                <div className="text-sm text-muted-foreground">AI Confidence</div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{bet.odds}</div>
                <div className="text-sm text-muted-foreground">Best Odds</div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600 flex items-center justify-center">
                  <Clock className="h-5 w-5 mr-1" />
                  {bet.timeLeft}
                </div>
                <div className="text-sm text-muted-foreground">Time Left</div>
              </CardContent>
            </Card>
          </div>

          {/* Bet Information */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Bet Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="font-medium">League:</span> {bet.league}
                </div>
                <div>
                  <span className="font-medium">Bet Type:</span> {bet.betType}
                </div>
                <div>
                  <span className="font-medium">Sportsbook:</span> {bet.sportsbook}
                </div>
                <div>
                  <span className="font-medium">Market Probability:</span> {bet.impliedProb}
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Badge className="bg-green-600 text-white">High Value</Badge>
                <Badge className="bg-blue-600 text-white">AI Recommended</Badge>
                <Badge className="bg-purple-600 text-white">Live Analysis</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Charts - Responsive Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Odds History Chart */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Odds & Value History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 w-full">
                  <ChartContainer config={chartConfig} className="w-full h-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={oddsHistory}>
                        <XAxis dataKey="time" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line type="monotone" dataKey="odds" stroke="#3b82f6" strokeWidth={2} />
                        <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            {/* Bookmaker Comparison */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Bookmaker Comparison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 w-full">
                  <ChartContainer config={chartConfig} className="w-full h-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={bookmakerComparison}>
                        <XAxis dataKey="bookmaker" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="value" fill="#10b981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Probability Analysis - Single Card Responsive Layout */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChartIcon className="h-5 w-5 mr-2" />
                Probability Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-64 flex justify-center">
                  <ChartContainer config={chartConfig} className="w-full max-w-sm">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={probabilityData.slice(0, 2)}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}%`}
                        >
                          {probabilityData.slice(0, 2).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
                <div className="space-y-4 flex flex-col justify-center">
                  <div>
                    <div className="flex justify-between items-center">
                      <span>AI Probability:</span>
                      <span className="font-bold text-green-600">{bet.aiProb}</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center">
                      <span>Market Probability:</span>
                      <span className="font-bold text-blue-600">{bet.impliedProb}</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center">
                      <span>Edge:</span>
                      <span className="font-bold text-orange-600">{bet.value}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end pt-4 border-t border-border">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <DollarSign className="h-4 w-4 mr-2" />
              Place Bet
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BetDetailsModal;
