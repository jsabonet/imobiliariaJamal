'use client';

import React from 'react';

interface SkeletonCardProps {
  type?: 'property' | 'evaluation' | 'contact' | 'agent';
  count?: number;
}

export default function SkeletonCard({ 
  type = 'property', 
  count = 1 
}: SkeletonCardProps) {
  
  const PropertySkeleton = () => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
      {/* Image placeholder */}
      <div className="h-48 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer"></div>
      
      <div className="p-4 space-y-3">
        {/* Title */}
        <div className="h-5 bg-gray-200 rounded w-3/4"></div>
        
        {/* Location */}
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        
        {/* Price */}
        <div className="h-6 bg-gray-200 rounded w-2/3"></div>
        
        {/* Features */}
        <div className="flex gap-2">
          <div className="h-4 bg-gray-200 rounded w-16"></div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </div>
        
        {/* Button */}
        <div className="h-10 bg-gray-200 rounded-lg w-full mt-4"></div>
      </div>
    </div>
  );

  const EvaluationSkeleton = () => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <div className="space-y-2 flex-1">
            <div className="h-5 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="h-6 bg-gray-200 rounded w-20"></div>
        </div>
        
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        
        <div className="flex gap-2 pt-2">
          <div className="h-8 bg-gray-200 rounded w-20"></div>
          <div className="h-8 bg-gray-200 rounded w-20"></div>
          <div className="h-8 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    </div>
  );

  const ContactSkeleton = () => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <div className="space-y-2 flex-1">
            <div className="h-5 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>
        
        <div className="h-16 bg-gray-200 rounded"></div>
        
        <div className="flex gap-2 pt-2">
          <div className="h-8 bg-gray-200 rounded w-16"></div>
          <div className="h-8 bg-gray-200 rounded w-16"></div>
          <div className="h-8 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
    </div>
  );

  const AgentSkeleton = () => (
    <div className="bg-white rounded-xl shadow-md p-6 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
      
      <div className="mt-4 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
      
      <div className="mt-4 h-10 bg-gray-200 rounded-lg"></div>
    </div>
  );

  const renderSkeleton = () => {
    switch (type) {
      case 'property':
        return <PropertySkeleton />;
      case 'evaluation':
        return <EvaluationSkeleton />;
      case 'contact':
        return <ContactSkeleton />;
      case 'agent':
        return <AgentSkeleton />;
      default:
        return <PropertySkeleton />;
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>
          {renderSkeleton()}
        </div>
      ))}
    </>
  );
}
