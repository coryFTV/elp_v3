import React from 'react';

export function SettingsLoadingSkeleton() {
  return (
    <div className="space-y-4 animate-pulse" data-testid="settings-loading">
      {/* Form field skeletons */}
      {[1, 2, 3].map((item) => (
        <div key={item} className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-10 bg-gray-200 rounded w-full"></div>
        </div>
      ))}
      
      {/* Button skeleton */}
      <div className="mt-6">
        <div className="h-10 bg-gray-200 rounded w-1/3"></div>
      </div>
    </div>
  );
}

export default SettingsLoadingSkeleton; 