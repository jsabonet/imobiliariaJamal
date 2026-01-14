'use client';

import React from 'react';
import { FiHome, FiLoader } from 'react-icons/fi';

interface LoadingOverlayProps {
  isOpen: boolean;
  message?: string;
  type?: 'default' | 'property' | 'form';
}

export default function LoadingOverlay({ 
  isOpen, 
  message = 'Processando...', 
  type = 'default' 
}: LoadingOverlayProps) {
  if (!isOpen) return null;

  const renderIcon = () => {
    switch (type) {
      case 'property':
        return <FiHome className="w-8 h-8 text-primary-600 animate-pulse" />;
      case 'form':
        return <FiLoader className="w-8 h-8 text-primary-600 animate-spin" />;
      default:
        return (
          <div className="relative">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 bg-primary-100 rounded-full animate-pulse"></div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm mx-4 animate-scale-in">
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Icon */}
          <div className="flex items-center justify-center">
            {renderIcon()}
          </div>

          {/* Message */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-secondary-700">
              {message}
            </h3>
            <p className="text-sm text-secondary-400">
              Por favor aguarde...
            </p>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary-400 via-primary-600 to-primary-400 animate-loading-bar"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
