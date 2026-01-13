import React from 'react';
import { IconType } from 'react-icons';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: IconType;
  color?: 'primary' | 'green' | 'blue' | 'orange' | 'purple';
}

const StatsCard = ({ title, value, icon: Icon, color = 'primary' }: StatsCardProps) => {
  const colorClasses = {
    primary: 'bg-primary-100 text-primary',
    green: 'bg-green-100 text-green-600',
    blue: 'bg-blue-100 text-blue-600',
    orange: 'bg-orange-100 text-orange-600',
    purple: 'bg-purple-100 text-purple-600',
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-secondary">{value}</p>
        </div>
        <div className={`w-14 h-14 rounded-full flex items-center justify-center ${colorClasses[color]}`}>
          <Icon size={28} />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
