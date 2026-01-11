import React, { useState } from 'react';
import { FiX, FiBell, FiZap, FiChevronRight } from 'react-icons/fi';
import { useEnergy } from '../../context/EnergyContext';
import AlertCard from './AlertCard';
import RecommendationCard from './RecommendationCard';
import { alerts, recommendations } from '../../data/mockData';

const AlertPanel = () => {
  const { state, actions } = useEnergy();
  const { alertPanelOpen, dismissedAlerts } = state;
  const [activeTab, setActiveTab] = useState('alerts');

  if (!alertPanelOpen) return null;

  const activeAlerts = alerts.filter(alert => !dismissedAlerts.includes(alert.id));
  const criticalAlerts = activeAlerts.filter(alert => alert.type === 'critical');
  const warningAlerts = activeAlerts.filter(alert => alert.type === 'warning');
  const infoAlerts = activeAlerts.filter(alert => alert.type === 'info');

  const highPriorityRecommendations = recommendations.filter(rec => rec.priority === 'high');
  const mediumPriorityRecommendations = recommendations.filter(rec => rec.priority === 'medium');
  const lowPriorityRecommendations = recommendations.filter(rec => rec.priority === 'low');

  return (
    <>
      {/* Backdrop for mobile */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden"
        onClick={actions.toggleAlertPanel}
        aria-label="Close alerts panel"
      ></div>
      
      <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-xl border-l border-gray-200 z-50 transform transition-transform duration-300 ease-in-out animate-slide-in">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Alerts & Recommendations</h2>
          <button
            onClick={actions.toggleAlertPanel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            aria-label="Close panel"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('alerts')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 text-sm font-medium transition-colors duration-200 ${
              activeTab === 'alerts'
                ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FiBell className="w-4 h-4" />
            <span>Alerts</span>
            {activeAlerts.length > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                {activeAlerts.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 text-sm font-medium transition-colors duration-200 ${
              activeTab === 'recommendations'
                ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FiZap className="w-4 h-4" />
            <span>AI Tips</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'alerts' ? (
            <div className="p-6 space-y-4">
              {/* Critical Alerts */}
              {criticalAlerts.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-red-600 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                    Critical ({criticalAlerts.length})
                  </h3>
                  <div className="space-y-3">
                    {criticalAlerts.map(alert => (
                      <AlertCard key={alert.id} alert={alert} />
                    ))}
                  </div>
                </div>
              )}

              {/* Warning Alerts */}
              {warningAlerts.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-amber-600 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                    Warnings ({warningAlerts.length})
                  </h3>
                  <div className="space-y-3">
                    {warningAlerts.map(alert => (
                      <AlertCard key={alert.id} alert={alert} />
                    ))}
                  </div>
                </div>
              )}

              {/* Info Alerts */}
              {infoAlerts.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-green-600 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Info ({infoAlerts.length})
                  </h3>
                  <div className="space-y-3">
                    {infoAlerts.map(alert => (
                      <AlertCard key={alert.id} alert={alert} />
                    ))}
                  </div>
                </div>
              )}

              {activeAlerts.length === 0 && (
                <div className="text-center py-8">
                  <FiBell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No active alerts</p>
                  <p className="text-sm text-gray-400">All systems are running normally</p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-6 space-y-4">
              {/* High Priority Recommendations */}
              {highPriorityRecommendations.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-red-600 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                    High Priority ({highPriorityRecommendations.length})
                  </h3>
                  <div className="space-y-3">
                    {highPriorityRecommendations.map(rec => (
                      <RecommendationCard key={rec.id} recommendation={rec} />
                    ))}
                  </div>
                </div>
              )}

              {/* Medium Priority Recommendations */}
              {mediumPriorityRecommendations.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-amber-600 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                    Medium Priority ({mediumPriorityRecommendations.length})
                  </h3>
                  <div className="space-y-3">
                    {mediumPriorityRecommendations.map(rec => (
                      <RecommendationCard key={rec.id} recommendation={rec} />
                    ))}
                  </div>
                </div>
              )}

              {/* Low Priority Recommendations */}
              {lowPriorityRecommendations.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-green-600 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Low Priority ({lowPriorityRecommendations.length})
                  </h3>
                  <div className="space-y-3">
                    {lowPriorityRecommendations.map(rec => (
                      <RecommendationCard key={rec.id} recommendation={rec} />
                    ))}
                  </div>
                </div>
              )}

              {recommendations.length === 0 && (
                <div className="text-center py-8">
                  <FiZap className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No recommendations available</p>
                  <p className="text-sm text-gray-400">Check back later for optimization tips</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-2">
              AI-powered recommendations updated every hour
            </p>
            <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              View All Recommendations
              <FiChevronRight className="w-4 h-4 inline ml-1" />
            </button>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default AlertPanel;

