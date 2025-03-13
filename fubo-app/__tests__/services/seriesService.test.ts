import {
  fetchSeries,
  searchSeriesByTitle,
  filterSeriesByGenre,
  sortSeriesByStartYear,
  sortSeriesByRating,
  getUniqueGenres
} from '@/services/seriesService';
import { Series } from '@/interfaces/Series';

// Mock fetch
global.fetch = jest.fn();

describe('Series Service', () => {
  // Sample series data for testing
  const mockSeries: Series[] = [
    {
      id: '1',
      title: 'Breaking Bad',
      startYear: 2008,
      endYear: 2013,
      genre: 'Drama',
      creator: 'Vince Gilligan',
      actors: ['Bryan Cranston', 'Aaron Paul'],
      description: 'A high school chemistry teacher turned methamphetamine manufacturer.',
      seasons: 5,
      episodes: 62,
      rating: 9.5,
      imageUrl: '/breaking-bad.jpg',
      streamingUrl: '/stream/breaking-bad',
      networkId: '1',
      network: 'AMC',
      regionalRestrictions: false
    },
    {
      id: '2',
      title: 'Game of Thrones',
      startYear: 2011,
      endYear: 2019,
      genre: 'Fantasy',
      creator: 'David Benioff, D.B. Weiss',
      actors: ['Emilia Clarke', 'Kit Harington'],
      description: 'Noble families fight for control over the lands of Westeros.',
      seasons: 8,
      episodes: 73,
      rating: 9.2,
      imageUrl: '/got.jpg',
      streamingUrl: '/stream/got',
      networkId: '2',
      network: 'HBO',
      regionalRestrictions: true
    },
    {
      id: '3',
      title: 'Stranger Things',
      startYear: 2016,
      endYear: null,
      genre: 'Sci-Fi',
      creator: 'The Duffer Brothers',
      actors: ['Millie Bobby Brown', 'Finn Wolfhard'],
      description: 'A group of kids encounter supernatural forces and secret government exploits.',
      seasons: 4,
      episodes: 34,
      rating: 8.7,
      imageUrl: '/stranger-things.jpg',
      streamingUrl: '/stream/stranger-things',
      networkId: '3',
      network: 'Netflix',
      regionalRestrictions: false
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchSeries', () => {
    test('fetches series successfully', async () => {
      // Mock the fetch response
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockSeries
      });

      const result = await fetchSeries();
      
      // Check if fetch was called with the correct URL
      expect(global.fetch).toHaveBeenCalledWith('/api/series');
      
      // Check if the result matches the mock data
      expect(result).toEqual(mockSeries);
    });

    test('handles fetch error', async () => {
      // Mock a failed fetch response
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      });

      // The function should throw an error
      await expect(fetchSeries()).rejects.toThrow('Failed to fetch series: 404 Not Found');
    });

    test('handles network error', async () => {
      // Mock a network error
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      // The function should throw an error
      await expect(fetchSeries()).rejects.toThrow('Failed to fetch series: Network error');
    });
  });

  describe('searchSeriesByTitle', () => {
    test('returns all series when search term is empty', () => {
      const result = searchSeriesByTitle(mockSeries, '');
      expect(result).toEqual(mockSeries);
    });

    test('filters series by title (case insensitive)', () => {
      const result = searchSeriesByTitle(mockSeries, 'breaking');
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Breaking Bad');
    });

    test('returns empty array when no matches found', () => {
      const result = searchSeriesByTitle(mockSeries, 'nonexistent series');
      expect(result).toHaveLength(0);
    });

    test('handles partial matches', () => {
      const result = searchSeriesByTitle(mockSeries, 'er');
      expect(result).toHaveLength(2);
      expect(result.map(series => series.title)).toContain('Stranger Things');
      expect(result.map(series => series.title)).toContain('Breaking Bad');
    });
  });

  describe('filterSeriesByGenre', () => {
    test('returns all series when genre is "All"', () => {
      const result = filterSeriesByGenre(mockSeries, 'All');
      expect(result).toEqual(mockSeries);
    });

    test('filters series by genre', () => {
      const result = filterSeriesByGenre(mockSeries, 'Fantasy');
      expect(result).toHaveLength(1);
      expect(result[0].genre).toBe('Fantasy');
    });

    test('returns empty array when no matches found', () => {
      const result = filterSeriesByGenre(mockSeries, 'Comedy');
      expect(result).toHaveLength(0);
    });
  });

  describe('sortSeriesByStartYear', () => {
    test('sorts series by start year in ascending order', () => {
      const result = sortSeriesByStartYear(mockSeries, true);
      expect(result[0].startYear).toBe(2008);
      expect(result[1].startYear).toBe(2011);
      expect(result[2].startYear).toBe(2016);
    });

    test('sorts series by start year in descending order', () => {
      const result = sortSeriesByStartYear(mockSeries, false);
      expect(result[0].startYear).toBe(2016);
      expect(result[1].startYear).toBe(2011);
      expect(result[2].startYear).toBe(2008);
    });
  });

  describe('sortSeriesByRating', () => {
    test('sorts series by rating in ascending order', () => {
      const result = sortSeriesByRating(mockSeries, true);
      expect(result[0].rating).toBe(8.7);
      expect(result[1].rating).toBe(9.2);
      expect(result[2].rating).toBe(9.5);
    });

    test('sorts series by rating in descending order', () => {
      const result = sortSeriesByRating(mockSeries, false);
      expect(result[0].rating).toBe(9.5);
      expect(result[1].rating).toBe(9.2);
      expect(result[2].rating).toBe(8.7);
    });
  });

  describe('getUniqueGenres', () => {
    test('returns unique genres with "All" as the first option', () => {
      const result = getUniqueGenres(mockSeries);
      expect(result).toEqual(['All', 'Drama', 'Fantasy', 'Sci-Fi']);
    });

    test('handles empty series array', () => {
      const result = getUniqueGenres([]);
      expect(result).toEqual(['All']);
    });

    test('handles duplicate genres', () => {
      const seriesWithDuplicateGenres = [
        ...mockSeries,
        {
          id: '4',
          title: 'Better Call Saul',
          startYear: 2015,
          endYear: 2022,
          genre: 'Drama',
          creator: 'Vince Gilligan, Peter Gould',
          actors: ['Bob Odenkirk', 'Rhea Seehorn'],
          description: 'The trials and tribulations of criminal lawyer Jimmy McGill.',
          seasons: 6,
          episodes: 63,
          rating: 8.9,
          imageUrl: '/better-call-saul.jpg',
          streamingUrl: '/stream/better-call-saul',
          networkId: '1',
          network: 'AMC',
          regionalRestrictions: false
        }
      ];
      
      const result = getUniqueGenres(seriesWithDuplicateGenres);
      expect(result).toEqual(['All', 'Drama', 'Fantasy', 'Sci-Fi']);
    });
  });
}); 