import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useEnergy } from '../../context/EnergyContext';
import { historicalData, systems } from '../../data/mockData';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const HistoricalChart = () => {
  const { state } = useEnergy();
  const { filters } = state;

  // Filter data based on selected systems
  const filteredData = historicalData.filter(item => {
    const date = new Date(item.date);
    const fromDate = new Date(filters.dateRange.from);
    const toDate = new Date(filters.dateRange.to);
    
    return date >= fromDate && date <= toDate;
  });

  const datasets = [];

  // Add datasets for selected systems
  if (filters.systems.length === 0 || filters.systems.includes('hvac')) {
    datasets.push({
      label: 'HVAC 🌡️',
      data: filteredData.map(item => item.hvac),
      borderColor: '#ef4444',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      borderWidth: 2,
      tension: 0.4,
      pointRadius: 3,
      pointHoverRadius: 5,
    });
  }

  if (filters.systems.length === 0 || filters.systems.includes('lighting')) {
    datasets.push({
      label: 'Lighting 💡',
      data: filteredData.map(item => item.lighting),
      borderColor: '#f59e0b',
      backgroundColor: 'rgba(245, 158, 11, 0.1)',
      borderWidth: 2,
      tension: 0.4,
      pointRadius: 3,
      pointHoverRadius: 5,
    });
  }

  if (filters.systems.length === 0 || filters.systems.includes('machinery')) {
    datasets.push({
      label: 'Machinery ⚙️',
      data: filteredData.map(item => item.machinery),
      borderColor: '#6b7280',
      backgroundColor: 'rgba(107, 114, 128, 0.1)',
      borderWidth: 2,
      tension: 0.4,
      pointRadius: 3,
      pointHoverRadius: 5,
    });
  }

  // Always show total if no specific systems selected
  if (filters.systems.length === 0) {
    datasets.push({
      label: 'Total',
      data: filteredData.map(item => item.total),
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      borderWidth: 3,
      tension: 0.4,
      pointRadius: 4,
      pointHoverRadius: 6,
    });
  }

  const data = {
    labels: filteredData.map(item => {
      const date = new Date(item.date);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }),
    datasets
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
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
          title: function(context) {
            const index = context[0].dataIndex;
            const date = new Date(filteredData[index].date);
            return date.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });
          },
          label: function(context) {
            const value = context.parsed.y;
            const label = context.dataset.label;
            return `${label}: ${value} kWh`;
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
      duration: 1500,
      easing: 'easeInOutQuart'
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Historical Energy Usage</h3>
          <p className="text-sm text-gray-600">
            {filteredData.length} days of data
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Total Energy</p>
          <p className="text-lg font-semibold text-gray-900">
            {filteredData.reduce((sum, item) => sum + item.total, 0).toLocaleString()} kWh
          </p>
        </div>
      </div>
      <div className="h-96">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default HistoricalChart;






