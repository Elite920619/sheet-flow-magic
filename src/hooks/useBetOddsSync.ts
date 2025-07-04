
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { oddsService } from '@/services/oddsService';
import { useAuth } from '@/contexts/AuthContext';

export const useBetOddsSync = () => {
  const { user } = useAuth();
  const [lastSync, setLastSync] = useState(new Date());

  // Fetch user's bets
  const { data: userBets, refetch: refetchBets } = useQuery({
    queryKey: ['user-bets', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('user_bets')
        .select('*')
        .eq('user_id', user.id)
        .order('placed_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch live odds data
  const { data: liveOdds } = useQuery({
    queryKey: ['live-odds-sync', lastSync],
    queryFn: async () => {
      try {
        const [liveEvents, upcomingGames] = await Promise.all([
          oddsService.fetchLiveEvents(),
          oddsService.fetchUpcomingOdds()
        ]);
        return [...liveEvents, ...upcomingGames];
      } catch (error) {
        console.error('Error fetching odds for bet sync:', error);
        return [];
      }
    },
    refetchInterval: 30000,
  });

  // Sync bet data with live odds
  const syncBetData = async () => {
    if (!userBets || !liveOdds || userBets.length === 0) return;

    console.log('Syncing bet data with live odds...');
    
    try {
      for (const bet of userBets) {
        // Find matching event in live odds using real team names
        const matchingEvent = liveOdds.find(event => {
          const betEventName = bet.event_name.toLowerCase();
          const betTeams = bet.teams?.toLowerCase() || '';
          
          // Check if bet event contains the actual team names
          const homeTeam = (event.homeTeam || '').toLowerCase();
          const awayTeam = (event.awayTeam || '').toLowerCase();
          
          // Match by team names in event name or teams field
          const nameMatch = (betEventName.includes(homeTeam) && betEventName.includes(awayTeam)) ||
                           (betTeams.includes(homeTeam) && betTeams.includes(awayTeam));
          
          // Also try to match by league to ensure accuracy
          const leagueMatch = bet.league?.toLowerCase() === event.league?.toLowerCase();
          
          return nameMatch && (leagueMatch || !bet.league);
        });

        if (matchingEvent) {
          // Update bet with current odds and scores
          const updateData: any = {};
          
          // Update current odds if available
          if (matchingEvent.moneylineHome || matchingEvent.moneyline?.home) {
            updateData.current_odds = JSON.stringify({
              home: matchingEvent.moneylineHome || matchingEvent.moneyline?.home,
              away: matchingEvent.moneylineAway || matchingEvent.moneyline?.away,
              lastUpdated: new Date().toISOString()
            });
          }

          // Update scores if it's a live event
          if (matchingEvent.homeScore !== undefined && matchingEvent.awayScore !== undefined) {
            updateData.live_scores = JSON.stringify({
              home: matchingEvent.homeScore,
              away: matchingEvent.awayScore,
              homeTeam: matchingEvent.homeTeam,
              awayTeam: matchingEvent.awayTeam,
              timeLeft: matchingEvent.timeLeft,
              quarter: matchingEvent.quarter,
              lastUpdated: new Date().toISOString()
            });
          }

          // Check if bet should be settled
          if (matchingEvent.betStatus === 'Completed' && bet.status === 'pending') {
            const betOutcome = determineBetOutcome(bet, matchingEvent);
            if (betOutcome) {
              updateData.status = betOutcome.status;
              updateData.settled_at = new Date().toISOString();
              
              // Process payout if won
              if (betOutcome.status === 'won') {
                await supabase.rpc('process_wallet_transaction', {
                  p_user_id: user.id,
                  p_transaction_type: 'bet_credit',
                  p_amount: bet.potential_payout,
                  p_description: `Bet payout - ${bet.event_name}`
                });
              }
            }
          }

          // Update team names if they're more detailed in the live data
          if (matchingEvent.homeTeam && matchingEvent.awayTeam) {
            updateData.teams = `${matchingEvent.awayTeam} @ ${matchingEvent.homeTeam}`;
          }

          // Update the bet if there are changes
          if (Object.keys(updateData).length > 0) {
            await supabase
              .from('user_bets')
              .update(updateData)
              .eq('id', bet.id);
          }
        }
      }
      
      // Refresh bets after sync
      refetchBets();
    } catch (error) {
      console.error('Error syncing bet data:', error);
    }
  };

  const determineBetOutcome = (bet: any, event: any) => {
    if (!event.homeScore && !event.awayScore) return null;
    
    const homeScore = event.homeScore || 0;
    const awayScore = event.awayScore || 0;
    
    if (bet.bet_type === 'Moneyline') {
      // Parse bet selection from event name or bet type details
      const betTeams = bet.teams || bet.event_name;
      const selectedHome = betTeams.includes(event.homeTeam);
      const selectedAway = betTeams.includes(event.awayTeam);
      
      if (selectedHome && homeScore > awayScore) {
        return { status: 'won' };
      } else if (selectedAway && awayScore > homeScore) {
        return { status: 'won' };
      } else if (homeScore === awayScore) {
        return { status: 'push' }; // Tie
      } else {
        return { status: 'lost' };
      }
    }
    
    return null;
  };

  // Auto-sync every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      syncBetData();
    }, 30000);

    // Initial sync
    syncBetData();

    return () => clearInterval(interval);
  }, [userBets, liveOdds]);

  return {
    syncBetData,
    userBets,
    liveOdds
  };
};
