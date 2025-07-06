
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import CanvasBackground from '@/components/CanvasBackground';
import ValueBetsHeader from '@/components/ValueBetsHeader';
import ValueBetsStatsCards from '@/components/ValueBetsStatsCards';
import ValueBetsInputForm from '@/components/ValueBetsInputForm';
import ValueBetsSidebar from '@/components/ValueBetsSidebar';
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
import { useBetting } from '@/hooks/useBetting';
import { useToast } from '@/hooks/use-toast';

const ValueBets = () => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [selectedConfidence, setSelectedConfidence] = useState('all');
  const [selectedValue, setSelectedValue] = useState('all');
  const [minOdds, setMinOdds] = useState('');
  const [maxOdds, setMaxOdds] = useState('');
  const [showInputForm, setShowInputForm] = useState(false);

  const { 
    valueBets, 
    isLoading, 
    error, 
    refetch 
  } = useValueBetAnalysis({
    sports: selectedFilters,
    confidence: selectedConfidence,
    value: selectedValue,
    minOdds: minOdds ? parseFloat(minOdds) : undefined,
    maxOdds: maxOdds ? parseFloat(maxOdds) : undefined
  });

  const { placeBet } = useBetting();
  const { toast } = useToast();

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
    const valueNum = parseFloat(value);
    if (valueNum >= 15) return "bg-green-600 text-white";
    if (valueNum >= 10) return "bg-yellow-600 text-white";
    return "bg-blue-600 text-white";
  };

  const handleTrackBet = async (bet: any) => {
    try {
      const stake = 100; // Default stake, could be made configurable
      const result = await placeBet({
        event_name: `${bet.team1} vs ${bet.team2}`,
        bet_type: bet.bet_type,
        odds: bet.odds,
        stake: stake,
        potential_payout: stake * parseFloat(bet.odds),
        league: bet.league,
        teams: `${bet.team1} vs ${bet.team2}`,
        sportsbook: bet.sportsbook
      });

      if (result.success) {
        toast({
          title: "Bet Tracked Successfully",
          description: `Added ${bet.bet_type} bet on ${bet.team1} vs ${bet.team2} to your tracking.`,
        });
      } else {
        throw new Error(result.error || 'Failed to track bet');
      }
    } catch (error) {
      console.error('Error tracking bet:', error);
      toast({
        title: "Failed to Track Bet",
        description: "There was an error adding this bet to your tracking. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative">
      <CanvasBackground />
      <Header />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="flex gap-6">
          <ValueBetsSidebar
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
            selectedConfidence={selectedConfidence}
            onConfidenceChange={setSelectedConfidence}
            selectedValue={selectedValue}
            onValueChange={setSelectedValue}
            minOdds={minOdds}
            maxOdds={maxOdds}
            onMinOddsChange={setMinOdds}
            onMaxOddsChange={setMaxOdds}
            onClearFilters={clearAllFilters}
          />
          
          <div className="flex-1">
            <ValueBetsHeader 
              onRefresh={refetch}
              onShowInputForm={() => setShowInputForm(true)}
            />
            
            <ValueBetsStatsCards 
              totalBets={valueBets.length}
              averageValue={valueBets.reduce((sum, bet) => sum + parseFloat(bet.value), 0) / valueBets.length || 0}
              highConfidenceBets={valueBets.filter(bet => parseFloat(bet.confidence) >= 80).length}
            />

            {showInputForm && (
              <ValueBetsInputForm 
                onClose={() => setShowInputForm(false)}
                onSubmit={refetch}
              />
            )}

            <div className="mt-8">
              {isLoading ? (
                <ValueBetsSkeletonGrid />
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-red-400 text-lg">Error loading value bets</p>
                  <p className="text-slate-500 text-sm mt-2">{error.message}</p>
                </div>
              ) : valueBets.length === 0 ? (
                <ValueBetsEmptyState />
              ) : (
                <Card className="bg-slate-900 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-slate-100">Value Betting Opportunities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-slate-700 hover:bg-slate-800">
                            <TableHead className="text-slate-300">Event</TableHead>
                            <TableHead className="text-slate-300">Type</TableHead>
                            <TableHead className="text-slate-300">Odds</TableHead>
                            <TableHead className="text-slate-300">AI Prob</TableHead>
                            <TableHead className="text-slate-300">Implied Prob</TableHead>
                            <TableHead className="text-slate-300">Value</TableHead>
                            <TableHead className="text-slate-300">Confidence</TableHead>
                            <TableHead className="text-slate-300">Status</TableHead>
                            <TableHead className="text-slate-300">League</TableHead>
                            <TableHead className="text-slate-300">Time Left</TableHead>
                            <TableHead className="text-slate-300">Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {valueBets.map((bet) => (
                            <TableRow key={bet.id} className="border-slate-700 hover:bg-slate-800">
                              <TableCell className="text-slate-100 font-medium">
                                <div>
                                  <div className="font-semibold">{bet.team1} vs {bet.team2}</div>
                                  <div className="text-sm text-slate-400">{bet.sportsbook}</div>
                                </div>
                              </TableCell>
                              <TableCell className="text-slate-300">{bet.bet_type}</TableCell>
                              <TableCell className="text-slate-300 font-semibold">{bet.odds}</TableCell>
                              <TableCell className="text-slate-300">{bet.ai_prob}%</TableCell>
                              <TableCell className="text-slate-300">{bet.implied_prob}%</TableCell>
                              <TableCell className="text-slate-300">
                                <Badge className={getValueBadge(bet.value)}>
                                  {bet.value}%
                                </Badge>
                              </TableCell>
                              <TableCell className="text-slate-300">
                                <Badge className={getConfidenceBadge(bet.confidence)}>
                                  {bet.confidence}%
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge className={getStatusBadge(bet.status || 'active')}>
                                  {(bet.status || 'active').toUpperCase()}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-slate-400">{bet.league}</TableCell>
                              <TableCell className="text-slate-400">{bet.time_left}</TableCell>
                              <TableCell>
                                <Button
                                  onClick={() => handleTrackBet(bet)}
                                  size="sm"
                                  className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                  Track
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
      </div>
    </div>
  );
};

export default ValueBets;
