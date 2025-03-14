import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import FuboDataExample from '../../components/examples/FuboDataExample';
import FuboMediaExample from '../../components/examples/FuboMediaExample';
import { 
  isUsingMockData, 
  isUsingCorsProxy, 
  clearCache,
  toggleMockData,
  toggleProxyMethod,
  getProxyMethod
} from '../../services/data/fuboDataService';

/**
 * Example page that demonstrates the Fubo data service integration
 */
export default function FuboDataPage() {
  const [activeTab, setActiveTab] = useState<'matches' | 'media'>('matches');
  const [apiStatus, setApiStatus] = useState<'checking' | 'success' | 'error'>('checking');
  const [apiMessage, setApiMessage] = useState<string>('Checking API connection...');
  const [useMockData, setUseMockData] = useState<boolean>(false);
  const [proxyMethod, setProxyMethod] = useState<'nextjs' | 'external' | 'none'>('nextjs');

  // Initialize state from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Get mock data setting
      const storedMockSetting = window.localStorage.getItem('fubo_use_mock_data');
      if (storedMockSetting !== null) {
        setUseMockData(storedMockSetting === 'true');
      }
      
      // Get proxy method
      setProxyMethod(getProxyMethod());
    }
  }, []);

  // Handle data source toggle
  const handleDataSourceToggle = () => {
    const newValue = toggleMockData();
    setUseMockData(newValue);
  };

  // Handle proxy method change
  const handleProxyMethodChange = (method: 'nextjs' | 'external' | 'none') => {
    toggleProxyMethod(method);
    setProxyMethod(method);
  };

  // Toggle CORS proxy
  const handleToggleCorsProxy = () => {
    const newProxyStatus = !isUsingCorsProxy();
    if (newProxyStatus) {
      toggleProxyMethod('nextjs');
    }
    
    // Save setting to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('fubo_use_cors_proxy', String(newProxyStatus));
    }
    
    // Clear cache when changing proxy settings
    clearCache();
  };

  // Clear cache
  const handleClearCache = () => {
    clearCache();
    alert('Cache cleared!');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>Fubo Data Examples</title>
        <meta name="description" content="Examples of Fubo data integration" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Fubo Data Examples</h1>
        
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <h2 className="text-xl font-semibold mb-2">Data Source Settings</h2>
          
          <div className="flex flex-col gap-4 mb-4">
            {/* Data Source Toggle */}
            <div className="flex items-center">
              <button
                onClick={handleDataSourceToggle}
                className={`px-4 py-2 rounded-md transition-colors ${
                  useMockData 
                    ? 'bg-amber-500 hover:bg-amber-600 text-white' 
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                {useMockData ? 'Using Mock Data' : 'Using Real API Data'}
              </button>
              <span className="ml-2 text-sm text-gray-600">
                {useMockData 
                  ? 'Using local mock data, no network requests' 
                  : 'Fetching real data from Fubo API'
                }
              </span>
            </div>
            
            {/* Proxy Method Selection */}
            <div className="flex flex-col">
              <label className="font-medium mb-1">CORS Proxy Method:</label>
              <div className="flex gap-2">
                <button
                  onClick={() => handleProxyMethodChange('nextjs')}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    proxyMethod === 'nextjs' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  Next.js API Proxy
                </button>
                <button
                  onClick={() => handleProxyMethodChange('external')}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    proxyMethod === 'external' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  External Proxy
                </button>
                <button
                  onClick={() => handleProxyMethodChange('none')}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    proxyMethod === 'none' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  No Proxy
                </button>
              </div>
              <p className="mt-1 text-sm text-gray-600">
                {proxyMethod === 'nextjs' 
                  ? 'Using Next.js API route proxy (no CORS issues, works on all environments)' 
                  : proxyMethod === 'external'
                    ? 'Using external CORS proxy service (may have rate limits)' 
                    : 'Direct API access (may have CORS issues on localhost)'
                }
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold mb-4">Sports Matches</h2>
            <FuboDataExample
              useMockData={useMockData}
              useCorsProxy={proxyMethod !== 'none'}
            />
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold mb-4">Movies & TV Series</h2>
            <FuboMediaExample
              useMockData={useMockData}
              useCorsProxy={proxyMethod !== 'none'}
            />
          </div>
        </div>
      </div>

      <div className="mt-8 p-6 bg-gray-50 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Implementation Notes</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <span className="font-medium">CORS Handling:</span> The data service automatically handles CORS constraints by checking the current domain and using a CORS proxy when needed.
          </li>
          <li>
            <span className="font-medium">Caching:</span> Data is cached for 15 minutes to reduce API calls and improve performance.
          </li>
          <li>
            <span className="font-medium">Error Handling:</span> The service includes retry logic (up to 3 attempts) and graceful error handling.
          </li>
          <li>
            <span className="font-medium">Data Processing:</span> Raw data is processed to add useful fields like EST time conversion and live status.
          </li>
          <li>
            <span className="font-medium">Deduplication:</span> Matches with the same details but different networks are merged to avoid duplicates.
          </li>
        </ul>
      </div>

      <div className="mt-8 p-6 bg-blue-50 rounded-lg shadow-sm border border-blue-100">
        <h2 className="text-xl font-semibold mb-4">Local Development Options</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">CORS Proxy (Recommended)</h3>
            <p className="text-sm text-gray-700">
              Enable the CORS proxy to access the API directly from localhost. This routes requests through a third-party proxy that adds the proper CORS headers.
            </p>
            <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-xs text-yellow-700">
                <strong>Note:</strong> We're now using allorigins.win as the CORS proxy which should have better rate limits than cors-anywhere.
              </p>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Domain Mapping</h3>
            <p className="text-sm text-gray-700 mb-2">
              For a more production-like setup, modify your <code className="bg-gray-100 px-1 py-0.5 rounded">/etc/hosts</code> file to map your local domain:
            </p>
            <pre className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto">
              127.0.0.1 dev.fubo.tv
            </pre>
            <p className="mt-2 text-sm text-gray-700">
              Then configure your local server to run on <code className="bg-gray-100 px-1 py-0.5 rounded">dev.fubo.tv:3000</code> to avoid CORS issues.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 