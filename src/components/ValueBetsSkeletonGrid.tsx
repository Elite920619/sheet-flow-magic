
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

const ValueBetsSkeletonGrid = () => {
  return (
    <div className="h-full p-3">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 auto-rows-max">
        {[...Array(6)].map((_, index) => (
          <Card key={index} className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50 shadow-sm">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <Skeleton className="h-3 w-12 bg-slate-700" />
                <Skeleton className="h-5 w-16 bg-slate-700" />
              </div>
              
              <Skeleton className="h-4 w-3/4 mb-1 bg-slate-700" />
              <Skeleton className="h-3 w-1/2 mb-3 bg-slate-700" />
              
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="text-center">
                  <Skeleton className="h-3 w-8 mx-auto mb-1 bg-slate-700" />
                  <Skeleton className="h-2 w-12 mx-auto bg-slate-700" />
                </div>
                <div className="text-center">
                  <Skeleton className="h-3 w-8 mx-auto mb-1 bg-slate-700" />
                  <Skeleton className="h-2 w-12 mx-auto bg-slate-700" />
                </div>
                <div className="text-center">
                  <Skeleton className="h-3 w-8 mx-auto mb-1 bg-slate-700" />
                  <Skeleton className="h-2 w-12 mx-auto bg-slate-700" />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-16 bg-slate-700" />
                <Skeleton className="h-6 w-20 bg-slate-700" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ValueBetsSkeletonGrid;
