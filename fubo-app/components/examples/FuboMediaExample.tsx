import React, { useEffect, useState } from 'react';
import { fetchFuboData, FuboDataResult, ProcessedMovie, ProcessedSeries } from '../../services/data/fuboDataService';

/**
 * Example component that demonstrates how to display movies and series from the Fubo data service
 */
export default function FuboMediaExample() {
  const [data, setData] = useState<FuboDataResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'movies' | 'series'>('movies');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const result = await fetchFuboData();
        setData(result);
        setError(null);
      } catch (err) {
        console.error('Error loading Fubo data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter media based on search term
  const getFilteredMedia = () => {
    if (!data) return [];

    const mediaList = activeTab === 'movies' ? data.movies : data.series;
    
    if (!searchTerm.trim()) return mediaList;
    
    const term = searchTerm.toLowerCase();
    return mediaList.filter(item => {
      if (activeTab === 'movies') {
        const movie = item as ProcessedMovie;
        return movie.title.toLowerCase().includes(term) || 
               (movie.shortDescription && movie.shortDescription.toLowerCase().includes(term)) ||
               (movie.longDescription && movie.longDescription.toLowerCase().includes(term));
      } else {
        const series = item as ProcessedSeries;
        return series.title.toLowerCase().includes(term) || 
               (series.description && series.description.toLowerCase().includes(term));
      }
    });
  };

  const filteredMedia = getFilteredMedia();

  // Render a movie card
  const renderMovieCard = (movie: ProcessedMovie) => (
    <div key={movie.id} className="border rounded-lg p-4 shadow-sm">
      {movie.poster && (
        <div className="mb-3">
          <img 
            src={movie.poster} 
            alt={movie.title} 
            className="w-full h-40 object-cover rounded"
          />
        </div>
      )}
      
      <h2 className="text-lg font-semibold mb-2">{movie.title}</h2>
      
      {movie.shortDescription && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-3">{movie.shortDescription}</p>
      )}
      
      <div className="flex flex-wrap gap-2 mb-2">
        {movie.genres && movie.genres.map(genre => (
          <span key={genre} className="bg-gray-200 text-xs px-2 py-1 rounded">
            {genre}
          </span>
        ))}
      </div>
      
      <div className="text-sm text-gray-600">
        <div className="mb-1">
          <span className="font-medium">Rating:</span> {movie.rating || 'N/A'}
        </div>
        <div className="mb-1">
          <span className="font-medium">Year:</span> {movie.releaseYear || 'N/A'}
        </div>
        <div className="mb-1">
          <span className="font-medium">Duration:</span> {movie.duration ? `${movie.duration} min` : 'N/A'}
        </div>
      </div>
    </div>
  );

  // Render a series card
  const renderSeriesCard = (series: ProcessedSeries) => (
    <div key={series.id} className="border rounded-lg p-4 shadow-sm">
      {series.thumbnail && (
        <div className="mb-3">
          <img 
            src={series.thumbnail} 
            alt={series.title} 
            className="w-full h-40 object-cover rounded"
          />
        </div>
      )}
      
      <h2 className="text-lg font-semibold mb-2">{series.title}</h2>
      
      {series.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-3">{series.description}</p>
      )}
      
      <div className="flex flex-wrap gap-2 mb-2">
        {series.genre && (
          <span className="bg-gray-200 text-xs px-2 py-1 rounded">
            {series.genre}
          </span>
        )}
      </div>
      
      <div className="text-sm text-gray-600">
        <div className="mb-1">
          <span className="font-medium">Episodes:</span> {series.episodes?.length || 'N/A'}
        </div>
        <div className="mb-1">
          <span className="font-medium">Original Air Date:</span> {series.originalAiringDate || 'N/A'}
        </div>
        <div className="mb-1">
          <span className="font-medium">Network:</span> {series.network || 'N/A'}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Fubo Media Library</h1>
      
      {loading && <p className="text-gray-500">Loading data...</p>}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {data && !loading && (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
            <div className="flex mb-4 sm:mb-0">
              <button
                className={`px-4 py-2 mr-2 rounded ${activeTab === 'movies' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                onClick={() => setActiveTab('movies')}
              >
                Movies ({data.movies.length})
              </button>
              <button
                className={`px-4 py-2 rounded ${activeTab === 'series' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                onClick={() => setActiveTab('series')}
              >
                Series ({data.series.length})
              </button>
            </div>
            
            <div className="w-full sm:w-64">
              <input
                type="text"
                placeholder="Search..."
                className="w-full px-4 py-2 border rounded"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeTab === 'movies' 
              ? filteredMedia.map(movie => renderMovieCard(movie as ProcessedMovie))
              : filteredMedia.map(series => renderSeriesCard(series as ProcessedSeries))
            }
          </div>
          
          {filteredMedia.length === 0 && (
            <p className="text-gray-500 text-center py-8">
              No {activeTab} found matching your search criteria.
            </p>
          )}
        </>
      )}
    </div>
  );
} 