
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface UserVerification {
  id: string;
  user_id: string;
  kyc_status: 'pending' | 'verified' | 'rejected' | 'expired';
  identity_verified: boolean;
  address_verified: boolean;
  phone_verified: boolean;
  email_verified: boolean;
  verification_level: number;
  daily_limit: number;
  monthly_limit: number;
  documents_uploaded: any[];
  verification_notes?: string;
  verified_at?: string;
  verified_by?: string;
  created_at: string;
  updated_at: string;
}

export const useKYC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const kycQuery = useQuery({
    queryKey: ['kyc', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('No user');
      
      const { data, error } = await supabase
        .from('user_verification')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data as UserVerification | null;
    },
    enabled: !!user?.id,
  });

  const updateKYCMutation = useMutation({
    mutationFn: async (updates: Partial<UserVerification>) => {
      if (!user?.id) throw new Error('No user');
      
      const { data, error } = await supabase
        .from('user_verification')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Verification Updated",
        description: "Your verification information has been updated.",
      });
      queryClient.invalidateQueries({ queryKey: ['kyc'] });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    kyc: kycQuery.data,
    isLoading: kycQuery.isLoading,
    updateKYC: updateKYCMutation.mutate,
    isUpdating: updateKYCMutation.isPending,
  };
};
