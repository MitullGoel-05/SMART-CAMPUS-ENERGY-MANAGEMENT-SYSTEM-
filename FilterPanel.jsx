import React from 'react';
import { FiCalendar, FiFilter, FiDownload } from 'react-icons/fi';
import { useEnergy } from '../../context/EnergyContext';
import { departments, systems } from '../../data/mockData';

const FilterPanel = () => {
  const { state, actions } = useEnergy();
  const { filters } = state;

  const handleDateChange = (field, value) => {
    actions.setFilters({
      dateRange: {
        ...filters.dateRange,
        [field]: value
      }
    });
  };

  const handleDepartmentChange = (deptId) => {
    const updatedDepartments = filters.departments.includes(deptId)
      ? filters.departments.filter(id => id !== deptId)
      : [...filters.departments, deptId];
    
    actions.setFilters({
      departments: updatedDepartments
    });
  };

  const handleSystemChange = (systemId) => {
    const updatedSystems = filters.systems.includes(systemId)
      ? filters.systems.filter(id => id !== systemId)
      : [...filters.systems, systemId];
    
    actions.setFilters({
      systems: updatedSystems
    });
  };

  const handleDownloadReport = () => {
    // Simulate report download
    const reportData = {
      dateRange: filters.dateRange,
      departments: filters.departments,
      systems: filters.systems,
      generatedAt: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `energy-report-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <FiFilter className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        </div>
        <button
          onClick={actions.resetFilters}
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          Reset
        </button>
      </div>

      <div className="space-y-6">
        {/* Date Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <FiCalendar className="w-4 h-4 inline mr-2" />
            Date Range
          </label>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">From</label>
              <input
                type="date"
                value={filters.dateRange.from}
                onChange={(e) => handleDateChange('from', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">To</label>
              <input
                type="date"
                value={filters.dateRange.to}
                onChange={(e) => handleDateChange('to', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Departments */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Departments
          </label>
          <div className="space-y-2">
            {departments.map((dept) => (
              <label key={dept.id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.departments.includes(dept.id)}
                  onChange={() => handleDepartmentChange(dept.id)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">{dept.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Systems */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Systems
          </label>
          <div className="space-y-2">
            {systems.map((system) => (
              <label key={system.id} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.systems.includes(system.id)}
                  onChange={() => handleSystemChange(system.id)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  <span className="mr-1">{system.icon}</span>
                  {system.name}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Download Report */}
        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={handleDownloadReport}
            className="w-full flex items-center justify-center space-x-2 btn-primary"
          >
            <FiDownload className="w-4 h-4" />
            <span>Download Report</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;






