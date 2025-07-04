
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
    <div className="p-4 bg-card/95 backdrop-blur-sm border-b border-border">
      <div className="flex items-center mb-4">
        <Brain className="h-5 w-5 text-blue-500 mr-2" />
        <h3 className="text-lg font-semibold text-foreground">Find Value Bets Across All Sports & Regions</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div>
          <Label htmlFor="odds">Target Bookmaker Odds</Label>
          <Input
            id="odds"
            value={bookmakerOdds}
            onChange={(e) => onOddsChange(e.target.value)}
            placeholder="e.g., 2.2, 1.85, 3.5"
          />
        </div>
        
        <div>
          <Label htmlFor="winPercent">Your Estimated Win %</Label>
          <Input
            id="winPercent"
            type="number"
            min="0"
            max="100"
            value={estimatedWinPercent}
            onChange={(e) => onWinPercentChange(e.target.value)}
            placeholder="e.g., 65"
          />
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={onAnalyze}
            disabled={isAnalyzing || !bookmakerOdds || !estimatedWinPercent}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white flex-1"
          >
            {isAnalyzing ? 'Analyzing All Sports...' : 'Find Value Bets'}
          </Button>
          <Button onClick={onReset} variant="outline">
            Reset
          </Button>
        </div>
      </div>
      
      {isAnalyzing && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2 text-blue-700">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
            <span className="text-sm font-medium">Scanning all sports and regions for value bets...</span>
          </div>
          <p className="text-xs text-blue-600 mt-2">This may take 1-2 minutes due to API rate limits</p>
        </div>
      )}
    </div>
  );
};

export default ValueBetsInputForm;
