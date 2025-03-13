'use client';

import { Movie } from '@/types/movie';

// Helper function to get the correct data URL based on environment
const getDataUrl = () => {
  return process.env.NODE_ENV === 'test' 
    ? '/data/sampleMovies.json' 
    : '/data/sampleMovies.json';
};

// Fetch all movies
export const fetchMovies = async (): Promise<Movie[]> => {
  try {
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
    movie.description.toLowerCase().includes(lowerCaseSearchTerm)
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
  return [...movies].sort((a, b) => 
    ascending 
      ? a.rating - b.rating 
      : b.rating - a.rating
  );
};

// Get unique genres from the movie list
export const getUniqueGenres = (movies: Movie[]): string[] => {
  const genreSet = new Set<string>(movies.map(movie => movie.genre));
  return ['All', ...Array.from(genreSet)];
}; 