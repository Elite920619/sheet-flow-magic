
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { oddsService } from '@/services/oddsService';

export const useUpcomingOdds = (autoRefresh: boolean = true) => {
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const {
    data: upcomingOdds,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['upcoming-odds', lastUpdate],
    queryFn: () => oddsService.fetchUpcomingOdds(),
    staleTime: 300000, // 5 minutes
    refetchInterval: autoRefresh ? 600000 : false, // 10 minutes for upcoming odds
    retry: 2,
  });

  const refreshData = () => {
    setLastUpdate(new Date());
    refetch();
  };

  const getOddsDifferencePercentage = (game: any) => {
    if (!game.bestHomeOdds || !game.worstHomeOdds) return 0;
    
    const bestOdds = game.bestHomeOdds.odds;
    const worstOdds = game.worstHomeOdds.odds;
    
    if (bestOdds > 0 && worstOdds > 0) {
      return ((bestOdds - worstOdds) / worstOdds) * 100;
    } else if (bestOdds < 0 && worstOdds < 0) {
      return ((Math.abs(worstOdds) - Math.abs(bestOdds)) / Math.abs(worstOdds)) * 100;
    }
    
    return 0;
  };

  const formatOdds = (odds: number) => {
    return odds > 0 ? `+${odds}` : `${odds}`;
  };

  const formatTimeTillStart = (commenceTime: string) => {
    const now = new Date();
    const gameTime = new Date(commenceTime);
    const diffHours = (gameTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (diffHours < 1) {
      return `${Math.round(diffHours * 60)}m`;
    } else if (diffHours < 24) {
      return `${Math.round(diffHours)}h`;
    } else {
      return `${Math.round(diffHours / 24)}d`;
    }
  };

  return {
    upcomingOdds: upcomingOdds || [],
    isLoading,
    error,
    refreshData,
    lastUpdate,
    getOddsDifferencePercentage,
    formatOdds,
    formatTimeTillStart
  };
};
