'use client';

import { Series } from '@/types/series';
import { fetchFuboData } from './data/fuboDataService';

// Helper function to get the correct data URL based on environment
const getDataUrl = () => {
  return process.env.NODE_ENV === 'test' 
    ? '/data/sampleSeries.json' 
    : '/data/sampleSeries.json';
};

// Convert Fubo series to app Series type
const convertFuboSeriesToAppFormat = (fuboSeries: any[]): Series[] => {
  return fuboSeries.map(series => {
    // Extract year from the originalAiringDate if available
    const startYear = series.originalAiringDate 
      ? parseInt(series.originalAiringDate.split('-')[0], 10)
      : 2023;
    
    return {
      id: series.id,
      title: series.title,
      startYear: startYear,
      endYear: null, // Not available in Fubo data
      genre: series.genre || 'Unknown',
      description: series.description || '',
      rating: series.rating || 'NR',
      imageUrl: series.thumbnail || '',
      thumbnail: series.thumbnail || '',
      network: series.network || '',
      url: series.url || '',
      deepLink: series.deepLink || '',
      originalAiringDate: series.originalAiringDate || '',
      episodes: series.episodes || [],
      regionalRestrictions: false
    };
  });
};

// Fetch all series
export const fetchSeries = async (): Promise<Series[]> => {
  try {
    // First try to fetch from Fubo data service
    try {
      const fuboData = await fetchFuboData(['series']);
      if (fuboData.series && fuboData.series.length > 0) {
        console.log('Using Fubo API data for series');
        return convertFuboSeriesToAppFormat(fuboData.series);
      }
    } catch (fuboError) {
      console.warn('Error fetching from Fubo API, falling back to sample data:', fuboError);
    }
    
    // Fallback to sample data
    console.log('Using sample data for series');
    const response = await fetch(getDataUrl());
    if (!response.ok) {
      throw new Error('Failed to fetch TV series');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching TV series:', error);
    throw error;
  }
};

// Search series by title
export const searchSeriesByTitle = (seriesList: Series[], searchTerm: string): Series[] => {
  if (!searchTerm.trim()) return seriesList;
  const lowerCaseSearchTerm = searchTerm.toLowerCase();
  
  return seriesList.filter(series => 
    series.title.toLowerCase().includes(lowerCaseSearchTerm) ||
    (series.description ? series.description.toLowerCase().includes(lowerCaseSearchTerm) : false)
  );
};

// Filter series by genre
export const filterSeriesByGenre = (seriesList: Series[], genre: string): Series[] => {
  if (!genre || genre === 'All') return seriesList;
  return seriesList.filter(series => series.genre === genre);
};

// Sort series by start year
export const sortSeriesByStartYear = (seriesList: Series[], ascending: boolean = false): Series[] => {
  return [...seriesList].sort((a, b) => {
    const yearA = a.startYear || 0;
    const yearB = b.startYear || 0;
    return ascending 
      ? yearA - yearB
      : yearB - yearA;
  });
};

// Sort series by rating
export const sortSeriesByRating = (seriesList: Series[], ascending: boolean = false): Series[] => {
  return [...seriesList].sort((a, b) => {
    // Convert ratings to numbers for comparison
    const ratingA = typeof a.rating === 'number' ? a.rating : 0;
    const ratingB = typeof b.rating === 'number' ? b.rating : 0;
    
    return ascending 
      ? ratingA - ratingB
      : ratingB - ratingA;
  });
};

// Get unique genres from the series list
export const getUniqueGenres = (seriesList: Series[]): string[] => {
  const genreSet = new Set<string>(seriesList.map(series => series.genre || 'Unknown'));
  return ['All', ...Array.from(genreSet)];
}; 