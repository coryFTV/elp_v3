import React, { useEffect, useState } from 'react';
import { fetchFuboData, FuboDataResult, ProcessedMatch, clearCache } from '../../services/data/fuboDataService';

/**
 * Example component showing how to use the Fubo data service to fetch sports matches
 */
export default function FuboDataExample({ 
  useMockData = false, 
  useCorsProxy = true,
  useNextjsProxy = true
}: {
  useMockData?: boolean;
  useCorsProxy?: boolean;
  useNextjsProxy?: boolean;
}) {
  const [data, setData] = useState<FuboDataResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'live' | 'upcoming' | 'past'>('live');
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [timeString, setTimeString] = useState<string>('');
  
  // Update the time string client-side only to avoid hydration mismatch
  useEffect(() => {
    setTimeString(lastRefresh.toLocaleTimeString());
  }, [lastRefresh]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch data from Fubo service
        const result = await fetchFuboData(
          ['matches', 'movies', 'series'], 
          { useMockData, useCorsProxy }
        );
        
        setData(result);
        setLastRefresh(new Date());
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [useMockData, useCorsProxy, useNextjsProxy, lastRefresh]);

  // Filter matches based on active tab
  const getFilteredMatches = (): ProcessedMatch[] => {
    if (!data?.matches) return [];

    switch (activeTab) {
      case 'live':
        return data.matches.filter(match => match.isLive);
      case 'upcoming':
        return data.matches.filter(match => !match.isLive && !match.isPast);
      case 'past':
        return data.matches.filter(match => match.isPast);
      default:
        return data.matches;
    }
  };
  
  const handleRefresh = () => {
    clearCache();
    setLastRefresh(new Date());
  };

  const filteredMatches = getFilteredMatches();

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Fubo Data Example</h1>
        <button 
          onClick={handleRefresh}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>
      
      <div className="mb-4 text-sm text-gray-600">
        <p><strong>Data Source:</strong> {useMockData ? 'Mock Data' : 'Real API'}</p>
        <p><strong>CORS Proxy:</strong> {useCorsProxy ? 'Enabled' : 'Disabled'}</p>
        <p><strong>Next.js Proxy:</strong> {useNextjsProxy ? 'Enabled' : 'Disabled'}</p>
        <p><strong>Last Refreshed:</strong> {timeString}</p>
      </div>
      
      {loading && <p className="text-gray-500">Loading data...</p>}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {data && !loading && (
        <>
          <div className="flex mb-4">
            <button
              className={`px-4 py-2 mr-2 rounded ${activeTab === 'live' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setActiveTab('live')}
            >
              Live ({data.matches.filter(m => m.isLive).length})
            </button>
            <button
              className={`px-4 py-2 mr-2 rounded ${activeTab === 'upcoming' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setActiveTab('upcoming')}
            >
              Upcoming ({data.matches.filter(m => !m.isLive && !m.isPast).length})
            </button>
            <button
              className={`px-4 py-2 rounded ${activeTab === 'past' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setActiveTab('past')}
            >
              Past ({data.matches.filter(m => m.isPast).length})
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMatches.map(match => (
              <div key={match.id} className="border rounded-lg p-4 shadow-sm">
                {match.isLive && (
                  <div className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded mb-2 inline-block">
                    LIVE
                  </div>
                )}
                
                <h2 className="text-lg font-semibold mb-2">{match.title}</h2>
                
                <div className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">League:</span> {match.league}
                </div>
                
                <div className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Time:</span> {match.startTimeEST} - {match.endTimeEST}
                </div>
                
                <div className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">Network:</span>{' '}
                  {Array.isArray(match.network) ? match.network.join(', ') : match.network}
                </div>
                
                {match.regionalRestrictions && (
                  <div className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded mt-2 inline-block">
                    Regional Restrictions
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {filteredMatches.length === 0 && (
            <p className="text-gray-500">No matches found for this filter.</p>
          )}
          
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Data Summary</h2>
            <ul className="list-disc pl-5">
              <li>Matches: {data.matches.length}</li>
              <li>Movies: {data.movies.length}</li>
              <li>Series: {data.series.length}</li>
              {data.ca_matches && <li>Canadian Matches: {data.ca_matches.length}</li>}
              {data.ca_movies && <li>Canadian Movies: {data.ca_movies.length}</li>}
              {data.ca_series && <li>Canadian Series: {data.ca_series.length}</li>}
            </ul>
          </div>
        </>
      )}
    </div>
  );
} 