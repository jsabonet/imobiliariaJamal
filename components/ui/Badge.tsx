import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'info' | 'default';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className = '',
}) => {
  const variants = {
    success: 'bg-accent-50 text-accent-700 border-accent-200',
    warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    default: 'bg-gray-100 text-gray-700 border-gray-200',
  };
  
  return (
    <span
      className={`
        inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border
        ${variants[variant]} ${className}
      `}
    >
      {children}
    </span>
  );
};

export default Badge;
