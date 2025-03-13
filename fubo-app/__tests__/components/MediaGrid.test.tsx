import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MediaGrid from '@/components/MediaGrid';
import { Movie } from '@/interfaces/Movie';
import { Series } from '@/interfaces/Series';

// Mock the MediaCard component to simplify testing
jest.mock('@/components/MediaCard', () => {
  return function MockMediaCard({ media, type }: { media: any; type: string }) {
    return (
      <div data-testid={`media-card-${media.id}`} className="mock-media-card">
        <h3>{media.title}</h3>
        <p>Type: {type}</p>
      </div>
    );
  };
});

describe('MediaGrid Component', () => {
  // Sample movie data for testing
  const movieData: Movie[] = [
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
    }
  ];

  // Sample series data for testing
  const seriesData: Series[] = [
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
    }
  ];

  test('renders movie grid correctly', () => {
    render(<MediaGrid media={movieData} type="movie" />);
    
    // Check if the correct number of cards are rendered
    const cards = screen.getAllByTestId(/media-card-/);
    expect(cards).toHaveLength(2);
    
    // Check if the movie titles are rendered
    expect(screen.getByText('Test Movie 1')).toBeInTheDocument();
    expect(screen.getByText('Test Movie 2')).toBeInTheDocument();
    
    // Check if the correct media type is passed to the cards
    expect(screen.getAllByText('Type: movie')).toHaveLength(2);
  });

  test('renders series grid correctly', () => {
    render(<MediaGrid media={seriesData} type="series" />);
    
    // Check if the correct number of cards are rendered
    const cards = screen.getAllByTestId(/media-card-/);
    expect(cards).toHaveLength(2);
    
    // Check if the series titles are rendered
    expect(screen.getByText('Test Series 1')).toBeInTheDocument();
    expect(screen.getByText('Test Series 2')).toBeInTheDocument();
    
    // Check if the correct media type is passed to the cards
    expect(screen.getAllByText('Type: series')).toHaveLength(2);
  });

  test('renders empty state when no media is provided', () => {
    render(<MediaGrid media={[]} type="movie" />);
    
    // Check if the empty state message is rendered
    expect(screen.getByText('No results found.')).toBeInTheDocument();
  });

  test('renders loading state when isLoading is true', () => {
    render(<MediaGrid media={[]} type="movie" isLoading={true} />);
    
    // Check if the loading skeletons are rendered
    const skeletons = screen.getAllByTestId('media-card-skeleton');
    expect(skeletons.length).toBeGreaterThan(0);
    
    // The empty state message should not be rendered when loading
    expect(screen.queryByText('No results found.')).not.toBeInTheDocument();
  });

  test('renders error state when error is provided', () => {
    render(<MediaGrid media={[]} type="movie" error="Failed to load media" />);
    
    // Check if the error message is rendered
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('Failed to load media')).toBeInTheDocument();
    
    // The empty state message should not be rendered when there's an error
    expect(screen.queryByText('No results found.')).not.toBeInTheDocument();
  });
}); 