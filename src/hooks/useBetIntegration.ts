
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useEnhancedCredits } from '@/hooks/useEnhancedCredits';
import { useToast } from '@/hooks/use-toast';

export const useBetIntegration = () => {
  const [isPlacing, setIsPlacing] = useState(false);
  const { checkSufficientFunds, placeBet: placeBetWithCredits } = useEnhancedCredits();
  const { toast } = useToast();

  const placeBet = async (betData: {
    event: string;
    league: string;
    team1: string;
    team2: string;
    betType: string;
    odds: string;
    stake: number;
    potentialPayout: number;
    sportsbook?: string;
  }) => {
    try {
      setIsPlacing(true);

      // Check if user has sufficient funds
      if (!checkSufficientFunds(betData.stake)) {
        toast({
          title: "Insufficient Funds",
          description: "You don't have enough balance to place this bet.",
          variant: "destructive",
        });
        return false;
      }

      // Use the enhanced credits placeBet method which handles wallet transactions
      placeBetWithCredits({
        eventName: betData.event,
        betType: betData.betType,
        odds: betData.odds,
        stake: betData.stake,
        league: betData.league,
        teams: `${betData.team1} vs ${betData.team2}`,
        sportsbook: betData.sportsbook || 'DraftKings'
      });

      return true;

    } catch (error: any) {
      console.error('Error placing bet:', error);
      toast({
        title: "Bet Placement Failed",
        description: error.message || "An error occurred while placing the bet",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsPlacing(false);
    }
  };

  return {
    placeBet,
    isPlacing
  };
};
