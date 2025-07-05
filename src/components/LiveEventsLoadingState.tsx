
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const LiveEventsLoadingState: React.FC = () => {
  return (
    <div className="p-3 space-y-4 bg-transparent">
      {/* Header Skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-6 w-32 bg-slate-800/50" />
        <div className="flex gap-3">
          <Skeleton className="h-12 w-24 bg-slate-800/50" />
          <Skeleton className="h-12 w-24 bg-slate-800/50" />
          <Skeleton className="h-12 w-24 bg-slate-800/50" />
        </div>
      </div>

      {/* Cards Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-lg p-3 space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-20 bg-slate-800/50" />
              <Skeleton className="h-4 w-12 bg-slate-800/50" />
            </div>
            
            {/* Teams */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-6 w-6 rounded-full bg-slate-800/50" />
                  <Skeleton className="h-4 w-20 bg-slate-800/50" />
                </div>
                <Skeleton className="h-5 w-6 bg-slate-800/50" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-6 w-6 rounded-full bg-slate-800/50" />
                  <Skeleton className="h-4 w-20 bg-slate-800/50" />
                </div>
                <Skeleton className="h-5 w-6 bg-slate-800/50" />
              </div>
            </div>

            {/* Game Info */}
            <div className="flex justify-between items-center">
              <Skeleton className="h-3 w-12 bg-slate-800/50" />
              <Skeleton className="h-3 w-16 bg-slate-800/50" />
            </div>

            {/* Betting Options */}
            <div className="grid grid-cols-2 gap-2">
              <Skeleton className="h-6 w-full bg-slate-800/50" />
              <Skeleton className="h-6 w-full bg-slate-800/50" />
            </div>

            {/* Analysis */}
            <div className="bg-slate-950/30 rounded-lg p-2 space-y-2">
              <Skeleton className="h-3 w-16 bg-slate-800/50" />
              <Skeleton className="h-2 w-full bg-slate-800/50" />
              <Skeleton className="h-2 w-3/4 bg-slate-800/50" />
            </div>
          </div>
        ))}
      </div>

      {/* Loading Text */}
      <div className="text-center py-6">
        <div className="animate-spin rounded-full h-6 w-6 border-4 border-blue-500 border-t-transparent mx-auto mb-3"></div>
        <p className="text-slate-300 font-medium text-sm">Fetching and filtering live events from multiple regions...</p>
        <p className="text-xs text-slate-400 mt-2">Applying comprehensive validation to remove placeholder data</p>
        <div className="mt-3 max-w-md mx-auto">
          <div className="bg-slate-800 rounded-full h-1.5">
            <div className="bg-blue-500 h-1.5 rounded-full animate-pulse" style={{ width: '65%' }}></div>
          </div>
          <p className="text-xs text-slate-400 mt-2">Filtering real events with actual betting odds...</p>
        </div>
      </div>
    </div>
  );
};

export default LiveEventsLoadingState;
