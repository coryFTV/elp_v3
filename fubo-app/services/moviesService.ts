'use client';

import { Movie } from '@/types/movie';
import { fetchFuboData } from './data/fuboDataService';

// Helper function to get the correct data URL based on environment
const getDataUrl = () => {
  return process.env.NODE_ENV === 'test' 
    ? '/data/sampleMovies.json' 
    : '/data/sampleMovies.json';
};

// Convert Fubo movies to app Movie type
const convertFuboMoviesToAppFormat = (fuboMovies: any[]): Movie[] => {
  return fuboMovies.map(movie => ({
    id: movie.id,
    title: movie.title,
    releaseYear: movie.releaseYear || 2023,
    genre: movie.genres && movie.genres.length > 0 ? movie.genres[0] : 'Unknown',
    directors: movie.directors || [],
    actors: movie.actors || [],
    description: movie.longDescription || movie.shortDescription || '',
    duration: movie.duration || 0,
    durationSeconds: movie.durationSeconds || 0,
    rating: movie.rating || 'NR',
    thumbnail: movie.poster || movie.thumbnail || '',
    imageUrl: movie.poster || movie.thumbnail || '',
    network: movie.network || '',
    streamingUrl: movie.url || '',
    deepLink: movie.deepLink || '',
    tmsId: movie.tmsId || '',
    // Additional fields
    shortDescription: movie.shortDescription || '',
    longDescription: movie.longDescription || '',
    genres: movie.genres || [],
    poster: movie.poster || '',
    url: movie.url || '',
    licenseWindowStart: movie.licenseWindowStart || '',
    licenseWindowEnd: movie.licenseWindowEnd || '',
    regionalRestrictions: false
  }));
};

// Fetch all movies
export const fetchMovies = async (): Promise<Movie[]> => {
  try {
    // First try to fetch from Fubo data service
    try {
      const fuboData = await fetchFuboData(['movies']);
      if (fuboData.movies && fuboData.movies.length > 0) {
        console.log('Using Fubo API data for movies');
        return convertFuboMoviesToAppFormat(fuboData.movies);
      }
    } catch (fuboError) {
      console.warn('Error fetching from Fubo API, falling back to sample data:', fuboError);
    }
    
    // Fallback to sample data
    console.log('Using sample data for movies');
    const response = await fetch(getDataUrl());
    if (!response.ok) {
      throw new Error('Failed to fetch movies');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
};

// Search movies by title
export const searchMoviesByTitle = (movies: Movie[], searchTerm: string): Movie[] => {
  if (!searchTerm.trim()) return movies;
  const lowerCaseSearchTerm = searchTerm.toLowerCase();
  
  return movies.filter(movie => 
    movie.title.toLowerCase().includes(lowerCaseSearchTerm) ||
    (movie.description ? movie.description.toLowerCase().includes(lowerCaseSearchTerm) : false)
  );
};

// Filter movies by genre
export const filterMoviesByGenre = (movies: Movie[], genre: string): Movie[] => {
  if (!genre || genre === 'All') return movies;
  return movies.filter(movie => movie.genre === genre);
};

// Sort movies by release year
export const sortMoviesByReleaseYear = (movies: Movie[], ascending: boolean = false): Movie[] => {
  return [...movies].sort((a, b) => 
    ascending 
      ? a.releaseYear - b.releaseYear 
      : b.releaseYear - a.releaseYear
  );
};

// Sort movies by rating
export const sortMoviesByRating = (movies: Movie[], ascending: boolean = false): Movie[] => {
  return [...movies].sort((a, b) => {
    // Convert ratings to numbers for comparison
    const ratingA = typeof a.rating === 'number' ? a.rating : 0;
    const ratingB = typeof b.rating === 'number' ? b.rating : 0;
    
    return ascending 
      ? ratingA - ratingB
      : ratingB - ratingA;
  });
};

// Get unique genres from the movie list
export const getUniqueGenres = (movies: Movie[]): string[] => {
  const genreSet = new Set<string>(movies.map(movie => movie.genre));
  return ['All', ...Array.from(genreSet)];
}; 