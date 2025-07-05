
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
import { useAIInsights } from "@/hooks/useAIInsights";

const AIInsights = () => {
  const { insights, isLoading, refreshInsights, statistics } = useAIInsights();
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const handleRefreshInsights = async () => {
    await refreshInsights();
    setLastUpdated(new Date());
  };

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
    <div className="min-h-screen bg-transparent text-foreground relative">
      <CanvasBackground />
      <Header />

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 h-screen flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-800/50 p-3 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-blue-400" />
              <h1 className="text-xl font-bold text-slate-200">AI Insights</h1>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className="bg-gradient-to-r from-green-400 to-green-500 text-white animate-pulse px-2 py-1 text-xs">
                <Activity className="h-3 w-3 mr-1" />
                Live Analysis
              </Badge>
              <Button
                onClick={handleRefreshInsights}
                disabled={isLoading}
                size="sm"
                className="bg-blue-500 hover:bg-blue-600 text-white h-7 text-xs px-2"
              >
                <RefreshCw
                  className={`h-3 w-3 mr-1 ${isLoading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
            </div>
          </div>

          {/* AI Performance Overview */}
          <div className="grid grid-cols-4 gap-3">
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
              <CardContent className="p-2.5 text-center">
                <div className="flex items-center justify-center mb-1">
                  <Brain className="h-3 w-3 text-blue-400 mr-1.5" />
                  <div className="text-base font-bold text-blue-400">{statistics.accuracy}%</div>
                </div>
                <div className="text-blue-400 text-xs">Model Accuracy</div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
              <CardContent className="p-2.5 text-center">
                <div className="flex items-center justify-center mb-1">
                  <Target className="h-3 w-3 text-green-400 mr-1.5" />
                  <div className="text-base font-bold text-green-400">{statistics.opportunities}</div>
                </div>
                <div className="text-green-400 text-xs">Active Opportunities</div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
              <CardContent className="p-2.5 text-center">
                <div className="flex items-center justify-center mb-1">
                  <Trophy className="h-3 w-3 text-yellow-400 mr-1.5" />
                  <div className="text-base font-bold text-yellow-400">{statistics.winRate}%</div>
                </div>
                <div className="text-yellow-400 text-xs">Win Rate (7 days)</div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
              <CardContent className="p-2.5 text-center">
                <div className="flex items-center justify-center mb-1">
                  <Zap className="h-3 w-3 text-purple-400 mr-1.5" />
                  <div className="text-base font-bold text-purple-400">{statistics.analysisSpeed}s</div>
                </div>
                <div className="text-purple-400 text-xs">Analysis Speed</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content - Fixed Height */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
          {/* AI Insights Feed */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50 h-full flex flex-col">
              <CardHeader className="pb-3 flex-shrink-0">
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
              <CardContent className="flex-1 overflow-hidden">
                <ScrollArea className="h-full pr-3">
                  <div className="space-y-3">
                    {insights.map((insight) => (
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
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6 overflow-y-auto">
            {/* Model Performance */}
            <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-slate-200 text-base">
                  Model Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {statistics.modelPerformance.map((model) => (
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
            <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-slate-200 text-base">
                  Market Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {statistics.marketTrends.map((trend, index) => (
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
    </div>
  );
};

export default AIInsights;
