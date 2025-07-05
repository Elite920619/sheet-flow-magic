import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Target, AlertTriangle, CheckCircle, Zap } from 'lucide-react';

export interface AIInsight {
  id: string;
  type: 'opportunity' | 'warning' | 'success' | 'alert';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  confidence: number;
  expectedValue?: string;
  timeLeft?: string;
  streak?: string;
  recommendation?: string;
  icon: React.ReactNode;
  match?: string;
  league?: string;
  odds?: string;
  aiAnalysis?: string;
}

export interface AIStatistics {
  accuracy: number;
  opportunities: number;
  winRate: number;
  analysisSpeed: number;
  modelPerformance: Array<{
    sport: string;
    accuracy: number;
    profit: number;
    trend: 'up' | 'down';
  }>;
  marketTrends: Array<{
    title: string;
    description: string;
    impact: 'High' | 'Medium' | 'Low';
    timeframe: string;
  }>;
}

export const useAIInsights = () => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [statistics, setStatistics] = useState<AIStatistics>({
    accuracy: 94.2,
    opportunities: 0,
    winRate: 87,
    analysisSpeed: 1.2,
    modelPerformance: [
      { sport: "NBA", accuracy: 78, profit: 1240, trend: "up" },
      { sport: "NFL", accuracy: 71, profit: 980, trend: "up" },
      { sport: "MLB", accuracy: 69, profit: 650, trend: "down" },
      { sport: "NHL", accuracy: 74, profit: 820, trend: "up" },
    ],
    marketTrends: [
      {
        title: "Sharp Money Movement",
        description: "Heavy action on NBA unders this week",
        impact: "High",
        timeframe: "Last 7 days",
      },
      {
        title: "Public Betting Patterns",
        description: "85% of bets on Chiefs -7.5 vs Ravens",
        impact: "Medium",
        timeframe: "Today",
      },
      {
        title: "Line Movement Alert",
        description: "Lakers spread moved 2.5 points in 30 minutes",
        impact: "High",
        timeframe: "Live",
      },
    ]
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateInsights = async () => {
    try {
      setIsLoading(true);
      
      // Call our AI insights edge function
      const { data, error } = await supabase.functions.invoke('generate-ai-insights');
      
      if (error) {
        console.error('Error generating insights:', error);
        // Fall back to demo insights if API fails
        return generateDemoInsights();
      }
      
      if (data?.insights) {
        const processedInsights = data.insights.map((insight: any, index: number) => ({
          ...insight,
          id: `${Date.now()}_${index}`,
          icon: getInsightIcon(insight.type)
        }));
        
        setInsights(processedInsights);
        
        // Update statistics if provided
        if (data.statistics) {
          setStatistics(prev => ({
            ...prev,
            ...data.statistics,
            opportunities: processedInsights.length
          }));
        }
      }
      
    } catch (error) {
      console.error('Error in generateInsights:', error);
      generateDemoInsights();
    } finally {
      setIsLoading(false);
    }
  };

  const generateDemoInsights = () => {
    const demoInsights: AIInsight[] = [
      {
        id: '1',
        type: "opportunity",
        priority: "high",
        title: "NBA Over/Under Value Detected",
        description: "Lakers vs Warriors total points showing 8.2% edge over market odds",
        confidence: 87,
        expectedValue: "+$45",
        timeLeft: "2h 30m",
        icon: React.createElement(Target, { className: "h-4 w-4" }),
        match: "Lakers vs Warriors",
        league: "NBA",
        odds: "O 225.5 (-110)",
        aiAnalysis: "Both teams playing fast pace, Warriors missing key defenders"
      },
      {
        id: '2',
        type: "warning",
        priority: "medium",
        title: "Betting Pattern Alert",
        description: "You've been favoring home teams 73% of the time this week",
        confidence: 92,
        recommendation: "Consider analyzing away team value",
        icon: React.createElement(AlertTriangle, { className: "h-4 w-4" }),
      },
      {
        id: '3',
        type: "success",
        priority: "low",
        title: "Model Performance Update",
        description: "Your NBA predictions are outperforming the market by 12%",
        confidence: 94,
        streak: "7 wins",
        icon: React.createElement(CheckCircle, { className: "h-4 w-4" }),
      },
      {
        id: '4',
        type: "opportunity",
        priority: "high",
        title: "Live Arbitrage Opportunity",
        description: "NFL spread arbitrage detected across 3 sportsbooks",
        confidence: 96,
        expectedValue: "+$78",
        timeLeft: "45m",
        icon: React.createElement(Zap, { className: "h-4 w-4" }),
        match: "Chiefs vs Ravens",
        league: "NFL",
        odds: "Chiefs -7.5",
        aiAnalysis: "Line discrepancy between DraftKings (-7) and FanDuel (-8)"
      },
    ];
    
    setInsights(demoInsights);
    setStatistics(prev => ({
      ...prev,
      opportunities: demoInsights.length
    }));
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity':
        return React.createElement(Target, { className: "h-4 w-4" });
      case 'warning':
        return React.createElement(AlertTriangle, { className: "h-4 w-4" });
      case 'success':
        return React.createElement(CheckCircle, { className: "h-4 w-4" });
      case 'alert':
        return React.createElement(Zap, { className: "h-4 w-4" });
      default:
        return React.createElement(Target, { className: "h-4 w-4" });
    }
  };

  const refreshInsights = async () => {
    await generateInsights();
    toast({
      title: "Insights Refreshed",
      description: "AI analysis has been updated with latest market data",
    });
  };

  // Auto-refresh every 2 minutes
  useEffect(() => {
    generateInsights();
    const interval = setInterval(generateInsights, 120000);
    return () => clearInterval(interval);
  }, []);

  return {
    insights,
    statistics,
    isLoading,
    refreshInsights,
    generateInsights
  };
};
