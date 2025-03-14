import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import FuboDataExample from '../../components/examples/FuboDataExample';
import FuboMediaExample from '../../components/examples/FuboMediaExample';
import { 
  toggleMockData, 
  isUsingMockData, 
  toggleCorsProxy,
  isUsingCorsProxy, 
  clearCache 
} from '../../services/data/fuboDataService';

/**
 * Example page that demonstrates the Fubo data service integration
 */
export default function FuboDataPage() {
  const [activeTab, setActiveTab] = useState<'matches' | 'media'>('matches');
  const [apiStatus, setApiStatus] = useState<'checking' | 'success' | 'error'>('checking');
  const [apiMessage, setApiMessage] = useState<string>('Checking API connection...');
  const [useMockData, setUseMockData] = useState<boolean>(false);
  const [useCorsProxy, setUseCorsProxy] = useState<boolean>(false);

  // Check API connection on load and get settings
  useEffect(() => {
    // Get current settings
    setUseMockData(isUsingMockData());
    setUseCorsProxy(isUsingCorsProxy());
    
    const checkApiConnection = async () => {
      try {
        setApiStatus('checking');
        setApiMessage('Checking API connection...');
        
        let url = 'https://metadata-feeds.fubo.tv/Test/matches.json';
        
        // If using CORS proxy
        if (useCorsProxy) {
          url = `https://cors-anywhere.herokuapp.com/${url}`;
        }
        
        const response = await fetch(url);
        
        if (response.ok) {
          const data = await response.json();
          setApiStatus('success');
          setApiMessage(`API connection successful! Found ${data.length} matches.`);
        } else {
          setApiStatus('error');
          setApiMessage(`API error: ${response.status} ${response.statusText}`);
        }
      } catch (error) {
        setApiStatus('error');
        setApiMessage(`API connection failed: ${error instanceof Error ? error.message : String(error)}`);
      }
    };
    
    checkApiConnection();
  }, [useCorsProxy]);

  // Toggle mock data
  const handleToggleMockData = () => {
    // Toggle mock data using the service function
    const newMockStatus = toggleMockData();
    setUseMockData(newMockStatus);
    
    // Force reload to apply the change
    window.location.reload();
  };

  // Toggle CORS proxy
  const handleToggleCorsProxy = () => {
    // Toggle CORS proxy using the service function
    const newProxyStatus = toggleCorsProxy();
    setUseCorsProxy(newProxyStatus);
    
    // Clear cache and reload to apply the change
    clearCache();
    window.location.reload();
  };

  // Clear cache and reload
  const handleClearCache = () => {
    clearCache();
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('fubo_data_matches');
      window.localStorage.removeItem('fubo_data_movies');
      window.localStorage.removeItem('fubo_data_series');
    }
    window.location.reload();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>Fubo Data Examples</title>
        <meta name="description" content="Examples of Fubo data integration" />
      </Head>

      <h1 className="text-3xl font-bold mb-8 text-center">Fubo Data Integration Examples</h1>
      
      {/* API Status Banner */}
      <div className={`mb-6 p-4 rounded-lg ${
        apiStatus === 'checking' ? 'bg-blue-100 border border-blue-300' :
        apiStatus === 'success' ? 'bg-green-100 border border-green-300' :
        'bg-red-100 border border-red-300'
      }`}>
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${
            apiStatus === 'checking' ? 'bg-blue-500' :
            apiStatus === 'success' ? 'bg-green-500' :
            'bg-red-500'
          }`}></div>
          <p className={`font-medium ${
            apiStatus === 'checking' ? 'text-blue-700' :
            apiStatus === 'success' ? 'text-green-700' :
            'text-red-700'
          }`}>
            {apiMessage}
          </p>
        </div>
        
        <div className="mt-4 flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <span className="mr-2 font-medium">Data Source: </span>
              <span className={`px-2 py-1 rounded text-xs font-bold ${useMockData ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'}`}>
                {useMockData ? 'MOCK DATA' : 'REAL API DATA'}
              </span>
            </div>
            
            <button
              onClick={handleToggleMockData}
              className="px-3 py-1 text-xs font-medium rounded bg-gray-200 hover:bg-gray-300"
            >
              Switch to {useMockData ? 'real API' : 'mock'} data
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <span className="mr-2 font-medium">CORS Proxy: </span>
              <span className={`px-2 py-1 rounded text-xs font-bold ${useCorsProxy ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                {useCorsProxy ? 'ENABLED' : 'DISABLED'}
              </span>
            </div>
            
            <button
              onClick={handleToggleCorsProxy}
              className="px-3 py-1 text-xs font-medium rounded bg-gray-200 hover:bg-gray-300"
            >
              {useCorsProxy ? 'Disable' : 'Enable'} CORS Proxy
            </button>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={handleClearCache}
              className="px-3 py-1 text-xs font-medium rounded bg-red-100 text-red-700 hover:bg-red-200"
            >
              Clear cache
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-l-lg border ${
              activeTab === 'matches'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('matches')}
          >
            Sports Matches
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-r-lg border ${
              activeTab === 'media'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('media')}
          >
            Movies & Series
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {activeTab === 'matches' ? <FuboDataExample /> : <FuboMediaExample />}
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
                <strong>Note:</strong> The CORS proxy (cors-anywhere.herokuapp.com) has request limitations. 
                If you encounter a 429 error (Too Many Requests), you may need to temporarily switch to mock data 
                or visit <a href="https://cors-anywhere.herokuapp.com/corsdemo" className="underline hover:text-yellow-900" target="_blank" rel="noopener noreferrer">
                  https://cors-anywhere.herokuapp.com/corsdemo
                </a> to request temporary access.
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
          
          <div>
            <h3 className="text-lg font-medium mb-2">Mock Data</h3>
            <p className="text-sm text-gray-700">
              If you can't access the API for any reason, toggle to use mock data instead. This provides a consistent development experience without requiring API access.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 