import React from 'react';

const SkeletonLoader = ({ className = '', lines = 1 }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className="h-4 bg-gray-200 rounded mb-2"
          style={{
            width: index === lines - 1 ? '75%' : '100%'
          }}
        ></div>
      ))}
    </div>
  );
};

export default SkeletonLoader;





