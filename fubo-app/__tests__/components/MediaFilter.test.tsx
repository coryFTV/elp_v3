import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MediaFilter from '@/components/MediaFilter';

describe('MediaFilter Component', () => {
  // Define props for testing
  const defaultProps = {
    searchTerm: '',
    onSearchChange: jest.fn(),
    selectedGenre: 'All',
    genres: ['All', 'Action', 'Drama', 'Comedy'],
    onGenreChange: jest.fn(),
    sortOption: 'release-desc',
    sortOptions: [
      { value: 'release-asc', label: 'Release Year (Old to New)' },
      { value: 'release-desc', label: 'Release Year (New to Old)' },
      { value: 'rating-asc', label: 'Rating (Low to High)' },
      { value: 'rating-desc', label: 'Rating (High to Low)' }
    ],
    onSortChange: jest.fn(),
    onResetFilters: jest.fn(),
    mediaType: 'movie'
  };

  test('renders all filter components', () => {
    render(<MediaFilter {...defaultProps} />);
    
    // Check if the search input is rendered
    expect(screen.getByPlaceholderText('Search movies...')).toBeInTheDocument();
    
    // Check if the genre select is rendered
    expect(screen.getByTestId('genre-select')).toBeInTheDocument();
    
    // Check if the sort select is rendered
    expect(screen.getByTestId('sort-select')).toBeInTheDocument();
    
    // Check if the reset button is rendered
    expect(screen.getByTestId('reset-filters')).toBeInTheDocument();
  });

  test('handles search input changes', () => {
    render(<MediaFilter {...defaultProps} />);
    
    // Get the search input
    const searchInput = screen.getByTestId('search-input');
    
    // Simulate typing in the search input
    fireEvent.change(searchInput, { target: { value: 'test search' } });
    
    // Check if the onSearchChange callback was called with the correct value
    expect(defaultProps.onSearchChange).toHaveBeenCalledWith('test search');
  });

  test('handles genre selection', async () => {
    render(<MediaFilter {...defaultProps} />);
    
    // Click on the genre select to open the dropdown
    const genreSelect = screen.getByTestId('genre-select');
    fireEvent.click(genreSelect);
    
    // Find and click on a genre option
    const dramaOption = await screen.findByTestId('genre-Drama');
    fireEvent.click(dramaOption);
    
    // Check if the onGenreChange callback was called with the correct value
    expect(defaultProps.onGenreChange).toHaveBeenCalledWith('Drama');
  });

  test('handles sort selection', async () => {
    render(<MediaFilter {...defaultProps} />);
    
    // Click on the sort select to open the dropdown
    const sortSelect = screen.getByTestId('sort-select');
    fireEvent.click(sortSelect);
    
    // Find and click on a sort option
    const ratingAscOption = await screen.findByTestId('sort-rating-asc');
    fireEvent.click(ratingAscOption);
    
    // Check if the onSortChange callback was called with the correct value
    expect(defaultProps.onSortChange).toHaveBeenCalledWith('rating-asc');
  });

  test('handles reset button click', () => {
    render(<MediaFilter {...defaultProps} />);
    
    // Click the reset button
    const resetButton = screen.getByTestId('reset-filters');
    fireEvent.click(resetButton);
    
    // Check if the onResetFilters callback was called
    expect(defaultProps.onResetFilters).toHaveBeenCalled();
  });

  test('renders with TV series placeholder when mediaType is series', () => {
    render(<MediaFilter {...defaultProps} mediaType="series" />);
    
    // Check if the search input has the correct placeholder for series
    expect(screen.getByPlaceholderText('Search TV series...')).toBeInTheDocument();
  });

  test('displays the correct selected genre', () => {
    render(<MediaFilter {...defaultProps} selectedGenre="Drama" />);
    
    // Check if the genre select shows the selected genre
    expect(screen.getByText('Drama')).toBeInTheDocument();
  });

  test('displays the correct selected sort option', () => {
    render(<MediaFilter {...defaultProps} sortOption="rating-desc" />);
    
    // Check if the sort select shows the selected sort option
    expect(screen.getByText('Rating (High to Low)')).toBeInTheDocument();
  });
}); 