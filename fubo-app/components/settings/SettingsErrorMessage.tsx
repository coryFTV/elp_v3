import React from 'react';
import { AlertTriangle } from 'lucide-react';

export function SettingsErrorMessage() {
  return (
    <div className="rounded-md bg-red-50 p-6 border border-red-200" data-testid="settings-error">
      <div className="flex items-center">
        <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">Settings Error</h3>
          <div className="mt-2 text-sm text-red-700">
            <p>
              There was an error loading your partner settings. Please refresh the page or try again later.
            </p>
          </div>
          <div className="mt-4">
            <button
              type="button"
              className="rounded-md bg-red-100 px-3 py-2 text-sm font-medium text-red-800 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsErrorMessage; 