import React from 'react';
import { FiTrendingUp, FiClock, FiDollarSign } from 'react-icons/fi';

const RecommendationCard = ({ recommendation }) => {
  const getPriorityColor = () => {
    switch (recommendation.priority) {
      case 'high':
        return 'border-red-200 bg-red-50';
      case 'medium':
        return 'border-amber-200 bg-amber-50';
      case 'low':
        return 'border-green-200 bg-green-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getPriorityText = () => {
    switch (recommendation.priority) {
      case 'high':
        return 'High Priority';
      case 'medium':
        return 'Medium Priority';
      case 'low':
        return 'Low Priority';
      default:
        return 'Normal Priority';
    }
  };

  return (
    <div className={`p-4 rounded-lg border ${getPriorityColor()} transition-all duration-200 hover:shadow-sm`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 text-2xl">
          {recommendation.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-gray-900">{recommendation.title}</h4>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              recommendation.priority === 'high' ? 'bg-red-100 text-red-800' :
              recommendation.priority === 'medium' ? 'bg-amber-100 text-amber-800' :
              'bg-green-100 text-green-800'
            }`}>
              {getPriorityText()}
            </span>
          </div>
          <p className="text-sm text-gray-700 mb-3">{recommendation.description}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 text-green-600">
                <FiDollarSign className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Save ${recommendation.estimatedSavings}/month
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-1 text-gray-500">
              <FiClock className="w-4 h-4" />
              <span className="text-xs">
                {recommendation.priority === 'high' ? '1-2 weeks' :
                 recommendation.priority === 'medium' ? '1-2 months' :
                 '3-6 months'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard;






