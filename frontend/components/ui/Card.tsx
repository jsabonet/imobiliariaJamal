import React from 'react';
import Link from 'next/link';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  href?: string;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  href,
}) => {
  const baseStyles = 'bg-white rounded-xl shadow-md overflow-hidden';
  const hoverStyles = hover ? 'transition-all duration-300 hover:shadow-xl hover:-translate-y-1' : '';
  
  const cardContent = (
    <div className={`${baseStyles} ${hoverStyles} ${className}`}>
      {children}
    </div>
  );
  
  if (href) {
    return <Link href={href}>{cardContent}</Link>;
  }
  
  return cardContent;
};

export default Card;
