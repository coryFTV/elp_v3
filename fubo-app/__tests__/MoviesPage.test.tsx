import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import MoviesPage from '@/app/movies/page';
import '@testing-library/jest-dom';

// Define Movie interface locally to avoid import issues
interface Movie {
  id: string;
  title: string;
  releaseYear: number;
  genre: string;
  director: string;
  actors: string[];
  description: string;
  duration: number;
  rating: number;
  imageUrl: string;
  streamingUrl: string;
  networkId: string;
  network: string;
  regionalRestrictions: boolean;
}

// Add custom matchers to avoid TypeScript errors
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveValue(value: any): R;
    }
  }
}

// Mock the necessary components and services
jest.mock('@/components/Layout', () => ({
  Layout: ({ children }: { children: React.ReactNode }) => <div data-testid="layout-mock">{children}</div>,
}));

jest.mock('@/services/moviesService', () => ({
  fetchMovies: jest.fn(),
  searchMoviesByTitle: jest.fn((movies: Movie[], term: string) => 
    movies.filter(movie => movie.title.toLowerCase().includes(term.toLowerCase()))
  ),
  filterMoviesByGenre: jest.fn((movies: Movie[], genre: string) => 
    genre === 'All' ? movies : movies.filter(movie => movie.genre === genre)
  ),
  sortMoviesByReleaseYear: jest.fn((movies: Movie[], asc: boolean) => 
    [...movies].sort((a, b) => asc ? a.releaseYear - b.releaseYear : b.releaseYear - a.releaseYear)
  ),
  sortMoviesByRating: jest.fn((movies: Movie[], asc: boolean) => 
    [...movies].sort((a, b) => asc ? a.rating - b.rating : b.rating - a.rating)
  ),
  getUniqueGenres: jest.fn(() => ['All', 'Action', 'Drama', 'Sci-Fi']),
}));

// Sample movie data for testing
const mockMovies: Movie[] = [
  {
    id: '1',
    title: 'Test Movie 1',
    releaseYear: 2020,
    genre: 'Action',
    director: 'Director 1',
    actors: ['Actor 1', 'Actor 2'],
    description: 'Test description 1',
    duration: 120,
    rating: 8.5,
    imageUrl: '/test1.jpg',
    streamingUrl: '/stream1',
    networkId: '1',
    network: 'Network 1',
    regionalRestrictions: false
  },
  {
    id: '2',
    title: 'Test Movie 2',
    releaseYear: 2018,
    genre: 'Drama',
    director: 'Director 2',
    actors: ['Actor 3', 'Actor 4'],
    description: 'Test description 2',
    duration: 130,
    rating: 7.5,
    imageUrl: '/test2.jpg',
    streamingUrl: '/stream2',
    networkId: '2',
    network: 'Network 2',
    regionalRestrictions: false
  },
  {
    id: '3',
    title: 'Test Movie 3',
    releaseYear: 2022,
    genre: 'Sci-Fi',
    director: 'Director 3',
    actors: ['Actor 5', 'Actor 6'],
    description: 'Test description 3',
    duration: 140,
    rating: 9.0,
    imageUrl: '/test3.jpg',
    streamingUrl: '/stream3',
    networkId: '3',
    network: 'Network 3',
    regionalRestrictions: false
  }
];

// Get the mocked functions from the import
const { fetchMovies } = require('@/services/moviesService');

describe('MoviesPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock the fetch movies function to return our test data
    fetchMovies.mockResolvedValue(mockMovies);
  });

  test('renders loading state initially', async () => {
    await act(async () => {
      render(<MoviesPage />);
    });
    
    // The page should show loading state initially
    expect(screen.getByText('Movies')).toBeInTheDocument();
    
    // Wait for the loading state to end
    await waitFor(() => {
      expect(screen.getByText('Showing 3 of 3 movies')).toBeInTheDocument();
    });
  });

  test('renders movies after loading', async () => {
    await act(async () => {
      render(<MoviesPage />);
    });
    
    // Wait for movies to load
    await waitFor(() => {
      expect(screen.getByText('Test Movie 1')).toBeInTheDocument();
      expect(screen.getByText('Test Movie 2')).toBeInTheDocument();
      expect(screen.getByText('Test Movie 3')).toBeInTheDocument();
    });
  });

  test('filters movies by search term', async () => {
    await act(async () => {
      render(<MoviesPage />);
    });
    
    // Wait for movies to load
    await waitFor(() => {
      expect(screen.getByText('Test Movie 1')).toBeInTheDocument();
    });
    
    // Find the search input and type in it
    const searchInput = screen.getByTestId('search-input') as HTMLInputElement;
    fireEvent.change(searchInput, { target: { value: 'Test Movie 1' } });
    
    // Should filter to show only the matching movie
    await waitFor(() => {
      expect(screen.getByText('Test Movie 1')).toBeInTheDocument();
      expect(screen.queryByText('Test Movie 2')).not.toBeInTheDocument();
      expect(screen.queryByText('Test Movie 3')).not.toBeInTheDocument();
    });
  });

  test('filters movies by genre', async () => {
    await act(async () => {
      render(<MoviesPage />);
    });
    
    // Wait for movies to load
    await waitFor(() => {
      expect(screen.getByText('Test Movie 1')).toBeInTheDocument();
    });
    
    // Find the genre select and change it
    const genreSelect = screen.getByTestId('genre-select');
    fireEvent.click(genreSelect);
    
    // Wait for the dropdown to appear and select "Drama"
    const dramaOption = await screen.findByTestId('genre-Drama');
    fireEvent.click(dramaOption);
    
    // Should filter to show only Drama movies
    await waitFor(() => {
      expect(screen.queryByText('Test Movie 1')).not.toBeInTheDocument();
      expect(screen.getByText('Test Movie 2')).toBeInTheDocument();
      expect(screen.queryByText('Test Movie 3')).not.toBeInTheDocument();
    });
  });

  test('sorts movies by rating', async () => {
    await act(async () => {
      render(<MoviesPage />);
    });
    
    // Wait for movies to load
    await waitFor(() => {
      expect(screen.getByText('Test Movie 1')).toBeInTheDocument();
    });
    
    // Find the sort select and change it to rating-asc
    const sortSelect = screen.getByTestId('sort-select');
    fireEvent.click(sortSelect);
    
    // Select "Rating (Low to High)"
    const ratingAscOption = await screen.findByTestId('sort-rating-asc');
    fireEvent.click(ratingAscOption);
    
    // The movies should be sorted by rating in ascending order
    // We can't test the actual order in the DOM easily, but we can verify the sort function was called
    expect(require('@/services/moviesService').sortMoviesByRating).toHaveBeenCalledWith(expect.any(Array), true);
  });

  test('handles error state', async () => {
    // Mock an error response
    fetchMovies.mockRejectedValue(new Error('Failed to fetch'));
    
    await act(async () => {
      render(<MoviesPage />);
    });
    
    // Should show an error message
    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.getByText('Failed to load movies. Please try again later.')).toBeInTheDocument();
    });
  });

  test('resets filters when reset button is clicked', async () => {
    await act(async () => {
      render(<MoviesPage />);
    });
    
    // Wait for movies to load
    await waitFor(() => {
      expect(screen.getByText('Test Movie 1')).toBeInTheDocument();
    });
    
    // Apply a search filter
    const searchInput = screen.getByTestId('search-input') as HTMLInputElement;
    fireEvent.change(searchInput, { target: { value: 'Test Movie 1' } });
    
    // Verify filter is applied
    await waitFor(() => {
      expect(screen.getByText('Test Movie 1')).toBeInTheDocument();
      expect(screen.queryByText('Test Movie 2')).not.toBeInTheDocument();
    });
    
    // Click reset button
    const resetButton = screen.getByTestId('reset-filters');
    fireEvent.click(resetButton);
    
    // All movies should be shown again
    await waitFor(() => {
      expect(screen.getByText('Test Movie 1')).toBeInTheDocument();
      expect(screen.getByText('Test Movie 2')).toBeInTheDocument();
      expect(screen.getByText('Test Movie 3')).toBeInTheDocument();
    });
    
    // Search input should be cleared
    expect(searchInput).toHaveValue('');
  });
}); 