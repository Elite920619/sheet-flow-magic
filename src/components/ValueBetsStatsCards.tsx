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
    <div className="grid grid-cols-3 gap-4">
      {" "}
      <Card className="bg-card/80 backdrop-blur-sm border-border hover:shadow-lg transition-shadow">
        <CardContent className="p-3 text-center">
          <div className="flex items-center justify-center mb-1">
            <Star className="h-4 w-4 text-emerald-500 mr-2" />
            <div className="text-lg font-bold text-emerald-500">{highValueBets}</div>
          </div>
          <div className="text-emerald-500 text-xs">High Value Bets</div>
        </CardContent>
      </Card>
      <Card className="bg-card/80 backdrop-blur-sm border-border hover:shadow-lg transition-shadow">        <CardContent className="p-3 text-center">
          <div className="flex items-center justify-center mb-1">
            <Target className="h-4 w-4 text-orange-500 mr-2" />
            <div className="text-lg font-bold text-orange-500">
              {avgConfidence.toFixed(1)}%
            </div>
          </div>
          <div className="text-orange-500 text-xs">Avg Confidence</div>
        </CardContent>
      </Card>
      <Card className="bg-card/80 backdrop-blur-sm border-border hover:shadow-lg transition-shadow">
        <CardContent className="p-3 text-center">
          <div className="flex items-center justify-center mb-1">
            <Zap className="h-4 w-4 text-blue-500 mr-2" />
            <div className="text-lg font-bold text-blue-500">1.8s</div>
          </div>
          <div className="text-blue-500 text-xs">Analysis Speed</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ValueBetsStatsCards;
