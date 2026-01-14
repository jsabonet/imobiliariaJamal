'use client';

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'white' | 'accent';
  text?: string;
  centered?: boolean;
}

export default function LoadingSpinner({ 
  size = 'md', 
  color = 'primary',
  text,
  centered = false
}: LoadingSpinnerProps) {
  
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3',
    xl: 'w-12 h-12 border-4',
  };

  const colorClasses = {
    primary: 'border-primary-200 border-t-primary-600',
    secondary: 'border-secondary-200 border-t-secondary-600',
    white: 'border-white/30 border-t-white',
    accent: 'border-accent-200 border-t-accent-600',
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg',
  };

  const spinner = (
    <div className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-spin`}></div>
  );

  if (text) {
    const content = (
      <div className="flex items-center gap-3">
        {spinner}
        <span className={`${textSizeClasses[size]} font-medium text-secondary-600`}>
          {text}
        </span>
      </div>
    );

    return centered ? (
      <div className="flex justify-center items-center w-full py-8">
        {content}
      </div>
    ) : content;
  }

  return centered ? (
    <div className="flex justify-center items-center w-full py-8">
      {spinner}
    </div>
  ) : spinner;
}
