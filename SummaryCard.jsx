import React from 'react';
import { FiTrendingUp, FiTrendingDown, FiMinus } from 'react-icons/fi';

const SummaryCard = ({ title, value, unit, change, trend, icon: Icon, color = 'primary' }) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <FiTrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <FiTrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <FiMinus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getColorClasses = () => {
    switch (color) {
      case 'primary':
        return 'bg-gradient-to-r from-primary-500 to-primary-600';
      case 'secondary':
        return 'bg-gradient-to-r from-secondary-500 to-secondary-600';
      case 'success':
        return 'bg-gradient-to-r from-green-500 to-green-600';
      case 'warning':
        return 'bg-gradient-to-r from-amber-500 to-amber-600';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="card card-hover group">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <div className="flex items-baseline">
            <p className="text-2xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-200">{value}</p>
            <span className="ml-1 text-sm text-gray-500">{unit}</span>
          </div>
          <div className="flex items-center mt-2">
            {getTrendIcon()}
            <span className={`ml-1 text-sm font-medium ${
              trend === 'up' ? 'text-green-600' : 
              trend === 'down' ? 'text-red-600' : 
              'text-gray-600'
            }`}>
              {change}
            </span>
            <span className="ml-1 text-xs text-gray-500">vs last month</span>
          </div>
        </div>
        <div className={`w-12 h-12 rounded-lg ${getColorClasses()} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;

