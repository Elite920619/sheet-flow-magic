
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Brain } from 'lucide-react';

interface ValueBetsInputFormProps {
  selectedSport: string;
  bookmakerOdds: string;
  estimatedWinPercent: string;
  isAnalyzing: boolean;
  onSportChange: (value: string) => void;
  onOddsChange: (value: string) => void;
  onWinPercentChange: (value: string) => void;
  onAnalyze: () => void;
  onReset: () => void;
}

const ValueBetsInputForm = ({ 
  bookmakerOdds, 
  estimatedWinPercent, 
  isAnalyzing,
  onOddsChange,
  onWinPercentChange,
  onAnalyze,
  onReset
}: ValueBetsInputFormProps) => {
  return (
    <div className="p-3 bg-slate-900/50 backdrop-blur-sm border-b border-slate-800/50">
      <div className="flex items-center mb-3">
        <Brain className="h-4 w-4 text-blue-400 mr-2" />
        <h3 className="text-base font-semibold text-slate-200">Find Value Bets Across All Sports & Regions</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
        <div>
          <Label htmlFor="odds" className="text-slate-300 text-xs">Target Bookmaker Odds</Label>
          <Input
            id="odds"
            value={bookmakerOdds}
            onChange={(e) => onOddsChange(e.target.value)}
            placeholder="e.g., 2.2, 1.85, 3.5"
            className="bg-slate-800/50 border-slate-700/50 text-slate-200 text-xs h-8"
          />
        </div>
        
        <div>
          <Label htmlFor="winPercent" className="text-slate-300 text-xs">Your Estimated Win %</Label>
          <Input
            id="winPercent"
            type="number"
            min="0"
            max="100"
            value={estimatedWinPercent}
            onChange={(e) => onWinPercentChange(e.target.value)}
            placeholder="e.g., 65"
            className="bg-slate-800/50 border-slate-700/50 text-slate-200 text-xs h-8"
          />
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={onAnalyze}
            disabled={isAnalyzing || !bookmakerOdds || !estimatedWinPercent}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white flex-1 h-8 text-xs"
          >
            {isAnalyzing ? 'Analyzing...' : 'Find Value Bets'}
          </Button>
          <Button onClick={onReset} variant="outline" className="border-slate-700/50 text-slate-300 hover:bg-slate-800/50 h-8 text-xs px-3">
            Reset
          </Button>
        </div>
      </div>
      
      {isAnalyzing && (
        <div className="mt-3 p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <div className="flex items-center space-x-2 text-blue-400">
            <div className="animate-spin rounded-full h-3 w-3 border-2 border-blue-500 border-t-transparent"></div>
            <span className="text-xs font-medium">Scanning all sports and regions for value bets...</span>
          </div>
          <p className="text-xs text-blue-400/80 mt-1">This may take 1-2 minutes due to API rate limits</p>
        </div>
      )}
    </div>
  );
};

export default ValueBetsInputForm;
