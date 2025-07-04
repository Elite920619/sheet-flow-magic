
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const LiveEventsLoadingState: React.FC = () => {
  return (
    <div className="p-4 space-y-6">
      {/* Filtering Status Header */}
      <div className="space-y-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-4 border-blue-500 border-t-transparent"></div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
      </div>

      {/* Header Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
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
              <Skeleton className="h-5 w-16" />
            </div>
            
            {/* Teams */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-5 w-24" />
                </div>
                <Skeleton className="h-6 w-8" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-5 w-24" />
                </div>
                <Skeleton className="h-6 w-8" />
              </div>
            </div>

            {/* Game Info */}
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>

            {/* Betting Options */}
            <div className="grid grid-cols-2 gap-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>

            {/* Analysis */}
            <div className="bg-muted/20 rounded-lg p-3 space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          </div>
        ))}
      </div>

      {/* Loading Text */}
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
        <p className="text-muted-foreground font-medium">Fetching and filtering live events from multiple regions...</p>
        <p className="text-sm text-muted-foreground mt-2">Applying comprehensive validation to remove placeholder data</p>
        <div className="mt-4 max-w-md mx-auto">
          <div className="bg-gray-100 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full animate-pulse" style={{ width: '65%' }}></div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Filtering real events with actual betting odds...</p>
        </div>
      </div>
    </div>
  );
};

export default LiveEventsLoadingState;
