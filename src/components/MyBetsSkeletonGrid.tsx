
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

const MyBetsSkeletonGrid = () => {
  return (
    <div className="h-full p-4">
      <div className="space-y-4">
        {[...Array(8)].map((_, index) => (
          <Card key={index} className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-5 w-16 bg-slate-700" />
                  <Skeleton className="h-4 w-20 bg-slate-700" />
                </div>
                <Skeleton className="h-6 w-16 bg-slate-700" />
              </div>
              
              <div className="mb-3">
                <Skeleton className="h-5 w-3/4 mb-2 bg-slate-700" />
                <Skeleton className="h-4 w-1/2 bg-slate-700" />
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4">
                  <div>
                    <Skeleton className="h-3 w-12 mb-1 bg-slate-700" />
                    <Skeleton className="h-4 w-16 bg-slate-700" />
                  </div>
                  <div>
                    <Skeleton className="h-3 w-16 mb-1 bg-slate-700" />
                    <Skeleton className="h-4 w-20 bg-slate-700" />
                  </div>
                </div>
                <Skeleton className="h-4 w-20 bg-slate-700" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MyBetsSkeletonGrid;
