
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 relative">
      <CanvasBackground />
      <Header />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 text-center">My Bets</h1>
          <p className="text-gray-600 text-center">Track your betting performance and history</p>
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
                <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm border border-gray-200">
                  <TabsTrigger value="all" className="text-xs data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900">
                    All Bets
                    <Badge variant="secondary" className="ml-2 bg-gray-100 text-gray-700">
                      {getBetCountByStatus("all")}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="pending" className="text-xs data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900">
                    Pending
                    <Badge variant="secondary" className="ml-2 bg-gray-100 text-gray-700">
                      {getBetCountByStatus("pending")}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="won" className="text-xs data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900">
                    Won
                    <Badge variant="secondary" className="ml-2 bg-gray-100 text-gray-700">
                      {getBetCountByStatus("won")}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="lost" className="text-xs data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900">
                    Lost
                    <Badge variant="secondary" className="ml-2 bg-gray-100 text-gray-700">
                      {getBetCountByStatus("lost")}
                    </Badge>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value={selectedFilter} className="mt-6">
                  {filteredBets.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-600 text-lg">No bets found for this category</p>
                      <p className="text-gray-500 text-sm mt-2">Place some bets to see them here!</p>
                    </div>
                  ) : (
                    <Card className="bg-white/80 backdrop-blur-sm border border-gray-200">
                      <CardHeader>
                        <CardTitle className="text-gray-900">Betting History</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow className="border-gray-200 hover:bg-gray-50/50">
                                <TableHead className="text-gray-700">Event</TableHead>
                                <TableHead className="text-gray-700">Type</TableHead>
                                <TableHead className="text-gray-700">Odds</TableHead>
                                <TableHead className="text-gray-700">Stake</TableHead>
                                <TableHead className="text-gray-700">Potential</TableHead>
                                <TableHead className="text-gray-700">Status</TableHead>
                                <TableHead className="text-gray-700">Placed</TableHead>
                                <TableHead className="text-gray-700">League</TableHead>
                                <TableHead className="text-gray-700">Action</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {filteredBets.map((bet) => (
                                <TableRow key={bet.id} className="border-gray-200 hover:bg-gray-50/50">
                                  <TableCell className="text-gray-900 font-medium">
                                    <div>
                                      <div className="font-semibold">{bet.event_name}</div>
                                      {bet.teams && (
                                        <div className="text-sm text-gray-600">{bet.teams}</div>
                                      )}
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-gray-700">{bet.bet_type}</TableCell>
                                  <TableCell className="text-gray-700 font-semibold">{bet.odds}</TableCell>
                                  <TableCell className="text-gray-700">{formatCurrency(bet.stake)}</TableCell>
                                  <TableCell className="text-gray-700">{formatCurrency(bet.potential_payout)}</TableCell>
                                  <TableCell>
                                    <Badge className={getStatusBadge(bet.status)}>
                                      {bet.status.toUpperCase()}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-gray-600 text-sm">
                                    {formatDate(bet.placed_at)}
                                  </TableCell>
                                  <TableCell className="text-gray-600">
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
