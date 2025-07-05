
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const ValueBetsSkeletonGrid = () => {
  return (
    <div className="p-3 bg-transparent">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3">
        {Array.from({ length: 12 }).map((_, index) => (
          <div
            key={index}
            className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-lg p-4 space-y-3"
          >
            {/* Event header */}
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-20 bg-slate-800/50" />
              <Skeleton className="h-3 w-12 bg-slate-800/50" />
            </div>
            
            {/* Teams */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-3/4 bg-slate-800/50" />
              <Skeleton className="h-5 w-2/3 bg-slate-800/50" />
            </div>
            
            {/* Odds and value */}
            <div className="flex items-center justify-between pt-2">
              <div className="space-y-1">
                <Skeleton className="h-4 w-16 bg-slate-800/50" />
                <Skeleton className="h-3 w-12 bg-slate-800/50" />
              </div>
              <div className="text-right space-y-1">
                <Skeleton className="h-5 w-14 bg-slate-800/50" />
                <Skeleton className="h-3 w-10 bg-slate-800/50" />
              </div>
            </div>
            
            {/* Action button */}
            <Skeleton className="h-8 w-full bg-slate-800/50 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ValueBetsSkeletonGrid;
