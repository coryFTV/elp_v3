import { fetchFuboData, clearCache } from '../../../services/data/fuboDataService';

// Mock the fetch function
global.fetch = jest.fn();
const mockFetch = global.fetch as jest.Mock;

// Mock localStorage
const mockLocalStorage: Record<string, string> = {};
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn((key: string) => mockLocalStorage[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      mockLocalStorage[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete mockLocalStorage[key];
    }),
    clear: jest.fn(() => {
      Object.keys(mockLocalStorage).forEach(key => {
        delete mockLocalStorage[key];
      });
    }),
  },
  writable: true,
});

// Mock Date.now() to return a fixed timestamp for testing
const mockNow = new Date('2025-03-13T15:00:00Z').getTime();
jest.spyOn(Date, 'now').mockImplementation(() => mockNow);

// Sample data for tests
const mockMatchesData = [
  {
    id: '29689504',
    title: 'Cancun Men\'s & Women\'s Round of 16 (Secondary Court)',
    hometeam: '',
    awayteam: '',
    hometeamabbr: '',
    awayteamabbr: '',
    hometeamID: '0',
    awayteamID: '0',
    starttime: '2025-03-13T13:50:00Z', // This is live at our mock time
    endtime: '2025-03-13T21:00:00Z',
    sport: 'Padel',
    league: 'Premier Padel Major',
    league_id: '23196420',
    network: 'beIN SPORTS 7',
    networkUrl: 'https://www.fubo.tv/welcome/channel/be-in-sports-7?irmp=365718&irad=596299',
    matchId: 'EP044993071016',
    matchUrl: 'https://www.fubo.tv/welcome/matches/EP044993071016?irmp=365718&irad=596299',
    thumbnail: 'https://gn-imgx.fubo.tv/assets/p23196420_i_h2_ab.jpg',
    country: 'US',
    url: 'https://www.fubo.tv/welcome/leagues/23196420?irmp=365718&irad=596299',
    regionalRestrictions: false
  },
  {
    id: '29689505',
    title: 'Cancun Men\'s & Women\'s Round of 16 (Main Court)',
    hometeam: '',
    awayteam: '',
    hometeamabbr: '',
    awayteamabbr: '',
    hometeamID: '0',
    awayteamID: '0',
    starttime: '2025-03-13T16:00:00Z', // This is in the future at our mock time
    endtime: '2025-03-13T22:00:00Z',
    sport: 'Padel',
    league: 'Premier Padel Major',
    league_id: '23196420',
    network: 'beIN SPORTS 8',
    networkUrl: 'https://www.fubo.tv/welcome/channel/be-in-sports-8?irmp=365718&irad=596299',
    matchId: 'EP044993071017',
    matchUrl: 'https://www.fubo.tv/welcome/matches/EP044993071017?irmp=365718&irad=596299',
    thumbnail: 'https://gn-imgx.fubo.tv/assets/p23196420_i_h2_ab.jpg',
    country: 'US',
    url: 'https://www.fubo.tv/welcome/leagues/23196420?irmp=365718&irad=596299',
    regionalRestrictions: false
  },
  {
    id: '29689506',
    title: 'Cancun Men\'s & Women\'s Round of 16 (Main Court)', // Duplicate title with different network
    hometeam: '',
    awayteam: '',
    hometeamabbr: '',
    awayteamabbr: '',
    hometeamID: '0',
    awayteamID: '0',
    starttime: '2025-03-13T16:00:00Z', // Same start time as the previous one
    endtime: '2025-03-13T22:00:00Z',
    sport: 'Padel',
    league: 'Premier Padel Major',
    league_id: '23196420',
    network: 'beIN SPORTS 9', // Different network
    networkUrl: 'https://www.fubo.tv/welcome/channel/be-in-sports-9?irmp=365718&irad=596299',
    matchId: 'EP044993071018',
    matchUrl: 'https://www.fubo.tv/welcome/matches/EP044993071018?irmp=365718&irad=596299',
    thumbnail: 'https://gn-imgx.fubo.tv/assets/p23196420_i_h2_ab.jpg',
    country: 'US',
    url: 'https://www.fubo.tv/welcome/leagues/23196420?irmp=365718&irad=596299',
    regionalRestrictions: false
  },
  {
    id: '29689507',
    title: 'Past Match',
    hometeam: '',
    awayteam: '',
    hometeamabbr: '',
    awayteamabbr: '',
    hometeamID: '0',
    awayteamID: '0',
    starttime: '2025-03-12T10:00:00Z', // This is in the past at our mock time
    endtime: '2025-03-12T12:00:00Z',
    sport: 'Padel',
    league: 'Premier Padel Major',
    league_id: '23196420',
    network: 'beIN SPORTS 7',
    networkUrl: 'https://www.fubo.tv/welcome/channel/be-in-sports-7?irmp=365718&irad=596299',
    matchId: 'EP044993071019',
    matchUrl: 'https://www.fubo.tv/welcome/matches/EP044993071019?irmp=365718&irad=596299',
    thumbnail: 'https://gn-imgx.fubo.tv/assets/p23196420_i_h2_ab.jpg',
    country: 'US',
    url: 'https://www.fubo.tv/welcome/leagues/23196420?irmp=365718&irad=596299',
    regionalRestrictions: true
  }
];

const mockSeriesData = [
  {
    id: 11554779,
    title: 'Curious Traveler',
    description: 'Christine Van Blokland explores European and North American cities.',
    originalAiringDate: '2015-04-03',
    rating: 'TVG',
    network: 'Filmhub',
    thumbnail: 'https://gn-imgx.fubo.tv/assets/p11554779_i_h2_ab.jpg',
    url: 'https://www.fubo.tv/welcome/series/115959687/curious-traveler/?irmp=365718&irad=599307',
    genre: 'Other',
    deepLink: 'https://www.fubo.tv/welcome/series/115959687/curious-traveler/?irmp=365718&irad=599307',
    episodes: []
  }
];

const mockMoviesData = [
  {
    id: 'MV014063680000',
    title: '#HatersMakeMeFamous',
    shortDescription: 'A man\'s story since being a kid in the foster care system.',
    longDescription: 'Chris Martin\'s story, from being a kid in the foster care system to an adult in the prison system...',
    network: '',
    releaseYear: 2019,
    duration: 90,
    durationSeconds: 5437,
    rating: 'TV-G',
    genres: ['Documentary'],
    directors: ['Sam Erdmann', 'Tray Goodman'],
    actors: [],
    licenseWindowStart: '2024-05-11T00:00:00Z',
    licenseWindowEnd: '2099-01-01T00:00:00Z',
    poster: '',
    url: 'https://www.fubo.tv/welcome/program/MV014063680000?irmp=365718&irad=599309',
    deepLink: 'https://www.fubo.tv/welcome/program/MV014063680000?irmp=365718&irad=599309',
    tmsId: 'MV014063680000'
  }
];

// Helper to setup mock responses
const setupMockResponses = (responses: Record<string, any>) => {
  mockFetch.mockImplementation((url: string) => {
    const urlObj = new URL(url);
    const path = urlObj.pathname.split('/').pop();
    
    if (responses[path || '']) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(responses[path || '']),
      });
    }
    
    return Promise.reject(new Error(`Mock not found for ${url}`));
  });
};

describe('fuboDataService', () => {
  beforeEach(() => {
    mockFetch.mockClear();
    window.localStorage.clear();
    clearCache();
  });

  describe('fetchFuboData', () => {
    it('should fetch data from all endpoints and format it correctly', async () => {
      // Setup mock responses
      setupMockResponses({
        'matches.json': mockMatchesData,
        'movies.json': mockMoviesData,
        'series.json': mockSeriesData,
      });

      // Call the function
      const result = await fetchFuboData();

      // Verify fetch was called for each endpoint
      expect(mockFetch).toHaveBeenCalledTimes(3);
      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('matches.json'));
      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('movies.json'));
      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('series.json'));

      // Verify the result structure
      expect(result).toHaveProperty('matches');
      expect(result).toHaveProperty('movies');
      expect(result).toHaveProperty('series');

      // Verify counts
      expect(result.matches.length).toBe(3); // 4 matches, but 2 are duplicates and should be merged
      expect(result.movies.length).toBe(1);
      expect(result.series.length).toBe(1);

      // Verify time conversion
      const liveMatch = result.matches.find((m: any) => m.id === '29689504');
      expect(liveMatch).toHaveProperty('startTimeEST');
      expect(liveMatch).toHaveProperty('isLive', true);

      // Verify duplicate merging and network array
      const duplicateMatch = result.matches.find((m: any) => m.id === '29689505');
      expect(duplicateMatch).toHaveProperty('network');
      expect(Array.isArray(duplicateMatch.network)).toBe(true);
      expect(duplicateMatch.network).toContain('beIN SPORTS 8');
      expect(duplicateMatch.network).toContain('beIN SPORTS 9');
    });

    it('should use cached data if available and not expired', async () => {
      // Setup mock responses
      setupMockResponses({
        'matches.json': mockMatchesData,
        'movies.json': mockMoviesData,
        'series.json': mockSeriesData,
      });

      // First call to populate cache
      await fetchFuboData();
      mockFetch.mockClear();

      // Second call should use cache
      const result = await fetchFuboData();

      // Verify fetch was not called again
      expect(mockFetch).not.toHaveBeenCalled();

      // Verify the result is still correct
      expect(result.matches.length).toBe(3);
      expect(result.movies.length).toBe(1);
      expect(result.series.length).toBe(1);
    });

    it('should retry failed requests up to 3 times', async () => {
      // Setup mock to fail first 2 times, then succeed
      let attempts = 0;
      mockFetch.mockImplementation((url: string) => {
        attempts++;
        if (attempts <= 2) {
          return Promise.reject(new Error('Network error'));
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockMatchesData),
        });
      });

      // Call the function with only matches endpoint
      const result = await fetchFuboData(['matches']);

      // Verify fetch was called 3 times (2 failures + 1 success)
      expect(mockFetch).toHaveBeenCalledTimes(3);

      // Verify the result is correct
      expect(result.matches.length).toBe(3);
    });

    it('should return empty arrays after 3 failed attempts', async () => {
      // Setup mock to always fail
      mockFetch.mockImplementation(() => {
        return Promise.reject(new Error('Network error'));
      });

      // Call the function
      const result = await fetchFuboData();

      // Verify fetch was called 9 times (3 endpoints x 3 attempts)
      expect(mockFetch).toHaveBeenCalledTimes(9);

      // Verify the result has empty arrays
      expect(result.matches).toEqual([]);
      expect(result.movies).toEqual([]);
      expect(result.series).toEqual([]);
    });

    it('should handle CORS domain constraints correctly', async () => {
      // Setup mock responses
      setupMockResponses({
        'matches.json': mockMatchesData,
      });

      // Call the function
      await fetchFuboData(['matches']);

      // Verify the URL used for fetch includes the correct domain
      const fetchUrl = mockFetch.mock.calls[0][0];
      expect(fetchUrl).toMatch(/^https:\/\/metadata-feeds\.fubo\.tv/);
    });

    it('should correctly identify live matches', async () => {
      // Setup mock responses
      setupMockResponses({
        'matches.json': mockMatchesData,
      });

      // Call the function
      const result = await fetchFuboData(['matches']);

      // Verify live status
      const liveMatch = result.matches.find((m: any) => m.id === '29689504');
      const futureMatch = result.matches.find((m: any) => m.id === '29689505');
      const pastMatch = result.matches.find((m: any) => m.id === '29689507');

      expect(liveMatch).toHaveProperty('isLive', true);
      expect(futureMatch).toHaveProperty('isLive', false);
      expect(pastMatch).toHaveProperty('isLive', false);
      expect(pastMatch).toHaveProperty('isPast', true);
    });

    it('should handle Canadian feeds correctly', async () => {
      // Setup mock responses with Canadian data
      const caMatchesData = [...mockMatchesData];
      caMatchesData[0].country = 'CA';
      
      setupMockResponses({
        'ca_matches.json': caMatchesData,
      });

      // Call the function with Canadian feeds
      const result = await fetchFuboData(['ca_matches']);

      // Verify the result
      expect(result.ca_matches.length).toBe(3);
      expect(result.ca_matches[0].country).toBe('CA');
    });
  });
}); 