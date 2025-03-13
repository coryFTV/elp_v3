import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MediaCard from '@/components/MediaCard';
import { Movie } from '@/interfaces/Movie';
import { Series } from '@/interfaces/Series';

// Mock the next/navigation module
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

describe('MediaCard Component', () => {
  // Sample movie data for testing
  const movieData: Movie = {
    id: '1',
    title: 'Test Movie',
    releaseYear: 2020,
    genre: 'Action',
    director: 'Director Name',
    actors: ['Actor 1', 'Actor 2'],
    description: 'This is a test movie description that is long enough to be truncated in the UI.',
    duration: 120,
    rating: 8.5,
    imageUrl: '/test-movie.jpg',
    streamingUrl: '/stream-movie',
    networkId: '1',
    network: 'Test Network',
    regionalRestrictions: false
  };

  // Sample series data for testing
  const seriesData: Series = {
    id: '2',
    title: 'Test Series',
    startYear: 2018,
    endYear: 2022,
    genre: 'Drama',
    creator: 'Creator Name',
    actors: ['Actor 3', 'Actor 4'],
    description: 'This is a test series description that is long enough to be truncated in the UI.',
    seasons: 5,
    episodes: 50,
    rating: 9.0,
    imageUrl: '/test-series.jpg',
    streamingUrl: '/stream-series',
    networkId: '2',
    network: 'Test Network 2',
    regionalRestrictions: true
  };

  test('renders movie card correctly', () => {
    render(<MediaCard media={movieData} type="movie" />);
    
    // Check if the title is rendered
    expect(screen.getByText('Test Movie')).toBeInTheDocument();
    
    // Check if the year is rendered
    expect(screen.getByText('2020')).toBeInTheDocument();
    
    // Check if the genre is rendered
    expect(screen.getByText('Action')).toBeInTheDocument();
    
    // Check if the rating is rendered
    expect(screen.getByText('8.5')).toBeInTheDocument();
    
    // Check if the image is rendered with the correct src
    const image = screen.getByAltText('Test Movie') as HTMLImageElement;
    expect(image).toBeInTheDocument();
    expect(image.src).toContain('/test-movie.jpg');
    
    // Check if the description is truncated
    const description = screen.getByText(/This is a test movie description/);
    expect(description).toBeInTheDocument();
    
    // Check if the "Watch Now" button is rendered
    expect(screen.getByText('Watch Now')).toBeInTheDocument();
  });

  test('renders series card correctly', () => {
    render(<MediaCard media={seriesData} type="series" />);
    
    // Check if the title is rendered
    expect(screen.getByText('Test Series')).toBeInTheDocument();
    
    // Check if the year range is rendered
    expect(screen.getByText('2018-2022')).toBeInTheDocument();
    
    // Check if the genre is rendered
    expect(screen.getByText('Drama')).toBeInTheDocument();
    
    // Check if the rating is rendered
    expect(screen.getByText('9.0')).toBeInTheDocument();
    
    // Check if the image is rendered with the correct src
    const image = screen.getByAltText('Test Series') as HTMLImageElement;
    expect(image).toBeInTheDocument();
    expect(image.src).toContain('/test-series.jpg');
    
    // Check if the description is truncated
    const description = screen.getByText(/This is a test series description/);
    expect(description).toBeInTheDocument();
    
    // Check if the "Watch Now" button is rendered
    expect(screen.getByText('Watch Now')).toBeInTheDocument();
    
    // Check if the regional restriction badge is shown
    expect(screen.getByText('Regional Restrictions Apply')).toBeInTheDocument();
  });

  test('renders ongoing series correctly', () => {
    const ongoingSeries = {
      ...seriesData,
      endYear: null,
    };
    
    render(<MediaCard media={ongoingSeries} type="series" />);
    
    // Check if the year range shows "2018-Present" for ongoing series
    expect(screen.getByText('2018-Present')).toBeInTheDocument();
  });

  test('handles click on Watch Now button', () => {
    const { useRouter } = require('next/navigation');
    const pushMock = jest.fn();
    useRouter.mockImplementation(() => ({
      push: pushMock,
    }));
    
    render(<MediaCard media={movieData} type="movie" />);
    
    // Click the "Watch Now" button
    fireEvent.click(screen.getByText('Watch Now'));
    
    // Check if the router.push was called with the correct URL
    expect(pushMock).toHaveBeenCalledWith('/stream-movie');
  });

  test('truncates long descriptions', () => {
    const longDescriptionMovie = {
      ...movieData,
      description: 'A'.repeat(200), // Create a very long description
    };
    
    render(<MediaCard media={longDescriptionMovie} type="movie" />);
    
    // The description should be truncated
    const description = screen.getByText(/A+/);
    expect(description.textContent?.length).toBeLessThan(200);
    expect(description.textContent?.endsWith('...')).toBe(true);
  });
}); 