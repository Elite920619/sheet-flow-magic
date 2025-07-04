
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const UpcomingEventsLoadingState: React.FC = () => {
  return (
    <div className="p-4 space-y-6">
      {/* Loading Status Header */}
      <div className="space-y-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-4 border-blue-500 border-t-transparent"></div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-72" />
            <Skeleton className="h-4 w-56" />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="text-xs text-blue-700 font-medium">Fetching Process:</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Getting available sports</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              <span>Fetching from all regions</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>Filtering upcoming games</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span>Validating bookmaker odds</span>
            </div>
          </div>
        </div>
      </div>

      {/* Header Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-8 w-56" />
        <div className="flex gap-4">
          <Skeleton className="h-16 w-32" />
          <Skeleton className="h-16 w-32" />
          <Skeleton className="h-16 w-32" />
        </div>
      </div>

      {/* Cards Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-card/80 backdrop-blur-sm border border-border rounded-lg p-4 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-5 w-12" />
            </div>
            
            {/* Teams */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-5 w-28" />
                </div>
                <Skeleton className="h-6 w-16" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-5 w-28" />
                </div>
                <Skeleton className="h-6 w-16" />
              </div>
            </div>

            {/* Game Info */}
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>

            {/* Betting Options */}
            <div className="grid grid-cols-2 gap-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>

            {/* Analysis */}
            <div className="bg-muted/20 rounded-lg p-3 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          </div>
        ))}
      </div>

      {/* Loading Text */}
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
        <p className="text-muted-foreground font-medium">Fetching upcoming games from all sports and regions...</p>
        <p className="text-sm text-muted-foreground mt-2">Applying rate limiting to stay within API quota</p>
        <div className="mt-4 max-w-md mx-auto">
          <div className="bg-gray-100 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full animate-pulse" style={{ width: '45%' }}></div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Processing sports leagues and regions...</p>
        </div>
      </div>
    </div>
  );
};

export default UpcomingEventsLoadingState;
