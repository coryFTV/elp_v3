import {
  fetchMovies,
  searchMoviesByTitle,
  filterMoviesByGenre,
  sortMoviesByReleaseYear,
  sortMoviesByRating,
  getUniqueGenres
} from '@/services/moviesService';
import { Movie } from '@/interfaces/Movie';

// Mock fetch
global.fetch = jest.fn();

describe('Movies Service', () => {
  // Sample movie data for testing
  const mockMovies: Movie[] = [
    {
      id: '1',
      title: 'The Avengers',
      releaseYear: 2012,
      genre: 'Action',
      director: 'Joss Whedon',
      actors: ['Robert Downey Jr.', 'Chris Evans'],
      description: 'Earth\'s mightiest heroes must come together to save the world.',
      duration: 143,
      rating: 8.0,
      imageUrl: '/avengers.jpg',
      streamingUrl: '/stream/avengers',
      networkId: '1',
      network: 'Marvel',
      regionalRestrictions: false
    },
    {
      id: '2',
      title: 'The Godfather',
      releaseYear: 1972,
      genre: 'Drama',
      director: 'Francis Ford Coppola',
      actors: ['Marlon Brando', 'Al Pacino'],
      description: 'The aging patriarch of an organized crime dynasty transfers control to his son.',
      duration: 175,
      rating: 9.2,
      imageUrl: '/godfather.jpg',
      streamingUrl: '/stream/godfather',
      networkId: '2',
      network: 'Paramount',
      regionalRestrictions: false
    },
    {
      id: '3',
      title: 'Inception',
      releaseYear: 2010,
      genre: 'Sci-Fi',
      director: 'Christopher Nolan',
      actors: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt'],
      description: 'A thief who steals corporate secrets through dream-sharing technology.',
      duration: 148,
      rating: 8.8,
      imageUrl: '/inception.jpg',
      streamingUrl: '/stream/inception',
      networkId: '3',
      network: 'Warner Bros',
      regionalRestrictions: true
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchMovies', () => {
    test('fetches movies successfully', async () => {
      // Mock the fetch response
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockMovies
      });

      const result = await fetchMovies();
      
      // Check if fetch was called with the correct URL
      expect(global.fetch).toHaveBeenCalledWith('/api/movies');
      
      // Check if the result matches the mock data
      expect(result).toEqual(mockMovies);
    });

    test('handles fetch error', async () => {
      // Mock a failed fetch response
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      });

      // The function should throw an error
      await expect(fetchMovies()).rejects.toThrow('Failed to fetch movies: 404 Not Found');
    });

    test('handles network error', async () => {
      // Mock a network error
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      // The function should throw an error
      await expect(fetchMovies()).rejects.toThrow('Failed to fetch movies: Network error');
    });
  });

  describe('searchMoviesByTitle', () => {
    test('returns all movies when search term is empty', () => {
      const result = searchMoviesByTitle(mockMovies, '');
      expect(result).toEqual(mockMovies);
    });

    test('filters movies by title (case insensitive)', () => {
      const result = searchMoviesByTitle(mockMovies, 'avengers');
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('The Avengers');
    });

    test('returns empty array when no matches found', () => {
      const result = searchMoviesByTitle(mockMovies, 'nonexistent movie');
      expect(result).toHaveLength(0);
    });

    test('handles partial matches', () => {
      const result = searchMoviesByTitle(mockMovies, 'the');
      expect(result).toHaveLength(2);
      expect(result.map(movie => movie.title)).toContain('The Avengers');
      expect(result.map(movie => movie.title)).toContain('The Godfather');
    });
  });

  describe('filterMoviesByGenre', () => {
    test('returns all movies when genre is "All"', () => {
      const result = filterMoviesByGenre(mockMovies, 'All');
      expect(result).toEqual(mockMovies);
    });

    test('filters movies by genre', () => {
      const result = filterMoviesByGenre(mockMovies, 'Drama');
      expect(result).toHaveLength(1);
      expect(result[0].genre).toBe('Drama');
    });

    test('returns empty array when no matches found', () => {
      const result = filterMoviesByGenre(mockMovies, 'Comedy');
      expect(result).toHaveLength(0);
    });
  });

  describe('sortMoviesByReleaseYear', () => {
    test('sorts movies by release year in ascending order', () => {
      const result = sortMoviesByReleaseYear(mockMovies, true);
      expect(result[0].releaseYear).toBe(1972);
      expect(result[1].releaseYear).toBe(2010);
      expect(result[2].releaseYear).toBe(2012);
    });

    test('sorts movies by release year in descending order', () => {
      const result = sortMoviesByReleaseYear(mockMovies, false);
      expect(result[0].releaseYear).toBe(2012);
      expect(result[1].releaseYear).toBe(2010);
      expect(result[2].releaseYear).toBe(1972);
    });
  });

  describe('sortMoviesByRating', () => {
    test('sorts movies by rating in ascending order', () => {
      const result = sortMoviesByRating(mockMovies, true);
      expect(result[0].rating).toBe(8.0);
      expect(result[1].rating).toBe(8.8);
      expect(result[2].rating).toBe(9.2);
    });

    test('sorts movies by rating in descending order', () => {
      const result = sortMoviesByRating(mockMovies, false);
      expect(result[0].rating).toBe(9.2);
      expect(result[1].rating).toBe(8.8);
      expect(result[2].rating).toBe(8.0);
    });
  });

  describe('getUniqueGenres', () => {
    test('returns unique genres with "All" as the first option', () => {
      const result = getUniqueGenres(mockMovies);
      expect(result).toEqual(['All', 'Action', 'Drama', 'Sci-Fi']);
    });

    test('handles empty movie array', () => {
      const result = getUniqueGenres([]);
      expect(result).toEqual(['All']);
    });

    test('handles duplicate genres', () => {
      const moviesWithDuplicateGenres = [
        ...mockMovies,
        {
          id: '4',
          title: 'Another Action Movie',
          releaseYear: 2020,
          genre: 'Action',
          director: 'Director Name',
          actors: ['Actor 1', 'Actor 2'],
          description: 'Description',
          duration: 120,
          rating: 7.5,
          imageUrl: '/action.jpg',
          streamingUrl: '/stream/action',
          networkId: '4',
          network: 'Network',
          regionalRestrictions: false
        }
      ];
      
      const result = getUniqueGenres(moviesWithDuplicateGenres);
      expect(result).toEqual(['All', 'Action', 'Drama', 'Sci-Fi']);
    });
  });
}); 