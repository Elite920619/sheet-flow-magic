
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Target, Zap } from "lucide-react";

interface ValueBetsStatsCardsProps {
  highValueBets: number;
  avgConfidence: number;
}

const ValueBetsStatsCards = ({
  highValueBets,
  avgConfidence,
}: ValueBetsStatsCardsProps) => {
  return (
    <div className="grid grid-cols-3 gap-3">
      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 hover:shadow-lg transition-shadow">
        <CardContent className="p-2.5 text-center">
          <div className="flex items-center justify-center mb-1">
            <Star className="h-3 w-3 text-emerald-400 mr-1.5" />
            <div className="text-base font-bold text-emerald-400">{highValueBets}</div>
          </div>
          <div className="text-emerald-400 text-xs">High Value Bets</div>
        </CardContent>
      </Card>
      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 hover:shadow-lg transition-shadow">
        <CardContent className="p-2.5 text-center">
          <div className="flex items-center justify-center mb-1">
            <Target className="h-3 w-3 text-orange-400 mr-1.5" />
            <div className="text-base font-bold text-orange-400">
              {avgConfidence.toFixed(1)}%
            </div>
          </div>
          <div className="text-orange-400 text-xs">Avg Confidence</div>
        </CardContent>
      </Card>
      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 hover:shadow-lg transition-shadow">
        <CardContent className="p-2.5 text-center">
          <div className="flex items-center justify-center mb-1">
            <Zap className="h-3 w-3 text-blue-400 mr-1.5" />
            <div className="text-base font-bold text-blue-400">1.8s</div>
          </div>
          <div className="text-blue-400 text-xs">Analysis Speed</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ValueBetsStatsCards;
