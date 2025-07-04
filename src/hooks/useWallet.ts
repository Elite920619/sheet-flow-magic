
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface WalletAccount {
  id: string;
  user_id: string;
  account_type: 'main' | 'bonus' | 'escrow';
  balance: number;
  currency: string;
  status: 'active' | 'frozen' | 'suspended' | 'closed';
  created_at: string;
  updated_at: string;
}

export interface WalletTransaction {
  id: string;
  user_id: string;
  wallet_account_id: string;
  transaction_type: 'deposit' | 'withdrawal' | 'bet_debit' | 'bet_credit' | 'bonus' | 'adjustment' | 'refund';
  amount: number;
  balance_before: number;
  balance_after: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled' | 'processing';
  payment_method?: string;
  external_reference?: string;
  description?: string;
  metadata: any;
  processed_by?: string;
  created_at: string;
  updated_at: string;
}

export const useWallet = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const walletQuery = useQuery({
    queryKey: ['wallet', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('No user');
      
      const { data, error } = await supabase
        .from('wallet_accounts')
        .select('*')
        .eq('user_id', user.id)
        .eq('account_type', 'main')
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data as WalletAccount | null;
    },
    enabled: !!user?.id,
  });

  const transactionsQuery = useQuery({
    queryKey: ['wallet-transactions', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('No user');
      
      const { data, error } = await supabase
        .from('wallet_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data as WalletTransaction[];
    },
    enabled: !!user?.id,
  });

  const depositMutation = useMutation({
    mutationFn: async ({ amount, paymentMethod, externalRef }: {
      amount: number;
      paymentMethod: string;
      externalRef?: string;
    }) => {
      if (!user?.id) throw new Error('No user');
      
      const { data, error } = await supabase.rpc('process_wallet_transaction', {
        p_user_id: user.id,
        p_transaction_type: 'deposit',
        p_amount: amount,
        p_description: `Deposit via ${paymentMethod}`,
        p_external_reference: externalRef,
        p_payment_method: paymentMethod
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      toast({
        title: "Deposit Successful!",
        description: `$${variables.amount} has been added to your wallet.`,
      });
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

  const withdrawalMutation = useMutation({
    mutationFn: async ({ amount, method, destination }: {
      amount: number;
      method: string;
      destination: any;
    }) => {
      if (!user?.id) throw new Error('No user');
      
      const { data, error } = await supabase
        .from('withdrawal_requests')
        .insert({
          user_id: user.id,
          amount,
          withdrawal_method: method,
          destination_details: destination
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      toast({
        title: "Withdrawal Request Submitted",
        description: `Your withdrawal request for $${variables.amount} is being processed.`,
      });
      queryClient.invalidateQueries({ queryKey: ['withdrawal-requests'] });
    },
    onError: (error) => {
      toast({
        title: "Withdrawal Request Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    wallet: walletQuery.data,
    transactions: transactionsQuery.data || [],
    isLoading: walletQuery.isLoading || transactionsQuery.isLoading,
    deposit: depositMutation.mutate,
    isDepositing: depositMutation.isPending,
    withdraw: withdrawalMutation.mutate,
    isWithdrawing: withdrawalMutation.isPending,
  };
};
