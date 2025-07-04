
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface LiveBet {
  id: string;
  event_id: string;
  league: string;
  home_team: string;
  away_team: string;
  bet_type: string;
  odds: string;
  implied_probability: string;
  ai_probability: string;
  value_percentage: string;
  confidence: number;
  sportsbook: string;
  time_left: string;
  home_score: number;
  away_score: number;
  quarter: string | null;
  status: string | null;
  created_at: string;
  updated_at: string;
}

export interface ValueBet {
  id: string;
  event: string;
  league: string;
  team1: string;
  team2: string;
  bet_type: string;
  odds: string;
  implied_prob: string;
  ai_prob: string;
  value: string;
  confidence: string;
  sportsbook: string;
  time_left: string;
  status: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaymentMethod {
  id: string;
  user_id: string;
  type: string;
  card_number?: string;
  card_holder_name?: string;
  card_expiry?: string;
  paypal_email?: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export const useLiveBets = () => {
  return useQuery({
    queryKey: ['live_bets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('live_bets')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as LiveBet[];
    },
    refetchInterval: 30000, // Refetch every 30 seconds for live data
  });
};

export const useValueBetsFromDB = () => {
  return useQuery({
    queryKey: ['value_bets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('value_bets')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as ValueBet[];
    },
    refetchInterval: 60000, // Refetch every minute
  });
};

export const usePaymentMethods = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['payment_methods', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('No user');
      
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as PaymentMethod[];
    },
    enabled: !!user?.id,
  });
};

export const usePlaceBet = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      eventName,
      betType,
      odds,
      stake,
      league,
      teams,
      sportsbook
    }: {
      eventName: string;
      betType: string;
      odds: string;
      stake: number;
      league?: string;
      teams?: string;
      sportsbook?: string;
    }) => {
      if (!user?.id) throw new Error('User not authenticated');

      // Calculate potential payout
      const oddsNum = parseFloat(odds.replace(/[+]/g, ''));
      const potentialPayout = oddsNum > 0 
        ? stake * (oddsNum / 100) + stake
        : stake * (100 / Math.abs(oddsNum)) + stake;

      const { data, error } = await supabase
        .from('user_bets')
        .insert({
          user_id: user.id,
          event_name: eventName,
          bet_type: betType,
          odds: odds,
          stake: stake,
          potential_payout: potentialPayout,
          league: league,
          teams: teams,
          sportsbook: sportsbook
        })
        .select()
        .single();

      if (error) throw error;

      // Create transaction record
      await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: 'bet_placed',
          amount: -stake,
          description: `Bet placed: ${betType} on ${eventName}`
        });

      return data;
    },
    onSuccess: () => {
      toast({
        title: "Bet Placed Successfully!",
        description: "Your bet has been placed and is now active.",
      });
      queryClient.invalidateQueries({ queryKey: ['user_bets'] });
      queryClient.invalidateQueries({ queryKey: ['credits'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
    onError: (error) => {
      toast({
        title: "Error Placing Bet",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useAddPaymentMethod = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (paymentMethod: Omit<PaymentMethod, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('payment_methods')
        .insert({
          ...paymentMethod,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Payment Method Added",
        description: "Your payment method has been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['payment_methods'] });
    },
    onError: (error) => {
      toast({
        title: "Error Adding Payment Method",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
