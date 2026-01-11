import React from 'react';
import { FiX, FiAlertTriangle, FiAlertCircle, FiInfo } from 'react-icons/fi';
import { useEnergy } from '../../context/EnergyContext';

const AlertCard = ({ alert }) => {
  const { actions } = useEnergy();

  const getAlertIcon = () => {
    switch (alert.type) {
      case 'critical':
        return <FiAlertTriangle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <FiAlertCircle className="w-5 h-5 text-amber-600" />;
      case 'info':
        return <FiInfo className="w-5 h-5 text-green-600" />;
      default:
        return <FiInfo className="w-5 h-5 text-gray-600" />;
    }
  };

  const getAlertClasses = () => {
    switch (alert.type) {
      case 'critical':
        return 'alert-critical border-l-4 border-red-500';
      case 'warning':
        return 'alert-warning border-l-4 border-amber-500';
      case 'info':
        return 'alert-info border-l-4 border-green-500';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800 border-l-4 border-gray-500';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const handleDismiss = () => {
    actions.dismissAlert(alert.id);
  };

  return (
    <div className={`p-4 rounded-lg border ${getAlertClasses()} transition-all duration-200 hover:shadow-sm`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <div className="flex-shrink-0 mt-0.5">
            {getAlertIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold mb-1">{alert.title}</h4>
            <p className="text-sm opacity-90 mb-2">{alert.message}</p>
            <p className="text-xs opacity-75">{formatTimestamp(alert.timestamp)}</p>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 p-1 hover:bg-black hover:bg-opacity-10 rounded-full transition-colors duration-200"
          aria-label="Dismiss alert"
        >
          <FiX className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default AlertCard;






