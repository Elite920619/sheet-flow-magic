
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { oddsService, ProcessedGameOdds } from '@/services/oddsService';
import { aiService, ValueBetAnalysis } from '@/services/aiService';

export const useOddsData = (sport: string = 'americanfootball_nfl', autoRefresh: boolean = true) => {
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const {
    data: oddsData,
    isLoading: oddsLoading,
    error: oddsError,
    refetch: refetchOdds
  } = useQuery({
    queryKey: ['odds', sport, lastUpdate],
    queryFn: () => oddsService.fetchOdds(sport),
    staleTime: 60000, // 1 minute - odds change frequently
    refetchInterval: autoRefresh ? 300000 : false, // 5 minutes for live odds
    retry: 2, // Retry failed requests
  });

  const {
    data: aiAnalysis,
    isLoading: aiLoading,
    error: aiError
  } = useQuery({
    queryKey: ['ai-analysis', oddsData],
    queryFn: () => aiService.analyzeValueBets(oddsData || []),
    enabled: !!oddsData && oddsData.length > 0,
    staleTime: 300000, // 5 minutes for AI analysis
    retry: 1,
  });

  const refreshData = () => {
    setLastUpdate(new Date());
    refetchOdds();
  };

  // Combine odds data with AI analysis
  const enrichedGames = oddsData?.map(game => {
    const analysis = aiAnalysis?.find(a => a.gameId === game.id);
    return {
      ...game,
      analysis
    };
  });

  return {
    games: enrichedGames || [],
    isLoading: oddsLoading || aiLoading,
    error: oddsError || aiError,
    refreshData,
    lastUpdate,
    rawOddsData: oddsData
  };
};

export const useValueBets = () => {
  const { games, isLoading, error } = useOddsData();

  const valueBets = games
    .filter(game => game.analysis?.recommendations.length > 0)
    .flatMap(game => 
      game.analysis?.recommendations.map(rec => ({
        ...rec,
        gameId: game.id,
        league: game.league,
        homeTeam: game.homeTeam,
        awayTeam: game.awayTeam,
        commenceTime: game.commenceTime
      })) || []
    )
    .sort((a, b) => b.valuePercentage - a.valuePercentage);

  return {
    valueBets,
    isLoading,
    error
  };
};
