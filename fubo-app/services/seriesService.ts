'use client';

import { Series } from '@/types/series';

// Helper function to get the correct data URL based on environment
const getDataUrl = () => {
  return process.env.NODE_ENV === 'test' 
    ? '/data/sampleSeries.json' 
    : '/data/sampleSeries.json';
};

// Fetch all series
export const fetchSeries = async (): Promise<Series[]> => {
  try {
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
    series.description.toLowerCase().includes(lowerCaseSearchTerm)
  );
};

// Filter series by genre
export const filterSeriesByGenre = (seriesList: Series[], genre: string): Series[] => {
  if (!genre || genre === 'All') return seriesList;
  return seriesList.filter(series => series.genre === genre);
};

// Sort series by start year
export const sortSeriesByStartYear = (seriesList: Series[], ascending: boolean = false): Series[] => {
  return [...seriesList].sort((a, b) => 
    ascending 
      ? a.startYear - b.startYear 
      : b.startYear - a.startYear
  );
};

// Sort series by rating
export const sortSeriesByRating = (seriesList: Series[], ascending: boolean = false): Series[] => {
  return [...seriesList].sort((a, b) => 
    ascending 
      ? a.rating - b.rating 
      : b.rating - a.rating
  );
};

// Get unique genres from the series list
export const getUniqueGenres = (seriesList: Series[]): string[] => {
  const genreSet = new Set<string>(seriesList.map(series => series.genre));
  return ['All', ...Array.from(genreSet)];
}; 