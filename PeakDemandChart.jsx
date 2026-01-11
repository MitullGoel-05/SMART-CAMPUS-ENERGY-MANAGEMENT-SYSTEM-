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


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);


const PeakDemandChart = () => {
  const { state } = useEnergy();
  const { chartData } = state;
 
  // Use CSV data if available; otherwise show empty chart
  const displayData = chartData && chartData.length > 0 ? chartData : [];
 
  // Calculate peak threshold as 120% of max energy
  const maxEnergy = displayData.length > 0
    ? Math.max(...displayData.map(item => item.energy || 0))
    : 100;
  const peakThreshold = maxEnergy * 1.2;
 
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
        label: 'Actual Usage',
        data: displayData.map(item => item.energy),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 3,
        tension: 0.4,
        pointBackgroundColor: '#10b981',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Gradient Boosting',
        data: displayData.map(item => item.predicted),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        borderDash: [5, 5],
        tension: 0.4,
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Peak Threshold',
        data: displayData.map(() => peakThreshold),
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 2,
        borderDash: [10, 5],
        tension: 0,
        pointRadius: 0,
        pointHoverRadius: 0,
      }
    ]
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
            const date = new Date(displayData[index].time);
            return date.toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });
          },
          label: function(context) {
            const value = context.parsed.y;
            const label = context.dataset.label;
            return `${label}: ${value.toFixed(2)} kWh`;
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
          <h3 className="text-lg font-semibold text-gray-900">Peak Demand Prediction</h3>
          <p className="text-sm text-gray-600">Actual vs Predicted Energy Consumption</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Actual</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-secondary-500 rounded-full border-2 border-dashed border-secondary-500"></div>
            <span className="text-sm text-gray-600">Predicted</span>
          </div>
        </div>
      </div>
      <div className="h-80">
        <Line data={data} options={options} />
      </div>
      {/* Additional small predicted graphs */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Current (A) */}
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Current (A)</h4>
          <div className="h-36">
            <Line
              data={{
                labels: displayData.map(item => {
                  const date = new Date(item.time);
                  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                }),
                datasets: [
                  {
                    label: 'Current',
                    data: displayData.map(item => (Number.isFinite(Number(item.current)) ? Number(item.current) : null)),
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245,158,11,0.08)',
                    borderWidth: 2,
                    pointRadius: 0,
                    tension: 0.3
                  }
                ]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { x: { display: false }, y: { display: true, ticks: { callback: v => `${v}` } } },
                interaction: { intersect: false, mode: 'index' }
              }}
            />
          </div>
        </div>


        {/* Temperature (°C) */}
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Temperature (°C)</h4>
          <div className="h-36">
            <Line
              data={{
                labels: displayData.map(item => {
                  const date = new Date(item.time);
                  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                }),
                datasets: [
                  {
                    label: 'Temperature',
                    data: displayData.map(item => (Number.isFinite(Number(item.temperature)) ? Number(item.temperature) : null)),
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59,130,246,0.08)',
                    borderWidth: 2,
                    pointRadius: 0,
                    tension: 0.3
                  }
                ]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { x: { display: false }, y: { display: true, ticks: { callback: v => `${v}` } } },
                interaction: { intersect: false, mode: 'index' }
              }}
            />
          </div>
        </div>


        {/* Humidity (%) */}
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Humidity (%)</h4>
          <div className="h-36">
            <Line
              data={{
                labels: displayData.map(item => {
                  const date = new Date(item.time);
                  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                }),
                datasets: [
                  {
                    label: 'Humidity',
                    data: displayData.map(item => (Number.isFinite(Number(item.humidity)) ? Number(item.humidity) : null)),
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16,185,129,0.08)',
                    borderWidth: 2,
                    pointRadius: 0,
                    tension: 0.3
                  }
                ]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { x: { display: false }, y: { display: true, ticks: { callback: v => `${v}` } } },
                interaction: { intersect: false, mode: 'index' }
              }}
            />
          </div>
        </div>
      </div>
      {/* Predicted variations: predicted_energy1, predicted_energy2, predicted_energy3 */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Predicted 1 */}
        <div className="p-4 bg-white rounded-lg shadow-sm">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Random Forest (kWh)</h4>
          <div className="h-36">
            <Line
              data={{
                labels: displayData.map(item => {
                  const date = new Date(item.time);
                  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                }),
                datasets: [
                  {
                    label: 'Random Forest',
                    data: displayData.map(item => {
                      const v = item.predicted_energy1 ?? null;
                      return Number.isFinite(Number(v)) ? Number(v) : null;
                    }),
                    borderColor: '#8b5cf6',
                    backgroundColor: 'rgba(139,92,246,0.08)',
                    borderWidth: 2,
                    pointRadius: 0,
                    tension: 0.3
                  }
                ]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { x: { display: false }, y: { display: true, ticks: { callback: v => `${v}` } } },
                interaction: { intersect: false, mode: 'index' }
              }}
            />
          </div>
        </div>


        {/* Predicted 2 */}
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <h4 className="text-sm font-medium text-gray-700 mb-2">SVR (kWh)</h4>
          <div className="h-36">
            <Line
              data={{
                labels: displayData.map(item => {
                  const date = new Date(item.time);
                  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                }),
                datasets: [
                  {
                    label: 'SVR',
                    data: displayData.map(item => {
                      const v = item.predicted_energy2 ?? null;
                      return Number.isFinite(Number(v)) ? Number(v) : null;
                    }),
                    borderColor: '#ec4899',
                    backgroundColor: 'rgba(236,72,153,0.08)',
                    borderWidth: 2,
                    pointRadius: 0,
                    tension: 0.3
                  }
                ]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { x: { display: false }, y: { display: true, ticks: { callback: v => `${v}` } } },
                interaction: { intersect: false, mode: 'index' }
              }}
            />
          </div>
        </div>


        {/* Predicted 3 */}
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Decision Tree (kWh)</h4>
          <div className="h-36">
            <Line
              data={{
                labels: displayData.map(item => {
                  const date = new Date(item.time);
                  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                }),
                datasets: [
                  {
                    label: 'Decision Tree',
                    data: displayData.map(item => {
                      const v = item.predicted_energy3 ?? null;
                      return Number.isFinite(Number(v)) ? Number(v) : null;
                    }),
                    borderColor: '#06b6d4',
                    backgroundColor: 'rgba(6,182,212,0.06)',
                    borderWidth: 2,
                    pointRadius: 0,
                    tension: 0.3
                  }
                ]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { x: { display: false }, y: { display: true, ticks: { callback: v => `${v}` } } },
                interaction: { intersect: false, mode: 'index' }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};


export default PeakDemandChart;

















