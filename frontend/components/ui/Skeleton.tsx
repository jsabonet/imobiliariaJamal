'use client';

import React from 'react';

type SkeletonProps = {
  className?: string;
};

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => (
  <div className={`animate-pulse rounded-md bg-gray-200 ${className}`} />
);

export const SkeletonText: React.FC<{ width?: string; className?: string }> = ({ width = 'w-full', className = '' }) => (
  <div className={`animate-pulse rounded bg-gray-200 h-4 ${width} ${className}`} />
);

export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`overflow-hidden rounded-xl border border-gray-100 shadow-sm ${className}`}>
    <div className="h-64 w-full bg-gray-200 animate-pulse" />
    <div className="p-6 space-y-3">
      <SkeletonText width="w-2/3" />
      <SkeletonText width="w-1/3" />
      <div className="grid grid-cols-3 gap-3 pt-2">
        <Skeleton className="h-5" />
        <Skeleton className="h-5" />
        <Skeleton className="h-5" />
      </div>
      <div className="h-10 bg-gray-200 animate-pulse rounded" />
    </div>
  </div>
);

export default Skeleton;
