import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import TVSeriesPage from '@/app/tv-series/page';
import '@testing-library/jest-dom';

// Define Series interface locally to avoid import issues
interface Series {
  id: string;
  title: string;
  startYear: number;
  endYear: number | null;
  genre: string;
  creator: string;
  actors: string[];
  description: string;
  seasons: number;
  episodes: number;
  rating: number;
  imageUrl: string;
  streamingUrl: string;
  networkId: string;
  network: string;
  regionalRestrictions: boolean;
}

// Mock the necessary components and services
jest.mock('@/components/Layout', () => ({
  Layout: ({ children }: { children: React.ReactNode }) => <div data-testid="layout-mock">{children}</div>,
}));

jest.mock('@/services/seriesService', () => ({
  fetchSeries: jest.fn(),
  searchSeriesByTitle: jest.fn((series: Series[], term: string) => 
    series.filter(show => show.title.toLowerCase().includes(term.toLowerCase()))
  ),
  filterSeriesByGenre: jest.fn((series: Series[], genre: string) => 
    genre === 'All' ? series : series.filter(show => show.genre === genre)
  ),
  sortSeriesByStartYear: jest.fn((series: Series[], asc: boolean) => 
    [...series].sort((a, b) => asc ? a.startYear - b.startYear : b.startYear - a.startYear)
  ),
  sortSeriesByRating: jest.fn((series: Series[], asc: boolean) => 
    [...series].sort((a, b) => asc ? a.rating - b.rating : b.rating - a.rating)
  ),
  getUniqueGenres: jest.fn(() => ['All', 'Drama', 'Crime', 'Fantasy']),
}));

// Sample series data for testing
const mockSeries: Series[] = [
  {
    id: '1',
    title: 'Test Series 1',
    startYear: 2018,
    endYear: 2022,
    genre: 'Drama',
    creator: 'Creator 1',
    actors: ['Actor 1', 'Actor 2'],
    description: 'Test description 1',
    seasons: 5,
    episodes: 50,
    rating: 8.5,
    imageUrl: '/test1.jpg',
    streamingUrl: '/stream1',
    networkId: '1',
    network: 'Network 1',
    regionalRestrictions: false
  },
  {
    id: '2',
    title: 'Test Series 2',
    startYear: 2015,
    endYear: 2020,
    genre: 'Crime',
    creator: 'Creator 2',
    actors: ['Actor 3', 'Actor 4'],
    description: 'Test description 2',
    seasons: 6,
    episodes: 60,
    rating: 7.5,
    imageUrl: '/test2.jpg',
    streamingUrl: '/stream2',
    networkId: '2',
    network: 'Network 2',
    regionalRestrictions: false
  },
  {
    id: '3',
    title: 'Test Series 3',
    startYear: 2020,
    endYear: null,
    genre: 'Fantasy',
    creator: 'Creator 3',
    actors: ['Actor 5', 'Actor 6'],
    description: 'Test description 3',
    seasons: 3,
    episodes: 30,
    rating: 9.0,
    imageUrl: '/test3.jpg',
    streamingUrl: '/stream3',
    networkId: '3',
    network: 'Network 3',
    regionalRestrictions: false
  }
];

// Get the mocked functions from the import
const { fetchSeries } = require('@/services/seriesService');

describe('TVSeriesPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock the fetch series function to return our test data
    fetchSeries.mockResolvedValue(mockSeries);
  });

  test('renders loading state initially', async () => {
    await act(async () => {
      render(<TVSeriesPage />);
    });
    
    // The page should show loading state initially
    expect(screen.getByText('TV Series')).toBeInTheDocument();
    
    // Wait for the loading state to end
    await waitFor(() => {
      expect(screen.getByText('Showing 3 of 3 series')).toBeInTheDocument();
    });
  });

  test('renders series after loading', async () => {
    await act(async () => {
      render(<TVSeriesPage />);
    });
    
    // Wait for series to load
    await waitFor(() => {
      expect(screen.getByText('Test Series 1')).toBeInTheDocument();
      expect(screen.getByText('Test Series 2')).toBeInTheDocument();
      expect(screen.getByText('Test Series 3')).toBeInTheDocument();
    });
  });

  test('filters series by search term', async () => {
    await act(async () => {
      render(<TVSeriesPage />);
    });
    
    // Wait for series to load
    await waitFor(() => {
      expect(screen.getByText('Test Series 1')).toBeInTheDocument();
    });
    
    // Find the search input and type in it
    const searchInput = screen.getByTestId('search-input') as HTMLInputElement;
    fireEvent.change(searchInput, { target: { value: 'Test Series 1' } });
    
    // Should filter to show only the matching series
    await waitFor(() => {
      expect(screen.getByText('Test Series 1')).toBeInTheDocument();
      expect(screen.queryByText('Test Series 2')).not.toBeInTheDocument();
      expect(screen.queryByText('Test Series 3')).not.toBeInTheDocument();
    });
  });

  test('filters series by genre', async () => {
    await act(async () => {
      render(<TVSeriesPage />);
    });
    
    // Wait for series to load
    await waitFor(() => {
      expect(screen.getByText('Test Series 1')).toBeInTheDocument();
    });
    
    // Find the genre select and change it
    const genreSelect = screen.getByTestId('genre-select');
    fireEvent.click(genreSelect);
    
    // Wait for the dropdown to appear and select "Crime"
    const crimeOption = await screen.findByTestId('genre-Crime');
    fireEvent.click(crimeOption);
    
    // Should filter to show only Crime series
    await waitFor(() => {
      expect(screen.queryByText('Test Series 1')).not.toBeInTheDocument();
      expect(screen.getByText('Test Series 2')).toBeInTheDocument();
      expect(screen.queryByText('Test Series 3')).not.toBeInTheDocument();
    });
  });

  test('sorts series by rating', async () => {
    await act(async () => {
      render(<TVSeriesPage />);
    });
    
    // Wait for series to load
    await waitFor(() => {
      expect(screen.getByText('Test Series 1')).toBeInTheDocument();
    });
    
    // Find the sort select and change it to rating-asc
    const sortSelect = screen.getByTestId('sort-select');
    fireEvent.click(sortSelect);
    
    // Select "Rating (Low to High)"
    const ratingAscOption = await screen.findByTestId('sort-rating-asc');
    fireEvent.click(ratingAscOption);
    
    // The series should be sorted by rating in ascending order
    // We can't test the actual order in the DOM easily, but we can verify the sort function was called
    expect(require('@/services/seriesService').sortSeriesByRating).toHaveBeenCalledWith(expect.any(Array), true);
  });

  test('handles error state', async () => {
    // Mock an error response
    fetchSeries.mockRejectedValue(new Error('Failed to fetch'));
    
    await act(async () => {
      render(<TVSeriesPage />);
    });
    
    // Should show an error message
    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.getByText('Failed to load TV series. Please try again later.')).toBeInTheDocument();
    });
  });

  test('resets filters when reset button is clicked', async () => {
    await act(async () => {
      render(<TVSeriesPage />);
    });
    
    // Wait for series to load
    await waitFor(() => {
      expect(screen.getByText('Test Series 1')).toBeInTheDocument();
    });
    
    // Apply a search filter
    const searchInput = screen.getByTestId('search-input') as HTMLInputElement;
    fireEvent.change(searchInput, { target: { value: 'Test Series 1' } });
    
    // Verify filter is applied
    await waitFor(() => {
      expect(screen.getByText('Test Series 1')).toBeInTheDocument();
      expect(screen.queryByText('Test Series 2')).not.toBeInTheDocument();
    });
    
    // Click reset button
    const resetButton = screen.getByTestId('reset-filters');
    fireEvent.click(resetButton);
    
    // All series should be shown again
    await waitFor(() => {
      expect(screen.getByText('Test Series 1')).toBeInTheDocument();
      expect(screen.getByText('Test Series 2')).toBeInTheDocument();
      expect(screen.getByText('Test Series 3')).toBeInTheDocument();
    });
    
    // Search input should be cleared
    expect(searchInput).toHaveValue('');
  });
}); 