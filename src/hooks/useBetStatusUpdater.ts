
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { oddsService } from '@/services/oddsService';
import { useAuth } from '@/contexts/AuthContext';

interface BetStatusUpdate {
  betId: string;
  newStatus: 'won' | 'lost' | 'pending';
  actualPayout?: number;
}

export const useBetStatusUpdater = () => {
  const { user } = useAuth();
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Fetch user's pending bets
  const { data: pendingBets } = useQuery({
    queryKey: ['pending-bets', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('user_bets')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'pending');
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
    refetchInterval: 300000, // Check every 5 minutes
  });

  // Check bet statuses against live events
  const checkBetStatuses = async () => {
    if (!pendingBets || pendingBets.length === 0) return;

    console.log('Checking bet statuses for', pendingBets.length, 'pending bets');
    
    try {
      // Get all live events to check against
      const liveEvents = await oddsService.fetchLiveEvents();
      const updates: BetStatusUpdate[] = [];

      for (const bet of pendingBets) {
        // Find matching live event
        const matchingEvent = liveEvents.find(event => 
          bet.event_name.includes(event.homeTeam) && 
          bet.event_name.includes(event.awayTeam)
        );

        if (matchingEvent && matchingEvent.betStatus === 'Completed') {
          // Determine if bet won or lost based on the outcome
          let newStatus: 'won' | 'lost' = 'lost';
          let actualPayout = 0;

          // Simple win/loss logic based on scores
          if (bet.bet_type === 'Moneyline') {
            const selectedTeam = bet.event_name.split(' @ ')[0]; // Away team selection
            const homeTeam = matchingEvent.homeTeam;
            const awayTeam = matchingEvent.awayTeam;
            
            if (selectedTeam === homeTeam && matchingEvent.homeScore > matchingEvent.awayScore) {
              newStatus = 'won';
              actualPayout = bet.potential_payout;
            } else if (selectedTeam === awayTeam && matchingEvent.awayScore > matchingEvent.homeScore) {
              newStatus = 'won';
              actualPayout = bet.potential_payout;
            }
          }

          updates.push({
            betId: bet.id,
            newStatus,
            actualPayout
          });
        }
      }

      // Apply updates
      if (updates.length > 0) {
        await applyBetUpdates(updates);
        console.log('Applied', updates.length, 'bet status updates');
      }
    } catch (error) {
      console.error('Error checking bet statuses:', error);
    }
  };

  const applyBetUpdates = async (updates: BetStatusUpdate[]) => {
    for (const update of updates) {
      try {
        // Update bet status
        const { error: betError } = await supabase
          .from('user_bets')
          .update({
            status: update.newStatus,
            settled_at: new Date().toISOString()
          })
          .eq('id', update.betId);

        if (betError) {
          console.error('Error updating bet:', betError);
          continue;
        }

        // If won, add payout to user credits
        if (update.newStatus === 'won' && update.actualPayout && user?.id) {
          const { error: creditError } = await supabase.rpc('process_wallet_transaction', {
            p_user_id: user.id,
            p_transaction_type: 'bet_credit',
            p_amount: update.actualPayout,
            p_description: `Bet payout - ${update.betId}`
          });

          if (creditError) {
            console.error('Error processing payout:', creditError);
          }
        }
      } catch (error) {
        console.error('Error applying bet update:', error);
      }
    }
  };

  // Check bet statuses periodically
  useEffect(() => {
    const interval = setInterval(() => {
      checkBetStatuses();
    }, 300000); // Every 5 minutes

    // Initial check
    if (pendingBets && pendingBets.length > 0) {
      checkBetStatuses();
    }

    return () => clearInterval(interval);
  }, [pendingBets]);

  return {
    checkBetStatuses,
    pendingBetsCount: pendingBets?.length || 0
  };
};
