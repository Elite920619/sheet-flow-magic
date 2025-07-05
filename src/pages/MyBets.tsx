
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
    userBets, 
    isLoading: isLoadingUserBets, 
    refreshBets,
    getBetsByStatus 
  } = useUserBets();
  
  const { 
    enhancedBets, 
    isLoading: isLoadingEnhanced, 
    refreshEnhancedBets 
  } = useEnhancedBetTracking();

  // Combined loading state
  const isLoading = isLoadingUserBets || isLoadingEnhanced;

  useEffect(() => {
    refreshBets();
    refreshEnhancedBets();
  }, []);

  const filteredBets = selectedFilter === "all" 
    ? userBets 
    : getBetsByStatus(selectedFilter);

  const getBetCountByStatus = (status: string) => {
    return status === "all" ? userBets.length : getBetsByStatus(status).length;
  };

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
            <BetStatsCards userBets={userBets} />
            <BetPerformanceSummary userBets={userBets} />

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
                        <BetCard key={bet.id} bet={bet} />
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
