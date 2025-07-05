
import React, { useState } from 'react';
import Header from '@/components/Header';
import CanvasBackground from '@/components/CanvasBackground';
import ValueBetsHeader from '@/components/ValueBetsHeader';
import ValueBetsStatsCards from '@/components/ValueBetsStatsCards';
import ValueBetsInputForm from '@/components/ValueBetsInputForm';
import ValueBetsGrid from '@/components/ValueBetsGrid';
import ValueBetsEmptyState from '@/components/ValueBetsEmptyState';
import ValueBetsSkeletonGrid from '@/components/ValueBetsSkeletonGrid';
import { useValueBetAnalysis } from '@/hooks/useValueBetAnalysis';

const ValueBets = () => {
  const [selectedSport, setSelectedSport] = useState('');
  const [bookmakerOdds, setBookmakerOdds] = useState('');
  const [estimatedWinPercent, setEstimatedWinPercent] = useState('');
  const { analyzeValueBets, isAnalyzing, foundValueBets } = useValueBetAnalysis();

  const handleAnalyze = async () => {
    if (!bookmakerOdds || !estimatedWinPercent) {
      return;
    }

    const targetOdds = parseFloat(bookmakerOdds);
    const winProbability = parseFloat(estimatedWinPercent);

    await analyzeValueBets(targetOdds, winProbability);
  };

  const handleReset = () => {
    setSelectedSport('');
    setBookmakerOdds('');
    setEstimatedWinPercent('');
  };

  const highValueBets = foundValueBets.filter(bet => parseFloat(bet.value.replace('%', '').replace('+', '')) > 15).length;
  const avgConfidence = foundValueBets.length > 0 ? foundValueBets.reduce((sum, bet) => sum + parseInt(bet.confidence), 0) / foundValueBets.length : 0;

  return (
    <div className="h-screen bg-transparent text-foreground relative overflow-hidden">
      <CanvasBackground />
      <Header />
      
      <div className="relative z-10 h-[calc(100vh-4rem)] flex flex-col">
        <div className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-800/50 p-3 shadow-sm">
          <ValueBetsHeader filteredBetsCount={foundValueBets.length} />
          <ValueBetsStatsCards 
            highValueBets={highValueBets}
            avgConfidence={avgConfidence}
          />
        </div>

        <div className="flex-1 overflow-hidden">
          <ValueBetsInputForm 
            selectedSport={selectedSport}
            bookmakerOdds={bookmakerOdds}
            estimatedWinPercent={estimatedWinPercent}
            isAnalyzing={isAnalyzing}
            onSportChange={setSelectedSport}
            onOddsChange={setBookmakerOdds}
            onWinPercentChange={setEstimatedWinPercent}
            onAnalyze={handleAnalyze}
            onReset={handleReset}
          />

          {isAnalyzing ? (
            <ValueBetsSkeletonGrid />
          ) : foundValueBets.length > 0 ? (
            <ValueBetsGrid bets={foundValueBets} />
          ) : (
            <ValueBetsEmptyState />
          )}
        </div>
      </div>
    </div>
  );
};

export default ValueBets;
