
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import CanvasBackground from '@/components/CanvasBackground';
import ValueBetsHeader from '@/components/ValueBetsHeader';
import ValueBetsStatsCards from '@/components/ValueBetsStatsCards';
import ValueBetsInputForm from '@/components/ValueBetsInputForm';
import ValueBetsGrid from '@/components/ValueBetsGrid';
import ValueBetsSkeletonGrid from '@/components/ValueBetsSkeletonGrid';
import ValueBetsEmptyState from '@/components/ValueBetsEmptyState';
import { useValueBetAnalysis } from '@/hooks/useValueBetAnalysis';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { usePlaceBet } from '@/hooks/useBetting';
import { useToast } from '@/hooks/use-toast';
import { Brain, Star, Target, TrendingUp } from 'lucide-react';

const ValueBets = () => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [selectedConfidence, setSelectedConfidence] = useState('all');
  const [selectedValue, setSelectedValue] = useState('all');
  const [minOdds, setMinOdds] = useState('');
  const [maxOdds, setMaxOdds] = useState('');
  const [showInputForm, setShowInputForm] = useState(false);
  const [bookmakerOdds, setBookmakerOdds] = useState('');
  const [estimatedWinPercent, setEstimatedWinPercent] = useState('');

  const { 
    foundValueBets,
    isAnalyzing,
    analyzeValueBets,
    clearResult
  } = useValueBetAnalysis();

  const placeBetMutation = usePlaceBet();
  const { toast } = useToast();

  // Filter found value bets based on current filters
  const filteredBets = foundValueBets.filter(bet => {
    const confidenceNum = parseFloat(bet.confidence);
    const valueNum = parseFloat(bet.value.replace('%', '').replace('+', ''));
    const oddsNum = parseFloat(bet.odds);

    const matchesConfidence = selectedConfidence === 'all' || 
      (selectedConfidence === 'high' && confidenceNum >= 80) ||
      (selectedConfidence === 'medium' && confidenceNum >= 60 && confidenceNum < 80) ||
      (selectedConfidence === 'low' && confidenceNum < 60);

    const matchesValue = selectedValue === 'all' ||
      (selectedValue === 'high' && valueNum >= 15) ||
      (selectedValue === 'medium' && valueNum >= 10 && valueNum < 15) ||
      (selectedValue === 'low' && valueNum < 10);

    const matchesOdds = (!minOdds || oddsNum >= parseFloat(minOdds)) &&
      (!maxOdds || oddsNum <= parseFloat(maxOdds));

    const matchesFilters = selectedFilters.length === 0 || 
      selectedFilters.some(filter => bet.sport.toLowerCase().includes(filter.toLowerCase()));

    return matchesConfidence && matchesValue && matchesOdds && matchesFilters;
  });

  const handleFilterChange = (filter: string) => {
    setSelectedFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const clearAllFilters = () => {
    setSelectedFilters([]);
    setSelectedConfidence('all');
    setSelectedValue('all');
    setMinOdds('');
    setMaxOdds('');
  };

  const handleAnalyze = async () => {
    if (!bookmakerOdds || !estimatedWinPercent) return;
    
    const targetOdds = parseFloat(bookmakerOdds);
    const winProbability = parseFloat(estimatedWinPercent);
    
    await analyzeValueBets(targetOdds, winProbability);
  };

  const handleReset = () => {
    setBookmakerOdds('');
    setEstimatedWinPercent('');
    clearResult();
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      active: "bg-green-600 text-white",
      inactive: "bg-red-600 text-white",
      pending: "bg-yellow-600 text-white"
    };
    return statusColors[status as keyof typeof statusColors] || "bg-gray-600 text-white";
  };

  const getConfidenceBadge = (confidence: string) => {
    const confidenceNum = parseFloat(confidence);
    if (confidenceNum >= 80) return "bg-green-600 text-white";
    if (confidenceNum >= 60) return "bg-yellow-600 text-white";
    return "bg-red-600 text-white";
  };

  const getValueBadge = (value: string) => {
    const valueNum = parseFloat(value.replace('%', '').replace('+', ''));
    if (valueNum >= 15) return "bg-green-600 text-white";
    if (valueNum >= 10) return "bg-yellow-600 text-white";
    return "bg-blue-600 text-white";
  };

  const handleTrackBet = async (bet: any) => {
    try {
      const stake = 100; // Default stake, could be made configurable
      await placeBetMutation.mutateAsync({
        eventName: `${bet.team1} vs ${bet.team2}`,
        betType: bet.betType,
        odds: bet.odds,
        stake: stake,
        league: bet.league,
        teams: `${bet.team1} vs ${bet.team2}`,
        sportsbook: bet.sportsbook
      });

      toast({
        title: "Bet Tracked Successfully",
        description: `Added ${bet.betType} bet on ${bet.team1} vs ${bet.team2} to your tracking.`,
      });
    } catch (error) {
      console.error('Error tracking bet:', error);
      toast({
        title: "Failed to Track Bet",
        description: "There was an error adding this bet to your tracking. Please try again.",
        variant: "destructive",
      });
    }
  };

  const highValueBets = filteredBets.filter(bet => parseFloat(bet.value.replace('%', '').replace('+', '')) >= 15).length;
  const avgConfidence = filteredBets.length > 0 ? filteredBets.reduce((sum, bet) => sum + parseFloat(bet.confidence), 0) / filteredBets.length : 0;

  return (
    <div className="min-h-screen text-foreground relative" style={{ background: 'linear-gradient(135deg, rgb(2 6 23) 0%, rgb(15 23 42) 50%, rgb(30 41 59) 100%)' }}>
      <CanvasBackground />
      <Header />
      
      <div className="relative z-10 h-[calc(100vh-12rem)] flex flex-col bg-blur/80">
        {/* Header Section */}
        <div className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-800/50 p-3 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-blue-400" />
              <h1 className="text-xl font-bold text-slate-200">Value Bets</h1>
            </div>
            <Badge className="bg-gradient-to-r from-purple-400 to-purple-500 text-white animate-pulse px-2 py-1 text-xs">
              <Star className="h-3 w-3 mr-1" />
              {filteredBets.length} Found
            </Badge>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 hover:shadow-lg transition-shadow">
              <CardContent className="p-2.5 text-center">
                <div className="flex items-center justify-center mb-1">
                  <Target className="h-3 w-3 text-emerald-400 mr-1.5" />
                  <div className="text-base font-bold text-emerald-400">{highValueBets}</div>
                </div>
                <div className="text-emerald-400 text-xs">High Value Bets</div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 hover:shadow-lg transition-shadow">
              <CardContent className="p-2.5 text-center">
                <div className="flex items-center justify-center mb-1">
                  <TrendingUp className="h-3 w-3 text-orange-400 mr-1.5" />
                  <div className="text-base font-bold text-orange-400">{avgConfidence.toFixed(1)}%</div>
                </div>
                <div className="text-orange-400 text-xs">Avg Confidence</div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 hover:shadow-lg transition-shadow">
              <CardContent className="p-2.5 text-center">
                <div className="flex items-center justify-center mb-1">
                  <Brain className="h-3 w-3 text-blue-400 mr-1.5" />
                  <div className="text-base font-bold text-blue-400">{filteredBets.length}</div>
                </div>
                <div className="text-blue-400 text-xs">Total Opportunities</div>
              </CardContent>
            </Card>
          </div>

          {/* Input Form */}
          <ValueBetsInputForm 
            bookmakerOdds={bookmakerOdds}
            estimatedWinPercent={estimatedWinPercent}
            isAnalyzing={isAnalyzing}
            onOddsChange={setBookmakerOdds}
            onWinPercentChange={setEstimatedWinPercent}
            onAnalyze={handleAnalyze}
            onReset={handleReset}
          />
        </div>

        {/* Content Section */}
        <div className="flex-1 max-h-[calc(100vh-12rem)] overflow-y-auto p-4">
          {isAnalyzing ? (
            <ValueBetsSkeletonGrid />
          ) : filteredBets.length === 0 ? (
            <ValueBetsEmptyState />
          ) : (
            <Card className="bg-slate-900/70 backdrop-blur-sm border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-slate-100">Value Betting Opportunities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-700/50 hover:bg-slate-800/50">
                        <TableHead className="text-slate-300">Event</TableHead>
                        <TableHead className="text-slate-300">Type</TableHead>
                        <TableHead className="text-slate-300">Odds</TableHead>
                        <TableHead className="text-slate-300">AI Prob</TableHead>
                        <TableHead className="text-slate-300">Implied Prob</TableHead>
                        <TableHead className="text-slate-300">Value</TableHead>
                        <TableHead className="text-slate-300">Confidence</TableHead>
                        <TableHead className="text-slate-300">League</TableHead>
                        <TableHead className="text-slate-300">Time Left</TableHead>
                        <TableHead className="text-slate-300">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBets.map((bet) => (
                        <TableRow key={bet.id} className="border-slate-700/50 hover:bg-slate-800/50">
                          <TableCell className="text-slate-100 font-medium">
                            <div>
                              <div className="font-semibold">{bet.team1} vs {bet.team2}</div>
                              <div className="text-sm text-slate-400">{bet.sportsbook}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-slate-300">{bet.betType}</TableCell>
                          <TableCell className="text-slate-300 font-semibold">{bet.odds}</TableCell>
                          <TableCell className="text-slate-300">{bet.aiProb}</TableCell>
                          <TableCell className="text-slate-300">{bet.impliedProb}</TableCell>
                          <TableCell className="text-slate-300">
                            <Badge className={getValueBadge(bet.value)}>
                              {bet.value}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-slate-300">
                            <Badge className={getConfidenceBadge(bet.confidence)}>
                              {bet.confidence}%
                            </Badge>
                          </TableCell>
                          <TableCell className="text-slate-400">{bet.league}</TableCell>
                          <TableCell className="text-slate-400">{bet.timeLeft}</TableCell>
                          <TableCell>
                            <Button
                              onClick={() => handleTrackBet(bet)}
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                              disabled={placeBetMutation.isPending}
                            >
                              {placeBetMutation.isPending ? 'Tracking...' : 'Track'}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ValueBets;
