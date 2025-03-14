import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import FuboDataExample from '../../components/examples/FuboDataExample';
import FuboMediaExample from '../../components/examples/FuboMediaExample';
import { toggleMockData, isUsingMockData, clearCache } from '../../services/data/fuboDataService';

/**
 * Example page that demonstrates the Fubo data service integration
 */
export default function FuboDataPage() {
  const [activeTab, setActiveTab] = useState<'matches' | 'media'>('matches');
  const [apiStatus, setApiStatus] = useState<'checking' | 'success' | 'error'>('checking');
  const [apiMessage, setApiMessage] = useState<string>('Checking API connection...');
  const [useMockData, setUseMockData] = useState<boolean>(false);

  // Check API connection on load and get mock data status
  useEffect(() => {
    // Get current mock data status
    setUseMockData(isUsingMockData());
    
    const checkApiConnection = async () => {
      try {
        setApiStatus('checking');
        setApiMessage('Checking API connection...');
        
        const response = await fetch('https://metadata-feeds.fubo.tv/Test/matches.json');
        
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
  }, []);

  // Toggle mock data
  const handleToggleMockData = () => {
    // Toggle mock data using the service function
    const newMockStatus = toggleMockData();
    setUseMockData(newMockStatus);
    
    // Force reload to apply the change
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
        
        <div className="mt-2 flex items-center justify-between">
          <div>
            <span className="mr-2 font-medium">Currently using: </span>
            <span className={`px-2 py-1 rounded text-xs font-bold ${useMockData ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'}`}>
              {useMockData ? 'MOCK DATA' : 'REAL API DATA'}
            </span>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={handleToggleMockData}
              className="px-3 py-1 text-xs font-medium rounded bg-gray-200 hover:bg-gray-300"
            >
              Switch to {useMockData ? 'real API' : 'mock'} data
            </button>
            
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
            <span className="font-medium">CORS Handling:</span> The data service automatically handles CORS constraints by checking the current domain.
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
        <h2 className="text-xl font-semibold mb-4">Local Development</h2>
        <p className="mb-4">
          For local development, you may need to modify your <code className="bg-gray-100 px-1 py-0.5 rounded">/etc/hosts</code> file to map your local domain:
        </p>
        <pre className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto">
          127.0.0.1 dev.fubo.tv
        </pre>
        <p className="mt-4">
          Then configure your local server to run on <code className="bg-gray-100 px-1 py-0.5 rounded">dev.fubo.tv:3000</code> to avoid CORS issues.
        </p>
      </div>
    </div>
  );
} 