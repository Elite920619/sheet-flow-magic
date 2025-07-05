
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface EnhancedUserBet {
  id: string;
  user_id: string;
  event_name: string;
  bet_type: string;
  market_type: 'single' | 'parlay' | 'live' | 'pre_match';
  odds: string;
  stake: number;
  potential_payout: number;
  actual_payout?: number;
  status: 'pending' | 'in_progress' | 'won' | 'lost' | 'cashed_out' | 'void';
  placed_at: string;
  settled_at?: string;
  league?: string;
  teams?: string;
  sportsbook?: string;
  event_id?: string;
  live_score?: {
    home_score: number;
    away_score: number;
    quarter?: string;
    time_left?: string;
  };
  cash_out_value?: number;
  is_live: boolean;
}

export const useEnhancedBetTracking = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user bets with enhanced data
  const userBetsQuery = useQuery({
    queryKey: ['enhanced_user_bets', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('No user');
      
      const { data, error } = await supabase
        .from('user_bets')
        .select('*')
        .eq('user_id', user.id)
        .order('placed_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform to enhanced format
      return data.map(bet => ({
        ...bet,
        market_type: bet.bet_type?.includes('live') ? 'live' : 'pre_match',
        is_live: bet.status === 'pending' || bet.status === 'in_progress',
        // Calculate actual_payout based on status since it's not in the database
        actual_payout: bet.status === 'won' ? bet.potential_payout : 
                      bet.status === 'lost' ? 0 : undefined
      })) as EnhancedUserBet[];
    },
    enabled: !!user?.id,
    refetchInterval: (data) => {
      // Refetch every 30 seconds if there are live bets
      const hasLiveBets = data?.some(bet => bet.is_live);
      return hasLiveBets ? 30000 : false;
    }
  });

  // Update bet status mutation
  const updateBetStatusMutation = useMutation({
    mutationFn: async ({ betId, status, actualPayout }: { 
      betId: string; 
      status: EnhancedUserBet['status']; 
      actualPayout?: number 
    }) => {
      const updateData: any = {
        status,
        settled_at: status !== 'pending' && status !== 'in_progress' ? new Date().toISOString() : null
      };

      const { data, error } = await supabase
        .from('user_bets')
        .update(updateData)
        .eq('id', betId)
        .eq('user_id', user?.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enhanced_user_bets'] });
      toast({
        title: "Bet Updated",
        description: "Bet status has been updated successfully.",
      });
    },
    onError: (error) => {
      console.error('Error updating bet:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update bet status. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Cash out bet mutation
  const cashOutBetMutation = useMutation({
    mutationFn: async ({ betId, cashOutValue }: { betId: string; cashOutValue: number }) => {
      const { data, error } = await supabase
        .from('user_bets')
        .update({
          status: 'cashed_out',
          settled_at: new Date().toISOString()
        })
        .eq('id', betId)
        .eq('user_id', user?.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['enhanced_user_bets'] });
      toast({
        title: "Bet Cashed Out",
        description: `Successfully cashed out bet`,
      });
    }
  });

  // Calculate bet statistics
  const getBetStatistics = () => {
    const bets = userBetsQuery.data || [];
    const settledBets = bets.filter(bet => ['won', 'lost', 'void'].includes(bet.status));
    const wonBets = bets.filter(bet => bet.status === 'won');
    const lostBets = bets.filter(bet => bet.status === 'lost');
    const liveBets = bets.filter(bet => bet.is_live);

    const totalStaked = bets.reduce((sum, bet) => sum + bet.stake, 0);
    const totalWinnings = wonBets.reduce((sum, bet) => sum + bet.potential_payout, 0);
    const totalProfit = totalWinnings - bets.filter(bet => bet.status !== 'pending').reduce((sum, bet) => sum + bet.stake, 0);
    const winRate = settledBets.length > 0 ? (wonBets.length / settledBets.length) * 100 : 0;

    return {
      totalBets: bets.length,
      totalStaked,
      totalWinnings,
      totalProfit,
      winRate,
      liveBets: liveBets.length,
      wonBets: wonBets.length,
      lostBets: lostBets.length,
      pendingBets: bets.filter(bet => bet.status === 'pending').length
    };
  };

  return {
    bets: userBetsQuery.data || [],
    isLoading: userBetsQuery.isLoading,
    error: userBetsQuery.error,
    updateBetStatus: updateBetStatusMutation.mutate,
    cashOutBet: cashOutBetMutation.mutate,
    isUpdating: updateBetStatusMutation.isPending,
    isCashingOut: cashOutBetMutation.isPending,
    statistics: getBetStatistics(),
    refetch: userBetsQuery.refetch
  };
};
