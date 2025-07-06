
import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import CanvasBackground from "@/components/CanvasBackground";
import BetCard from "@/components/BetCard";
import BetStatsCards from "@/components/BetStatsCards";
import BetPerformanceSummary from "@/components/BetPerformanceSummary";
import MyBetsSkeletonGrid from "@/components/MyBetsSkeletonGrid";
import { useUserBets } from "@/hooks/useUserBets";
import { useEnhancedBetTracking } from "@/hooks/useEnhancedBetTracking";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const MyBets = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  
  const { 
    bets: userBets, 
    isLoading: isLoadingUserBets, 
    error: userBetsError
  } = useUserBets();
  
  const { 
    bets: enhancedBets, 
    isLoading: isLoadingEnhanced, 
    error: enhancedError,
    statistics,
    refetch: refreshEnhancedBets 
  } = useEnhancedBetTracking();

  // Combined loading state
  const isLoading = isLoadingUserBets || isLoadingEnhanced;

  useEffect(() => {
    refreshEnhancedBets();
  }, [refreshEnhancedBets]);

  // Helper function to get bets by status
  const getBetsByStatus = (status: string) => {
    return userBets.filter(bet => bet.status === status);
  };

  const filteredBets = selectedFilter === "all" 
    ? userBets 
    : getBetsByStatus(selectedFilter);

  const getBetCountByStatus = (status: string) => {
    return status === "all" ? userBets.length : getBetsByStatus(status).length;
  };

  // Transform user bets for BetCard component
  const transformBetForCard = (bet: any) => ({
    id: bet.id,
    event: bet.event_name,
    betType: bet.bet_type,
    odds: bet.odds,
    stake: bet.stake,
    potentialPayout: bet.potential_payout,
    actualPayout: bet.status === 'won' ? bet.potential_payout : bet.status === 'lost' ? 0 : null,
    status: bet.status,
    placedAt: bet.placed_at,
    settledAt: bet.settled_at,
    league: bet.league || 'Unknown League',
    sport: 'Sports',
    confidence: 75, // Default confidence
    aiRecommended: false,
    profit: bet.status === 'won' ? bet.potential_payout - bet.stake : 
            bet.status === 'lost' ? -bet.stake : 0,
    teams: bet.teams
  });

  return (
    <div className="min-h-screen text-foreground relative" style={{ background: 'linear-gradient(135deg, rgb(2 6 23) 0%, rgb(15 23 42) 50%, rgb(30 41 59) 100%)' }}>
      <CanvasBackground />
      <Header />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">My Bets</h1>
          <p className="text-slate-400">Track your betting performance and history</p>
        </div>

        {/* Show skeleton during loading */}
        {isLoading ? (
          <MyBetsSkeletonGrid />
        ) : (
          <>
            <BetStatsCards 
              totalBets={statistics.totalBets}
              totalProfit={statistics.totalProfit}
              winRate={statistics.winRate}
              pendingBets={statistics.pendingBets}
            />
            <BetPerformanceSummary 
              totalStaked={statistics.totalStaked}
              totalProfit={statistics.totalProfit}
            />

            <div className="mt-8">
              <Tabs value={selectedFilter} onValueChange={setSelectedFilter} className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-slate-900/50 border-slate-800/50">
                  <TabsTrigger value="all" className="text-xs">
                    All Bets
                    <Badge variant="secondary" className="ml-2 bg-slate-700 text-slate-200">
                      {getBetCountByStatus("all")}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="pending" className="text-xs">
                    Pending
                    <Badge variant="secondary" className="ml-2 bg-slate-700 text-slate-200">
                      {getBetCountByStatus("pending")}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="won" className="text-xs">
                    Won
                    <Badge variant="secondary" className="ml-2 bg-slate-700 text-slate-200">
                      {getBetCountByStatus("won")}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="lost" className="text-xs">
                    Lost
                    <Badge variant="secondary" className="ml-2 bg-slate-700 text-slate-200">
                      {getBetCountByStatus("lost")}
                    </Badge>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value={selectedFilter} className="mt-6">
                  {filteredBets.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-slate-400 text-lg">No bets found for this category</p>
                      <p className="text-slate-500 text-sm mt-2">Place some bets to see them here!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredBets.map((bet) => (
                        <BetCard key={bet.id} bet={transformBetForCard(bet)} />
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyBets;
