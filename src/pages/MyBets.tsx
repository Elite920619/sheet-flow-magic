
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
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

  const { toast } = useToast();

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

  const handleTrackPending = (bet: any) => {
    // This would typically set up notifications or tracking for pending bets
    toast({
      title: "Bet Tracking Enabled",
      description: `You'll be notified when ${bet.event_name} settles.`,
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative">
      <CanvasBackground />
      <Header />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-100 mb-2 text-center">My Bets</h1>
          <p className="text-slate-400 text-center">Track your betting performance and history</p>
        </div>

        {/* Show skeleton during loading */}
        {isLoading ? (
          <MyBetsSkeletonGrid />
        ) : (
          <>
            <div className="mb-8">
              <BetStatsCards 
                totalBets={statistics.totalBets}
                totalProfit={statistics.totalProfit}
                winRate={statistics.winRate}
                pendingBets={statistics.pendingBets}
              />
            </div>
            
            <div className="mb-8">
              <BetPerformanceSummary 
                totalStaked={statistics.totalStaked}
                totalProfit={statistics.totalProfit}
              />
            </div>

            <div className="mt-8">
              <Tabs value={selectedFilter} onValueChange={setSelectedFilter} className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-slate-900/80 backdrop-blur-sm border-slate-700">
                  <TabsTrigger value="all" className="text-xs data-[state=active]:bg-slate-700 data-[state=active]:text-slate-100">
                    All Bets
                    <Badge variant="secondary" className="ml-2 bg-slate-700 text-slate-200">
                      {getBetCountByStatus("all")}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="pending" className="text-xs data-[state=active]:bg-slate-700 data-[state=active]:text-slate-100">
                    Pending
                    <Badge variant="secondary" className="ml-2 bg-slate-700 text-slate-200">
                      {getBetCountByStatus("pending")}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="won" className="text-xs data-[state=active]:bg-slate-700 data-[state=active]:text-slate-100">
                    Won
                    <Badge variant="secondary" className="ml-2 bg-slate-700 text-slate-200">
                      {getBetCountByStatus("won")}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="lost" className="text-xs data-[state=active]:bg-slate-700 data-[state=active]:text-slate-100">
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
                    <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700">
                      <CardHeader>
                        <CardTitle className="text-slate-100">Betting History</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow className="border-slate-700 hover:bg-slate-800/50">
                                <TableHead className="text-slate-300">Event</TableHead>
                                <TableHead className="text-slate-300">Type</TableHead>
                                <TableHead className="text-slate-300">Odds</TableHead>
                                <TableHead className="text-slate-300">Stake</TableHead>
                                <TableHead className="text-slate-300">Potential</TableHead>
                                <TableHead className="text-slate-300">Status</TableHead>
                                <TableHead className="text-slate-300">Placed</TableHead>
                                <TableHead className="text-slate-300">League</TableHead>
                                <TableHead className="text-slate-300">Action</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {filteredBets.map((bet) => (
                                <TableRow key={bet.id} className="border-slate-700 hover:bg-slate-800/50">
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
                                  <TableCell>
                                    {bet.status === 'pending' && (
                                      <Button
                                        onClick={() => handleTrackPending(bet)}
                                        size="sm"
                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                      >
                                        <Bell className="h-3 w-3 mr-1" />
                                        Track
                                      </Button>
                                    )}
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
          </>
        )}
      </div>
    </div>
  );
};

export default MyBets;
