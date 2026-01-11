import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { costAnalysisData } from '../../data/mockData';

ChartJS.register(ArcElement, Tooltip, Legend);

const CostAnalysisPie = () => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#10b981',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${percentage}% ($${(value * 100).toFixed(0)})`;
          }
        }
      }
    },
    cutout: '60%',
    animation: {
      animateRotate: true,
      duration: 2000,
      easing: 'easeInOutQuart'
    }
  };

  // Calculate total cost
  const totalCost = costAnalysisData.datasets[0].data.reduce((sum, value) => sum + value, 0);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Cost Analysis</h3>
          <p className="text-sm text-gray-600">Energy cost breakdown by system</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Total Cost</p>
          <p className="text-lg font-semibold text-gray-900">
            ${(totalCost * 100).toLocaleString()}
          </p>
        </div>
      </div>
      
      <div className="h-80 flex items-center justify-center">
        <div className="relative w-64 h-64">
          <Doughnut data={costAnalysisData} options={options} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                ${(totalCost * 100).toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">Total Cost</p>
            </div>
          </div>
        </div>
      </div>

      {/* Cost breakdown table */}
      <div className="mt-6 space-y-2">
        {costAnalysisData.labels.map((label, index) => {
          const value = costAnalysisData.datasets[0].data[index];
          const percentage = ((value / totalCost) * 100).toFixed(1);
          const color = costAnalysisData.datasets[0].backgroundColor[index];
          
          return (
            <div key={label} className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: color }}
                ></div>
                <span className="text-sm text-gray-700">{label}</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  ${(value * 100).toFixed(0)}
                </p>
                <p className="text-xs text-gray-500">{percentage}%</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CostAnalysisPie;






