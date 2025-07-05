import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import CanvasBackground from '@/components/CanvasBackground';
import BetCard from '@/components/BetCard';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Wallet, TrendingUp, Target, Activity, CheckCircle, Clock, XCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUserBets } from '@/hooks/useUserBets';
import { useBetStatusUpdater } from '@/hooks/useBetStatusUpdater';

const MyBets = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const { bets, isLoading } = useUserBets();
  const { checkBetStatuses, pendingBetsCount } = useBetStatusUpdater();
  const [isUpdatingStatuses, setIsUpdatingStatuses] = useState(false);

  const handleUpdateBetStatuses = async () => {
    setIsUpdatingStatuses(true);
    try {
      await checkBetStatuses();
      window.location.reload();
    } catch (error) {
      console.error('Error updating bet statuses:', error);
    } finally {
      setIsUpdatingStatuses(false);
    }
  };

  // Enhanced sport detection function
  const detectSport = (league: string, eventName: string, teams: string) => {
    const text = `${league} ${eventName} ${teams}`.toLowerCase();
    
    if (text.includes('nfl') || text.includes('football') || text.includes('chiefs') || text.includes('bills') || text.includes('cowboys') || text.includes('patriots')) {
      return 'football';
    }
    if (text.includes('nba') || text.includes('basketball') || text.includes('lakers') || text.includes('warriors') || text.includes('celtics') || text.includes('knicks')) {
      return 'basketball';
    }
    if (text.includes('mlb') || text.includes('baseball') || text.includes('yankees') || text.includes('dodgers') || text.includes('red sox') || text.includes('mets')) {
      return 'baseball';
    }
    if (text.includes('nhl') || text.includes('hockey') || text.includes('rangers') || text.includes('bruins') || text.includes('blackhawks')) {
      return 'hockey';
    }
    if (text.includes('soccer') || text.includes('epl') || text.includes('premier league') || text.includes('uefa') || text.includes('fifa') || text.includes('mls')) {
      return 'soccer';
    }
    if (text.includes('tennis') || text.includes('atp') || text.includes('wta') || text.includes('wimbledon') || text.includes('us open')) {
      return 'tennis';
    }
    if (text.includes('golf') || text.includes('pga') || text.includes('masters') || text.includes('tiger') || text.includes('mcilroy')) {
      return 'golf';
    }
    if (text.includes('boxing') || text.includes('heavyweight') || text.includes('welterweight')) {
      return 'boxing';
    }
    if (text.includes('mma') || text.includes('ufc') || text.includes('bellator')) {
      return 'mma';
    }
    if (text.includes('cricket') || text.includes('ipl') || text.includes('test match')) {
      return 'cricket';
    }
    
    return 'other';
  };

  // Transform database bets to match BetCard interface
  const transformedBets = bets.map(bet => ({
    id: bet.id,
    event: bet.event_name,
    betType: bet.bet_type,
    odds: bet.odds,
    stake: Number(bet.stake),
    potentialPayout: Number(bet.potential_payout),
    actualPayout: bet.status === 'won' ? Number(bet.potential_payout) : bet.status === 'lost' ? 0 : null,
    status: bet.status,
    placedAt: bet.placed_at,
    settledAt: bet.settled_at || null,
    league: bet.league || 'N/A',
    sport: detectSport(bet.league || '', bet.event_name, bet.teams || ''),
    confidence: 85, // Default confidence
    aiRecommended: true, // Default to AI recommended
    profit: bet.status === 'won' ? Number(bet.potential_payout) - Number(bet.stake) :
            bet.status === 'lost' ? -Number(bet.stake) : 0,
    timeLeft: bet.status === 'pending' ? '2h 45m' : undefined,
    teams: bet.teams
  }));

  // Generate sports categories dynamically based on actual bet data
  const generateSportsCategories = () => {
    const sportCounts = transformedBets.reduce((acc, bet) => {
      acc[bet.sport] = (acc[bet.sport] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const sportMapping = {
      football: { label: 'Football', icon: '🏈' },
      basketball: { label: 'Basketball', icon: '🏀' },
      baseball: { label: 'Baseball', icon: '⚾' },
      hockey: { label: 'Hockey', icon: '🏒' },
      soccer: { label: 'Soccer', icon: '⚽' },
      tennis: { label: 'Tennis', icon: '🎾' },
      golf: { label: 'Golf', icon: '⛳' },
      boxing: { label: 'Boxing', icon: '🥊' },
      mma: { label: 'MMA', icon: '🥋' },
      cricket: { label: 'Cricket', icon: '🏏' },
      other: { label: 'Other', icon: '🏆' }
    };

    const categories = [
      { value: 'all', label: 'All Sports', icon: '🏆', count: transformedBets.length }
    ];

    Object.entries(sportCounts).forEach(([sport, count]) => {
      if (count > 0) {
        const mapping = sportMapping[sport as keyof typeof sportMapping];
        categories.push({
          value: sport,
          label: mapping?.label || sport.charAt(0).toUpperCase() + sport.slice(1),
          icon: mapping?.icon || '🏆',
          count
        });
      }
    });

    return categories;
  };

  const sportsCategories = generateSportsCategories();

  const statusCategories = [
    { value: 'all', label: 'All Status', icon: <Activity className="h-4 w-4" />, count: transformedBets.length, color: 'bg-gradient-to-r from-blue-400 to-blue-500' },
    { value: 'won', label: 'Won', icon: <CheckCircle className="h-4 w-4" />, count: transformedBets.filter(b => b.status === 'won').length, color: 'bg-gradient-to-r from-green-400 to-green-500' },
    { value: 'pending', label: 'In Progress', icon: <Clock className="h-4 w-4" />, count: transformedBets.filter(b => b.status === 'pending').length, color: 'bg-gradient-to-r from-orange-400 to-orange-500' },
    { value: 'lost', label: 'Lost', icon: <XCircle className="h-4 w-4" />, count: transformedBets.filter(b => b.status === 'lost').length, color: 'bg-gradient-to-r from-red-400 to-red-500' }
  ];

  const filteredBets = transformedBets.filter(bet => {
    const matchesSport = selectedCategory === 'all' || bet.sport === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || bet.status === selectedStatus;
    return matchesSport && matchesStatus;
  });

  const totalStaked = filteredBets.reduce((sum, bet) => sum + bet.stake, 0);
  const totalProfit = filteredBets.reduce((sum, bet) => sum + (bet.profit || 0), 0);
  const winRate = filteredBets.filter(bet => bet.status !== 'pending').length > 0 
    ? (filteredBets.filter(bet => bet.status === 'won').length / filteredBets.filter(bet => bet.status !== 'pending').length) * 100 
    : 0;

  if (isLoading) {
    return (
      <div className="h-screen bg-transparent text-foreground relative overflow-hidden">
        <CanvasBackground />
        <Header />
        
        <div className="relative z-10 h-[calc(100vh-4rem)] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto"></div>
            <p className="mt-4 text-slate-400">Loading your bets...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-transparent text-foreground relative overflow-hidden">
      <CanvasBackground />
      <Header />
      
      <div className="relative z-10 h-[calc(100vh-4rem)] flex flex-col">
        {/* Top Status Section */}
        <div className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-800/50 p-3 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Wallet className="h-5 w-5 text-blue-400" />
              <h1 className="text-xl font-bold text-slate-200">My Bets</h1>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-gradient-to-r from-green-400 to-green-500 text-white px-2 py-1 text-xs">
                <Activity className="h-3 w-3 mr-1" />
                {filteredBets.length} Bets
              </Badge>
              {pendingBetsCount > 0 && (
                <Button 
                  onClick={handleUpdateBetStatuses}
                  disabled={isUpdatingStatuses}
                  size="sm"
                  className="bg-orange-500 hover:bg-orange-600 h-7 text-xs px-2"
                >
                  <RefreshCw className={`h-3 w-3 mr-1 ${isUpdatingStatuses ? 'animate-spin' : ''}`} />
                  Update ({pendingBetsCount})
                </Button>
              )}
            </div>
          </div>

          {/* Status Categories */}
          <div className="flex items-center space-x-2 mb-3">
            {statusCategories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedStatus(category.value)}
                className={`px-3 py-1.5 rounded-lg transition-all duration-200 flex items-center space-x-1.5 text-xs ${
                  selectedStatus === category.value 
                    ? 'bg-gradient-to-r from-blue-400 to-blue-500 text-white shadow-md transform scale-105' 
                    : 'bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-blue-400 border border-slate-700/50'
                }`}
              >
                {category.icon}
                <span className="font-medium">{category.label}</span>
                <Badge className={`text-xs px-1 py-0 ${
                  selectedStatus === category.value 
                    ? 'bg-white/20 text-white' 
                    : 'bg-blue-500/20 text-blue-400'
                }`}>
                  {category.count}
                </Badge>
              </button>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 hover:shadow-lg transition-shadow">
              <CardContent className="p-2.5 text-center">
                <div className="flex items-center justify-center mb-1">
                  <TrendingUp className="h-3 w-3 text-green-400 mr-1.5" />
                  <div className="text-base font-bold text-green-400">{totalProfit >= 0 ? '+' : ''}${totalProfit.toFixed(2)}</div>
                </div>
                <div className="text-green-400 text-xs">Net Profit</div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 hover:shadow-lg transition-shadow">
              <CardContent className="p-2.5 text-center">
                <div className="flex items-center justify-center mb-1">
                  <Target className="h-3 w-3 text-orange-400 mr-1.5" />
                  <div className="text-base font-bold text-orange-400">{winRate.toFixed(1)}%</div>
                </div>
                <div className="text-orange-400 text-xs">Win Rate</div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 hover:shadow-lg transition-shadow">
              <CardContent className="p-2.5 text-center">
                <div className="flex items-center justify-center mb-1">
                  <Wallet className="h-3 w-3 text-blue-400 mr-1.5" />
                  <div className="text-base font-bold text-blue-400">${totalStaked.toFixed(2)}</div>
                </div>
                <div className="text-blue-400 text-xs">Total Staked</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Sports Categories Only */}
          <div className="w-40 bg-slate-900/50 backdrop-blur-sm border-r border-slate-800/50 shadow-sm">
            <ScrollArea className="h-full" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <div className="p-1.5 space-y-0.5" style={{ scrollbarWidth: 'none' }}>
                {sportsCategories.map((category) => (
                  <button
                    key={category.value}
                    onClick={() => setSelectedCategory(category.value)}
                    className={`w-full text-left p-1.5 rounded-lg transition-all duration-200 flex items-center justify-between text-xs ${
                      selectedCategory === category.value 
                        ? 'bg-gradient-to-r from-blue-400 to-blue-500 text-white shadow-sm' 
                        : 'hover:bg-slate-800/50 text-slate-300 hover:text-blue-400'
                    }`}
                  >
                    <div className="flex items-center space-x-1.5">
                      <span className="text-xs">{category.icon}</span>
                      <span className="font-medium">{category.label}</span>
                    </div>
                    <Badge className={`text-xs px-1 py-0 ${
                      selectedCategory === category.value 
                        ? 'bg-white/20 text-white' 
                        : 'bg-slate-700/50 text-slate-300'
                    }`}>
                      {category.count}
                    </Badge>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Right Content Area */}
          <div className="flex-1 overflow-hidden">
            {filteredBets.length > 0 ? (
              <ScrollArea className="h-full p-3" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3">
                  {filteredBets.map((bet) => (
                    <BetCard key={bet.id} bet={bet} />
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="flex items-center justify-center h-full">
                <Card className="p-6 text-center bg-slate-900/50 backdrop-blur-sm border-slate-800/50 shadow-sm">
                  <Wallet className="h-10 w-10 text-slate-400 mx-auto mb-3" />
                  <h3 className="text-base font-medium text-slate-200 mb-2">No Bets Found</h3>
                  <p className="text-slate-400 mb-3 text-sm">
                    {transformedBets.length === 0 
                      ? "You haven't placed any bets yet. Visit Live Events to start betting!"
                      : "No bets match your current filters."
                    }
                  </p>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyBets;
