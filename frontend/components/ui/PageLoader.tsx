'use client';

import React from 'react';
import { FiHome } from 'react-icons/fi';

interface PageLoaderProps {
  message?: string;
  fullScreen?: boolean;
}

export default function PageLoader({ 
  message = 'Carregando...', 
  fullScreen = true 
}: PageLoaderProps) {
  const containerClass = fullScreen
    ? 'fixed inset-0 z-50 bg-white'
    : 'w-full h-full bg-white';

  return (
    <div className={`${containerClass} flex flex-col items-center justify-center`}>
      {/* Animated Logo */}
      <div className="relative mb-6">
        {/* Outer rotating circle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 border-4 border-primary-100 border-t-primary-500 rounded-full animate-spin"></div>
        </div>
        
        {/* Inner pulsing circle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-primary-50 rounded-full animate-pulse"></div>
        </div>
        
        {/* Logo Icon */}
        <div className="relative z-10 flex items-center justify-center w-24 h-24">
          <div className="p-4 bg-white rounded-full shadow-lg">
            <FiHome className="w-8 h-8 text-primary-600 animate-bounce" />
          </div>
        </div>
      </div>

      {/* Loading Text */}
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-secondary-700">
          {message}
        </h3>
        
        {/* Animated dots */}
        <div className="flex justify-center space-x-1">
          <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>

      {/* Brand Text */}
      <p className="mt-6 text-sm text-secondary-400 font-medium">
        IJPS
      </p>
    </div>
  );
}
