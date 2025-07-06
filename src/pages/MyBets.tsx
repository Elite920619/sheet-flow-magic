
import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import CanvasBackground from "@/components/CanvasBackground";
import BetStatsCards from "@/components/BetStatsCards";
import BetPerformanceSummary from "@/components/BetPerformanceSummary";
import MyBetsSkeletonGrid from "@/components/MyBetsSkeletonGrid";
import { useUserBets } from "@/hooks/useUserBets";
import { useEnhancedBetTracking } from "@/hooks/useEnhancedBetTracking";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, TrendingUp, Target } from 'lucide-react';

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

  const getStatusBadge = (status: string) => {
    const statusColors = {
      won: "bg-green-600 text-white",
      lost: "bg-red-600 text-white",
      pending: "bg-yellow-600 text-white",
      cancelled: "bg-gray-600 text-white"
    };
    return statusColors[status] || "bg-gray-600 text-white";
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen text-foreground relative" style={{ background: 'linear-gradient(135deg, rgb(2 6 23) 0%, rgb(15 23 42) 50%, rgb(30 41 59) 100%)' }}>
      <CanvasBackground />
      <Header />
      
      <div className="relative z-10 h-[calc(100vh-12rem)] flex flex-col bg-blur/80">
        {/* Header Section */}
        <div className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-800/50 p-3 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-blue-400" />
              <h1 className="text-xl font-bold text-slate-200">My Bets</h1>
            </div>
            <Badge className="bg-gradient-to-r from-blue-400 to-blue-500 text-white animate-pulse px-2 py-1 text-xs">
              <Activity className="h-3 w-3 mr-1" />
              {userBets.length} Total
            </Badge>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 hover:shadow-lg transition-shadow">
              <CardContent className="p-2.5 text-center">
                <div className="flex items-center justify-center mb-1">
                  <Target className="h-3 w-3 text-emerald-400 mr-1.5" />
                  <div className="text-base font-bold text-emerald-400">{statistics.winRate}%</div>
                </div>
                <div className="text-emerald-400 text-xs">Win Rate</div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 hover:shadow-lg transition-shadow">
              <CardContent className="p-2.5 text-center">
                <div className="flex items-center justify-center mb-1">
                  <TrendingUp className="h-3 w-3 text-orange-400 mr-1.5" />
                  <div className="text-base font-bold text-orange-400">{formatCurrency(statistics.totalProfit)}</div>
                </div>
                <div className="text-orange-400 text-xs">Total Profit</div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 hover:shadow-lg transition-shadow">
              <CardContent className="p-2.5 text-center">
                <div className="flex items-center justify-center mb-1">
                  <Activity className="h-3 w-3 text-blue-400 mr-1.5" />
                  <div className="text-base font-bold text-blue-400">{statistics.pendingBets}</div>
                </div>
                <div className="text-blue-400 text-xs">Pending Bets</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 max-h-[calc(100vh-12rem)] overflow-y-auto p-4">
          {/* Show skeleton during loading */}
          {isLoading ? (
            <MyBetsSkeletonGrid />
          ) : (
            <div className="space-y-6">
              <div className="mt-2">
                <Tabs value={selectedFilter} onValueChange={setSelectedFilter} className="w-full">
                  <TabsList className="grid w-full grid-cols-4 bg-slate-900/80 backdrop-blur-sm border-slate-700/50">
                    <TabsTrigger value="all" className="text-xs data-[state=active]:bg-slate-700/80 data-[state=active]:text-slate-100">
                      All Bets
                      <Badge variant="secondary" className="ml-2 bg-slate-700/80 text-slate-200">
                        {getBetCountByStatus("all")}
                      </Badge>
                    </TabsTrigger>
                    <TabsTrigger value="pending" className="text-xs data-[state=active]:bg-slate-700/80 data-[state=active]:text-slate-100">
                      Pending
                      <Badge variant="secondary" className="ml-2 bg-slate-700/80 text-slate-200">
                        {getBetCountByStatus("pending")}
                      </Badge>
                    </TabsTrigger>
                    <TabsTrigger value="won" className="text-xs data-[state=active]:bg-slate-700/80 data-[state=active]:text-slate-100">
                      Won
                      <Badge variant="secondary" className="ml-2 bg-slate-700/80 text-slate-200">
                        {getBetCountByStatus("won")}
                      </Badge>
                    </TabsTrigger>
                    <TabsTrigger value="lost" className="text-xs data-[state=active]:bg-slate-700/80 data-[state=active]:text-slate-100">
                      Lost
                      <Badge variant="secondary" className="ml-2 bg-slate-700/80 text-slate-200">
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
                      <Card className="bg-slate-900/70 backdrop-blur-sm border-slate-700/50">
                        <CardHeader>
                          <CardTitle className="text-slate-100">Betting History</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="overflow-x-auto">
                            <Table>
                              <TableHeader>
                                <TableRow className="border-slate-700/50 hover:bg-slate-800/50">
                                  <TableHead className="text-slate-300">Event</TableHead>
                                  <TableHead className="text-slate-300">Type</TableHead>
                                  <TableHead className="text-slate-300">Odds</TableHead>
                                  <TableHead className="text-slate-300">Stake</TableHead>
                                  <TableHead className="text-slate-300">Potential</TableHead>
                                  <TableHead className="text-slate-300">Status</TableHead>
                                  <TableHead className="text-slate-300">Placed</TableHead>
                                  <TableHead className="text-slate-300">League</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {filteredBets.map((bet) => (
                                  <TableRow key={bet.id} className="border-slate-700/50 hover:bg-slate-800/50">
                                    <TableCell className="text-slate-100 font-medium">
                                      <div>
                                        <div className="font-semibold">{bet.event_name}</div>
                                        {bet.teams && (
                                          <div className="text-sm text-slate-400">{bet.teams}</div>
                                        )}
                                      </div>
                                    </TableCell>
                                    <TableCell className="text-slate-300">{bet.bet_type}</TableCell>
                                    <TableCell className="text-slate-300 font-semibold">{bet.odds}</TableCell>
                                    <TableCell className="text-slate-300">{formatCurrency(bet.stake)}</TableCell>
                                    <TableCell className="text-slate-300">{formatCurrency(bet.potential_payout)}</TableCell>
                                    <TableCell>
                                      <Badge className={getStatusBadge(bet.status)}>
                                        {bet.status.toUpperCase()}
                                      </Badge>
                                    </TableCell>
                                    <TableCell className="text-slate-400 text-sm">
                                      {formatDate(bet.placed_at)}
                                    </TableCell>
                                    <TableCell className="text-slate-400">
                                      {bet.league || 'Unknown'}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBets;
