
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useEnhancedCredits = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const creditsQuery = useQuery({
    queryKey: ['credits', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('No user');
      
      // Check wallet_accounts first (new system)
      const { data: walletData, error: walletError } = await supabase
        .from('wallet_accounts')
        .select('*')
        .eq('user_id', user.id)
        .eq('account_type', 'main')
        .single();
      
      if (walletData && !walletError) {
        return { balance: walletData.balance, id: walletData.id };
      }
      
      // Fallback to user_credits (legacy system)
      const { data, error } = await supabase
        .from('user_credits')
        .select('*')
        .eq('user_id', user.id)
        .eq('currency', 'USD')
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data ? { balance: data.balance, id: data.id } : { balance: 0, id: null };
    },
    enabled: !!user?.id,
  });

  const depositMutation = useMutation({
    mutationFn: async (amount: number) => {
      if (!user?.id) throw new Error('No user');
      
      // Use new wallet system if available
      const { data, error } = await supabase.rpc('process_wallet_transaction', {
        p_user_id: user.id,
        p_transaction_type: 'deposit',
        p_amount: amount,
        p_description: `Deposit of $${amount}`,
        p_payment_method: 'card'
      });

      if (error) {
        // Fallback to legacy system
        const { data: currentCredits } = await supabase
          .from('user_credits')
          .select('balance')
          .eq('user_id', user.id)
          .single();

        const newBalance = (currentCredits?.balance || 0) + amount;

        const { error: updateError } = await supabase
          .from('user_credits')
          .update({ balance: newBalance, updated_at: new Date().toISOString() })
          .eq('user_id', user.id);

        if (updateError) throw updateError;

        const { error: transactionError } = await supabase
          .from('transactions')
          .insert({
            user_id: user.id,
            type: 'deposit',
            amount: amount,
            description: `Deposit of $${amount}`,
            status: 'completed'
          });

        if (transactionError) throw transactionError;
        return { newBalance, amount };
      }

      return { newBalance: 0, amount }; // Will be updated by query invalidation
    },
    onSuccess: (data) => {
      toast({
        title: "Deposit Successful!",
        description: `$${data.amount} has been added to your account.`,
      });
      queryClient.invalidateQueries({ queryKey: ['credits'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      queryClient.invalidateQueries({ queryKey: ['wallet-transactions'] });
    },
    onError: (error) => {
      toast({
        title: "Deposit Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const checkSufficientFunds = (betAmount: number): boolean => {
    const currentBalance = creditsQuery.data?.balance || 0;
    return currentBalance >= betAmount;
  };

  const placeBetWithFundsCheck = useMutation({
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

      const currentBalance = creditsQuery.data?.balance || 0;
      if (currentBalance < stake) {
        throw new Error(`Insufficient funds. Balance: $${currentBalance.toFixed(2)}, Required: $${stake.toFixed(2)}`);
      }

      const oddsNum = parseFloat(odds.replace(/[+]/g, ''));
      const potentialPayout = oddsNum > 0 
        ? stake * (oddsNum / 100) + stake
        : stake * (100 / Math.abs(oddsNum)) + stake;

      const { data: betData, error: betError } = await supabase
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

      if (betError) throw betError;

      // Try wallet system first
      try {
        await supabase.rpc('process_wallet_transaction', {
          p_user_id: user.id,
          p_transaction_type: 'bet_debit',
          p_amount: stake,
          p_description: `Bet placed: ${betType} on ${eventName}`
        });
      } catch (walletError) {
        // Fallback to legacy system
        const newBalance = currentBalance - stake;
        const { error: updateError } = await supabase
          .from('user_credits')
          .update({ balance: newBalance, updated_at: new Date().toISOString() })
          .eq('user_id', user.id);

        if (updateError) throw updateError;

        const { error: transactionError } = await supabase
          .from('transactions')
          .insert({
            user_id: user.id,
            type: 'bet_placed',
            amount: -stake,
            description: `Bet placed: ${betType} on ${eventName}`,
            status: 'completed'
          });

        if (transactionError) throw transactionError;
      }

      return { betData, newBalance: currentBalance - stake };
    },
    onSuccess: (data) => {
      toast({
        title: "Bet Placed Successfully!",
        description: `Your bet has been placed. New balance: $${data.newBalance.toFixed(2)}`,
      });
      queryClient.invalidateQueries({ queryKey: ['user_bets'] });
      queryClient.invalidateQueries({ queryKey: ['credits'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      queryClient.invalidateQueries({ queryKey: ['wallet-transactions'] });
    },
    onError: (error) => {
      if (error.message.includes('Insufficient funds')) {
        toast({
          title: "Insufficient Funds",
          description: error.message + ". Please deposit more funds to continue betting.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error Placing Bet",
          description: error.message,
          variant: "destructive",
        });
      }
    },
  });

  return {
    credits: creditsQuery.data,
    isLoading: creditsQuery.isLoading,
    deposit: depositMutation.mutate,
    isDepositing: depositMutation.isPending,
    placeBet: placeBetWithFundsCheck.mutate,
    isPlacingBet: placeBetWithFundsCheck.isPending,
    checkSufficientFunds,
  };
};
