import React, { useState } from 'react';
import Papa from 'papaparse';
import { FiUpload, FiCheck, FiX, FiFile, FiAlertCircle } from 'react-icons/fi';

const CSVUpload = ({ onDataLoaded }) => {
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previewRows, setPreviewRows] = useState(5);

  const requiredHeaders = ['timestamp', 'temperature', 'humidity', 'current', 'predicted_energy'];

  const validateHeaders = (headers) => {
    const normalizedHeaders = headers.map(h => h.trim().toLowerCase());
    const missingHeaders = requiredHeaders.filter(
      req => !normalizedHeaders.includes(req.toLowerCase())
    );
    
    if (missingHeaders.length > 0) {
      return {
        valid: false,
        message: `Missing required headers: ${missingHeaders.join(', ')}`
      };
    }
    
    return { valid: true };
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];
    
    if (!selectedFile) {
      setFile(null);
      setParsedData(null);
      setError(null);
      return;
    }

    // Validate file type
    if (!selectedFile.name.endsWith('.csv')) {
      setError('Please select a CSV file');
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setError(null);
    setIsLoading(true);

    Papa.parse(selectedFile, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => {
        setIsLoading(false);
        
        if (results.errors.length > 0) {
          setError(`CSV parsing error: ${results.errors[0].message}`);
          return;
        }

        if (results.data.length === 0) {
          setError('CSV file is empty');
          return;
        }

        // Validate headers (prefer meta.fields when available)
        const headers = results.meta?.fields || Object.keys(results.data[0] || {});
        const validation = validateHeaders(headers);
        
        if (!validation.valid) {
          setError(validation.message);
          return;
        }

        // Normalize and validate data without throwing uncaught errors
        let normalizedData;
        try {
          normalizedData = results.data.map((row, index) => {
            const normalized = {};
            requiredHeaders.forEach(header => {
              const value = row[header] ?? row[header.toLowerCase()] ?? row[header.toUpperCase()];
              normalized[header] = value;
            });

            // Check for missing required fields
            const missing = requiredHeaders.filter(h => normalized[h] === null || normalized[h] === undefined || normalized[h] === '');
            if (missing.length > 0) {
              throw new Error(`Row ${index + 2}: missing required fields: ${missing.join(', ')}`);
            }

            // Coerce numeric fields where appropriate
            const maybeNumber = val => (val === '' || val === null || val === undefined) ? val : Number(val);
            normalized.temperature = maybeNumber(normalized.temperature);
            normalized.humidity = maybeNumber(normalized.humidity);
            normalized.current = maybeNumber(normalized.current);
            normalized.predicted_energy = maybeNumber(normalized.predicted_energy);

            return normalized;
          });
        } catch (e) {
          setParsedData(null);
          setError(e.message || 'Invalid CSV data');
          return;
        }

        setParsedData(normalizedData);
        setError(null);

        // Call callback if provided
        if (onDataLoaded) {
          onDataLoaded(normalizedData);
        }
      },
      error: (error) => {
        setIsLoading(false);
        setError(`Failed to parse CSV: ${error.message}`);
      }
    });
  };

  const handleClear = () => {
    setFile(null);
    setParsedData(null);
    setError(null);
    // Reset file input
    const fileInput = document.getElementById('csv-file-input');
    if (fileInput) {
      fileInput.value = '';
    }
    if (onDataLoaded) {
      onDataLoaded(null);
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    
    // Try to parse as date
    const date = new Date(timestamp);
    if (!isNaN(date.getTime())) {
      return date.toLocaleString();
    }
    
    // If it's a number, assume it's a Unix timestamp
    if (typeof timestamp === 'number') {
      return new Date(timestamp).toLocaleString();
    }
    
    return timestamp.toString();
  };

  return (
    <div className="card space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Upload Prediction Data</h3>
          <p className="text-sm text-gray-600 mt-1">
            Upload a CSV file with columns: timestamp, temperature, humidity, current, predicted_energy
          </p>
        </div>
        {parsedData && (
          <button
            onClick={handleClear}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
          >
            <FiX className="w-4 h-4" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* File Input */}
      <div className="relative">
        <input
          id="csv-file-input"
          type="file"
          accept=".csv,text/csv"
          onChange={handleFileChange}
          className="hidden"
          disabled={isLoading}
        />
        <label
          htmlFor="csv-file-input"
          className={`flex items-center justify-center space-x-2 px-6 py-4 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
            isLoading
              ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
              : parsedData
              ? 'border-green-300 bg-green-50 hover:border-green-400'
              : 'border-gray-300 bg-gray-50 hover:border-primary-300 hover:bg-primary-50'
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-medium text-gray-600">Parsing CSV...</span>
            </>
          ) : parsedData ? (
            <>
              <FiCheck className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-700">
                {file?.name} ({parsedData.length} rows loaded)
              </span>
            </>
          ) : (
            <>
              <FiUpload className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                {file ? file.name : 'Choose CSV file or drag and drop'}
              </span>
            </>
          )}
        </label>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-start space-x-2 p-4 bg-red-50 border border-red-200 rounded-lg">
          <FiAlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">Error</p>
            <p className="text-sm text-red-600 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Data Preview */}
      {parsedData && parsedData.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-gray-900">Data Preview</h4>
            <span className="text-xs text-gray-500">
              Showing {Math.min(previewRows, parsedData.length)} of {parsedData.length} rows
            </span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Temperature
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Humidity
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Current
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Predicted Energy
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {parsedData.slice(0, previewRows).map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                      {formatTimestamp(row.timestamp)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {typeof row.temperature === 'number' ? row.temperature.toFixed(2) : row.temperature}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {typeof row.humidity === 'number' ? row.humidity.toFixed(2) : row.humidity}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {typeof row.current === 'number' ? row.current.toFixed(2) : row.current}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-primary-600">
                      {typeof row.predicted_energy === 'number' 
                        ? row.predicted_energy.toFixed(2) 
                        : row.predicted_energy}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {parsedData.length > previewRows && (
            <button
              onClick={() => setPreviewRows(prev => prev + 10)}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Show more rows ({parsedData.length - previewRows} remaining)
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CSVUpload;

