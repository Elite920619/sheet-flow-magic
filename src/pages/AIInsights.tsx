
import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import CanvasBackground from "@/components/CanvasBackground";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Brain,
  TrendingUp,
  Target,
  Zap,
  Trophy,
  AlertTriangle,
  CheckCircle,
  Clock,
  Star,
  Activity,
  RefreshCw,
  Eye,
} from "lucide-react";

const AIInsights = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const handleRefreshInsights = async () => {
    setIsAnalyzing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsAnalyzing(false);
    setLastUpdated(new Date());
  };

  const aiInsights = [
    {
      id: 1,
      type: "opportunity",
      priority: "high",
      title: "NBA Over/Under Value Detected",
      description: "Lakers vs Warriors total points showing 8.2% edge over market odds",
      confidence: 87,
      expectedValue: "+$45",
      timeLeft: "2h 30m",
      icon: <Target className="h-4 w-4" />,
    },
    {
      id: 2,
      type: "warning",
      priority: "medium",
      title: "Betting Pattern Alert",
      description: "You've been favoring home teams 73% of the time this week",
      confidence: 92,
      recommendation: "Consider analyzing away team value",
      icon: <AlertTriangle className="h-4 w-4" />,
    },
    {
      id: 3,
      type: "success",
      priority: "low",
      title: "Model Performance Update",
      description: "Your NBA predictions are outperforming the market by 12%",
      confidence: 94,
      streak: "7 wins",
      icon: <CheckCircle className="h-4 w-4" />,
    },
    {
      id: 4,
      type: "opportunity",
      priority: "high",
      title: "Live Arbitrage Opportunity",
      description: "NFL spread arbitrage detected across 3 sportsbooks",
      confidence: 96,
      expectedValue: "+$78",
      timeLeft: "45m",
      icon: <Zap className="h-4 w-4" />,
    },
  ];

  const modelPerformance = [
    { sport: "NBA", accuracy: 78, profit: 1240, trend: "up" },
    { sport: "NFL", accuracy: 71, profit: 980, trend: "up" },
    { sport: "MLB", accuracy: 69, profit: 650, trend: "down" },
    { sport: "NHL", accuracy: 74, profit: 820, trend: "up" },
  ];

  const marketTrends = [
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
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "opportunity":
        return "border-green-400 bg-green-400/10";
      case "warning":
        return "border-yellow-400 bg-yellow-400/10";
      case "success":
        return "border-blue-400 bg-blue-400/10";
      default:
        return "border-gray-400 bg-gray-400/10";
    }
  };

  return (
    <div className="h-screen bg-transparent text-foreground relative overflow-hidden">
      <CanvasBackground />
      <Header />

      <div className="relative z-10 max-w-12xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh-4rem)] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Brain className="h-6 w-6 text-blue-400" />
            <div>
              <h1 className="text-2xl font-bold text-slate-200">AI Insights</h1>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Badge className="bg-gradient-to-r from-green-400 to-green-500 text-white px-2 py-1 text-xs">
              <Activity className="h-3 w-3 mr-1" />
              Live Analysis
            </Badge>
            <Button
              onClick={handleRefreshInsights}
              disabled={isAnalyzing}
              size="sm"
              className="bg-blue-500 hover:bg-blue-600 text-white h-7 text-xs px-2"
            >
              <RefreshCw
                className={`h-3 w-3 mr-1 ${isAnalyzing ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </div>

        {/* AI Performance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Brain className="h-4 w-4 text-blue-400 mr-2" />
                <div className="text-xl font-bold text-blue-400">94.2%</div>
              </div>
              <div className="text-slate-400 text-xs">Model Accuracy</div>
              <Progress value={94.2} className="h-1.5 mt-2 bg-slate-800" />
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Target className="h-4 w-4 text-green-400 mr-2" />
                <div className="text-xl font-bold text-green-400">23</div>
              </div>
              <div className="text-slate-400 text-xs">Active Opportunities</div>
              <Progress value={78} className="h-1.5 mt-2 bg-slate-800" />
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Trophy className="h-4 w-4 text-yellow-400 mr-2" />
                <div className="text-xl font-bold text-yellow-400">87%</div>
              </div>
              <div className="text-slate-400 text-xs">Win Rate (7 days)</div>
              <Progress value={87} className="h-1.5 mt-2 bg-slate-800" />
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Zap className="h-4 w-4 text-purple-400 mr-2" />
                <div className="text-xl font-bold text-purple-400">1.2s</div>
              </div>
              <div className="text-slate-400 text-xs">Analysis Speed</div>
              <Progress value={95} className="h-1.5 mt-2 bg-slate-800" />
            </CardContent>
          </Card>
        </div>

        {/* Main Content - Three sections in one row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
          {/* Live AI Insights */}
          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50 flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-slate-200 text-base">
                <div className="flex items-center">
                  <Eye className="mr-2 h-4 w-4 text-blue-400" />
                  Live AI Insights
                </div>
                <Badge className="text-xs px-1.5 py-0.5 bg-slate-700/50 text-slate-300">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 min-h-0">
              <ScrollArea className="h-full pr-3">
                <div className="space-y-3">
                  {aiInsights.map((insight) => (
                    <div
                      key={insight.id}
                      className={`p-3 rounded-lg border ${getTypeColor(
                        insight.type
                      )} transition-all hover:shadow-md`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className="text-slate-200">{insight.icon}</div>
                          <div>
                            <h4 className="font-semibold text-slate-200 text-sm">
                              {insight.title}
                            </h4>
                            <div className="flex items-center space-x-2 mt-1">
                              <div
                                className={`w-2 h-2 rounded-full ${getPriorityColor(
                                  insight.priority
                                )}`}
                              ></div>
                              <span className="text-xs text-slate-400 capitalize">
                                {insight.priority} Priority
                              </span>
                            </div>
                          </div>
                        </div>
                        <Badge className="bg-slate-700/50 text-slate-300 text-xs px-1.5 py-0.5">
                          {insight.confidence}% confident
                        </Badge>
                      </div>
                      <p className="text-slate-300 text-sm mb-2">
                        {insight.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {insight.expectedValue && (
                            <span className="text-green-400 font-medium text-xs">
                              {insight.expectedValue}
                            </span>
                          )}
                          {insight.timeLeft && (
                            <div className="flex items-center text-orange-400 text-xs">
                              <Clock className="h-3 w-3 mr-1" />
                              {insight.timeLeft}
                            </div>
                          )}
                          {insight.streak && (
                            <div className="flex items-center text-blue-400 text-xs">
                              <Star className="h-3 w-3 mr-1" />
                              {insight.streak}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Model Performance */}
          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50 flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="text-slate-200 text-base">
                Model Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="space-y-3">
                {modelPerformance.map((model) => (
                  <div
                    key={model.sport}
                    className="flex items-center justify-between p-2 bg-slate-800/30 rounded-lg"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-slate-200 text-sm">
                          {model.sport}
                        </span>
                        <TrendingUp
                          className={`h-3 w-3 ${
                            model.trend === "up"
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        />
                      </div>
                      <div className="text-xs text-slate-400">
                        {model.accuracy}% accuracy • ${model.profit} profit
                      </div>
                    </div>
                    <Progress
                      value={model.accuracy}
                      className="w-16 h-1.5 bg-slate-700"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Market Trends */}
          <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50 flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="text-slate-200 text-base">
                Market Trends
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="space-y-3">
                {marketTrends.map((trend, index) => (
                  <div
                    key={index}
                    className="p-2 bg-slate-800/30 rounded-lg border-l-2 border-blue-400"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-slate-200 text-sm">
                        {trend.title}
                      </h4>
                      <Badge
                        className={`text-xs px-1.5 py-0.5 ${
                          trend.impact === "High"
                            ? "bg-red-500/20 text-red-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        {trend.impact}
                      </Badge>
                    </div>
                    <p className="text-slate-300 text-xs mb-1">
                      {trend.description}
                    </p>
                    <div className="text-xs text-slate-400">
                      {trend.timeframe}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AIInsights;
