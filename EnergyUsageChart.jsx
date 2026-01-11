import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useEnergy } from '../../context/EnergyContext';
import { realTimeData } from '../../data/mockData';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const EnergyUsageChart = () => {
  const { state } = useEnergy();
  const { chartData } = state;
  
  // Use CSV data if available, otherwise fall back to mock data
  const displayData = chartData && chartData.length > 0 ? chartData : realTimeData;
  
  const data = {
    labels: displayData.map(item => {
      const date = new Date(item.time);
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }),
    datasets: [
      {
        label: 'Energy Usage (kWh)',
        data: displayData.map(item => item.energy),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#10b981',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#10b981',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: function(context) {
            const index = context[0].dataIndex;
            const date = new Date(displayData[index].time);
            return date.toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });
          },
          label: function(context) {
            return `Energy: ${context.parsed.y.toFixed(2)} kWh`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 12
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 12
          },
          callback: function(value) {
            return value + ' kWh';
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    },
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart'
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Real-time Energy Usage</h3>
          <p className="text-sm text-gray-600">Last 24 hours</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Live</span>
        </div>
      </div>
      <div className="h-80">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default EnergyUsageChart;






