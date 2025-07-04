
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface UserBet {
  id: string;
  user_id: string;
  event_name: string;
  bet_type: string;
  odds: string;
  stake: number;
  potential_payout: number;
  status: 'pending' | 'won' | 'lost' | 'cancelled';
  placed_at: string;
  settled_at?: string;
  league?: string;
  teams?: string;
  sportsbook?: string;
}

export const useUserBets = () => {
  const { user } = useAuth();

  const userBetsQuery = useQuery({
    queryKey: ['user_bets', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('No user');
      
      const { data, error } = await supabase
        .from('user_bets')
        .select('*')
        .eq('user_id', user.id)
        .order('placed_at', { ascending: false });
      
      if (error) throw error;
      return data as UserBet[];
    },
    enabled: !!user?.id,
  });

  return {
    bets: userBetsQuery.data || [],
    isLoading: userBetsQuery.isLoading,
    error: userBetsQuery.error,
  };
};
