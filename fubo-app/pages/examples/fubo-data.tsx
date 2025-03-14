import React, { useState } from 'react';
import Head from 'next/head';
import FuboDataExample from '../../components/examples/FuboDataExample';
import FuboMediaExample from '../../components/examples/FuboMediaExample';

/**
 * Example page that demonstrates the Fubo data service integration
 */
export default function FuboDataPage() {
  const [activeTab, setActiveTab] = useState<'matches' | 'media'>('matches');

  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>Fubo Data Examples</title>
        <meta name="description" content="Examples of Fubo data integration" />
      </Head>

      <h1 className="text-3xl font-bold mb-8 text-center">Fubo Data Integration Examples</h1>
      
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