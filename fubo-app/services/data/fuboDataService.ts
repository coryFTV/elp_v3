/**
 * Fubo Data Service
 * 
 * This service handles fetching, caching, and processing data from Fubo's JSON feeds.
 * It handles CORS constraints, time conversion, duplicate merging, and error handling.
 */

// Types for the raw data from the API
export interface RawMatch {
  id: string;
  title: string;
  hometeam: string;
  awayteam: string;
  hometeamabbr: string;
  awayteamabbr: string;
  hometeamID: string;
  awayteamID: string;
  starttime: string; // UTC timestamp
  endtime: string; // UTC timestamp
  sport: string;
  league: string;
  league_id: string;
  network: string;
  networkUrl: string;
  matchId: string;
  matchUrl: string;
  thumbnail: string;
  country: string;
  url: string;
  regionalRestrictions: boolean;
}

export interface RawSeries {
  id: number;
  title: string;
  description: string;
  originalAiringDate: string;
  rating: string;
  network: string;
  thumbnail: string;
  url: string;
  genre: string;
  deepLink: string;
  episodes: any[];
}

export interface RawMovie {
  id: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  network: string;
  releaseYear: number;
  duration: number;
  durationSeconds: number;
  rating: string;
  genres: string[];
  directors: string[];
  actors: string[];
  licenseWindowStart: string;
  licenseWindowEnd: string;
  poster: string;
  url: string;
  deepLink: string;
  tmsId: string;
}

// Processed data types
export interface ProcessedMatch extends Omit<RawMatch, 'network'> {
  startTimeEST: string;
  endTimeEST: string;
  isLive: boolean;
  isPast: boolean;
  network: string | string[];
}

export interface ProcessedSeries extends RawSeries {
  // Additional processed fields can be added here
}

export interface ProcessedMovie extends RawMovie {
  // Additional processed fields can be added here
}

// Result type
export interface FuboDataResult {
  matches: ProcessedMatch[];
  movies: ProcessedMovie[];
  series: ProcessedSeries[];
  ca_matches?: ProcessedMatch[];
  ca_movies?: ProcessedMovie[];
  ca_series?: ProcessedSeries[];
}

// Cache interface
interface CacheEntry {
  data: any;
  timestamp: number;
}

// Configuration
const CONFIG = {
  BASE_URL: 'https://metadata-feeds.fubo.tv/Test',
  ENDPOINTS: {
    matches: 'matches.json',
    movies: 'movies.json',
    series: 'series.json',
    ca_matches: 'ca_matches.json',
    ca_movies: 'ca_movies.json',
    ca_series: 'ca_series.json',
  },
  CACHE_TTL: 15 * 60 * 1000, // 15 minutes in milliseconds
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second
  // Set to false by default to use real API data
  USE_MOCK_DATA: false,
};

// Check if we should use mock data from localStorage
if (typeof window !== 'undefined') {
  const storedMockSetting = window.localStorage.getItem('fubo_use_mock_data');
  if (storedMockSetting !== null) {
    CONFIG.USE_MOCK_DATA = storedMockSetting === 'true';
  }
}

/**
 * Toggle between mock and real data
 */
export function toggleMockData(useMock?: boolean): boolean {
  if (typeof useMock === 'boolean') {
    CONFIG.USE_MOCK_DATA = useMock;
  } else {
    CONFIG.USE_MOCK_DATA = !CONFIG.USE_MOCK_DATA;
  }
  
  // Store the setting in localStorage
  if (typeof window !== 'undefined') {
    window.localStorage.setItem('fubo_use_mock_data', CONFIG.USE_MOCK_DATA.toString());
  }
  
  // Clear cache when switching data sources
  clearCache();
  
  return CONFIG.USE_MOCK_DATA;
}

/**
 * Check if we're using mock data
 */
export function isUsingMockData(): boolean {
  return CONFIG.USE_MOCK_DATA;
}

// Mock data for local development
const MOCK_DATA = {
  matches: [
    {
      id: '29689504',
      title: 'Cancun Men\'s & Women\'s Round of 16 (Secondary Court)',
      hometeam: '',
      awayteam: '',
      hometeamabbr: '',
      awayteamabbr: '',
      hometeamID: '0',
      awayteamID: '0',
      starttime: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      endtime: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
      sport: 'Padel',
      league: 'Premier Padel Major',
      league_id: '23196420',
      network: 'beIN SPORTS 7',
      networkUrl: 'https://www.fubo.tv/welcome/channel/be-in-sports-7',
      matchId: 'EP044993071016',
      matchUrl: 'https://www.fubo.tv/welcome/matches/EP044993071016',
      thumbnail: 'https://gn-imgx.fubo.tv/assets/p23196420_i_h2_ab.jpg',
      country: 'US',
      url: 'https://www.fubo.tv/welcome/leagues/23196420',
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
      starttime: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
      endtime: new Date(Date.now() + 7200000).toISOString(), // 2 hours from now
      sport: 'Padel',
      league: 'Premier Padel Major',
      league_id: '23196420',
      network: 'beIN SPORTS 8',
      networkUrl: 'https://www.fubo.tv/welcome/channel/be-in-sports-8',
      matchId: 'EP044993071017',
      matchUrl: 'https://www.fubo.tv/welcome/matches/EP044993071017',
      thumbnail: 'https://gn-imgx.fubo.tv/assets/p23196420_i_h2_ab.jpg',
      country: 'US',
      url: 'https://www.fubo.tv/welcome/leagues/23196420',
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
      starttime: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
      endtime: new Date(Date.now() + 7200000).toISOString(), // 2 hours from now
      sport: 'Padel',
      league: 'Premier Padel Major',
      league_id: '23196420',
      network: 'beIN SPORTS 9', // Different network
      networkUrl: 'https://www.fubo.tv/welcome/channel/be-in-sports-9',
      matchId: 'EP044993071018',
      matchUrl: 'https://www.fubo.tv/welcome/matches/EP044993071018',
      thumbnail: 'https://gn-imgx.fubo.tv/assets/p23196420_i_h2_ab.jpg',
      country: 'US',
      url: 'https://www.fubo.tv/welcome/leagues/23196420',
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
      starttime: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
      endtime: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      sport: 'Padel',
      league: 'Premier Padel Major',
      league_id: '23196420',
      network: 'beIN SPORTS 7',
      networkUrl: 'https://www.fubo.tv/welcome/channel/be-in-sports-7',
      matchId: 'EP044993071019',
      matchUrl: 'https://www.fubo.tv/welcome/matches/EP044993071019',
      thumbnail: 'https://gn-imgx.fubo.tv/assets/p23196420_i_h2_ab.jpg',
      country: 'US',
      url: 'https://www.fubo.tv/welcome/leagues/23196420',
      regionalRestrictions: true
    }
  ],
  series: [
    {
      id: 11554779,
      title: 'Curious Traveler',
      description: 'Christine Van Blokland explores European and North American cities.',
      originalAiringDate: '2015-04-03',
      rating: 'TVG',
      network: 'Filmhub',
      thumbnail: 'https://gn-imgx.fubo.tv/assets/p11554779_i_h2_ab.jpg',
      url: 'https://www.fubo.tv/welcome/series/115959687/curious-traveler',
      genre: 'Travel',
      deepLink: 'https://www.fubo.tv/welcome/series/115959687/curious-traveler',
      episodes: []
    },
    {
      id: 11554780,
      title: 'Expedition Unknown',
      description: 'Josh Gates investigates the world\'s most intriguing legends and mysteries.',
      originalAiringDate: '2015-01-08',
      rating: 'TVPG',
      network: 'Discovery',
      thumbnail: 'https://gn-imgx.fubo.tv/assets/p11554780_i_h2_ab.jpg',
      url: 'https://www.fubo.tv/welcome/series/115959688/expedition-unknown',
      genre: 'Adventure',
      deepLink: 'https://www.fubo.tv/welcome/series/115959688/expedition-unknown',
      episodes: []
    }
  ],
  movies: [
    {
      id: 'MV014063680000',
      title: '#HatersMakeMeFamous',
      shortDescription: 'A man\'s story since being a kid in the foster care system.',
      longDescription: 'Chris Martin\'s story, from being a kid in the foster care system to an adult in the prison system...',
      network: 'Independent',
      releaseYear: 2019,
      duration: 90,
      durationSeconds: 5437,
      rating: 'TV-G',
      genres: ['Documentary'],
      directors: ['Sam Erdmann', 'Tray Goodman'],
      actors: [],
      licenseWindowStart: '2024-05-11T00:00:00Z',
      licenseWindowEnd: '2099-01-01T00:00:00Z',
      poster: 'https://gn-imgx.fubo.tv/assets/p14063680_i_h10_aa.jpg',
      url: 'https://www.fubo.tv/welcome/program/MV014063680000',
      deepLink: 'https://www.fubo.tv/welcome/program/MV014063680000',
      tmsId: 'MV014063680000'
    },
    {
      id: 'MV014063680001',
      title: 'The Last Dance',
      shortDescription: 'A documentary about Michael Jordan and the Chicago Bulls\' quest for a sixth NBA Championship.',
      longDescription: 'A 10-part documentary chronicling the untold story of Michael Jordan and the Chicago Bulls dynasty...',
      network: 'ESPN',
      releaseYear: 2020,
      duration: 500,
      durationSeconds: 30000,
      rating: 'TV-MA',
      genres: ['Documentary', 'Sports'],
      directors: ['Jason Hehir'],
      actors: ['Michael Jordan', 'Scottie Pippen', 'Dennis Rodman'],
      licenseWindowStart: '2024-01-01T00:00:00Z',
      licenseWindowEnd: '2099-01-01T00:00:00Z',
      poster: 'https://gn-imgx.fubo.tv/assets/p14063681_i_h10_aa.jpg',
      url: 'https://www.fubo.tv/welcome/program/MV014063680001',
      deepLink: 'https://www.fubo.tv/welcome/program/MV014063680001',
      tmsId: 'MV014063680001'
    }
  ]
};

// In-memory cache
const memoryCache: Record<string, CacheEntry> = {};

/**
 * Clear the in-memory cache
 */
export function clearCache(): void {
  Object.keys(memoryCache).forEach(key => {
    delete memoryCache[key];
  });
}

/**
 * Check if the domain is valid for CORS
 */
function isValidDomain(): boolean {
  // In a browser environment
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    return hostname.endsWith('.fubo.tv') || hostname === 'localhost' || hostname === '127.0.0.1';
  }
  // In a server-side rendering environment
  return true;
}

/**
 * Get the base URL for API requests
 */
function getBaseUrl(): string {
  // If we're not on a valid domain, log a warning
  if (typeof window !== 'undefined' && !isValidDomain()) {
    console.warn('Warning: Current domain may not be allowed by CORS. Requests might fail.');
    console.warn('For local development, add "127.0.0.1 dev.fubo.tv" to /etc/hosts');
    console.warn('and configure your local server to run on dev.fubo.tv:3000');
  }
  
  return CONFIG.BASE_URL;
}

/**
 * Convert UTC time to EST
 */
function convertToEST(utcTime: string): string {
  const date = new Date(utcTime);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'America/New_York',
  });
}

/**
 * Format date for display
 */
function formatDate(utcTime: string): string {
  const date = new Date(utcTime);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'America/New_York',
  });
}

/**
 * Check if a match is currently live
 */
function isMatchLive(startTime: string, endTime: string): boolean {
  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);
  
  return now >= start && now <= end;
}

/**
 * Check if a match is in the past
 */
function isMatchPast(endTime: string): boolean {
  const now = new Date();
  const end = new Date(endTime);
  
  return now > end;
}

/**
 * Process match data
 */
function processMatches(matches: RawMatch[]): ProcessedMatch[] {
  // First, deduplicate matches
  const matchMap = new Map<string, ProcessedMatch>();
  
  matches.forEach(match => {
    // Create a unique key for the match based on title, league, and start time
    const key = `${match.league}-${match.title}-${match.starttime}`;
    
    // Process the match data
    const processedMatch: ProcessedMatch = {
      ...match,
      startTimeEST: convertToEST(match.starttime),
      endTimeEST: convertToEST(match.endtime),
      isLive: isMatchLive(match.starttime, match.endtime),
      isPast: isMatchPast(match.endtime),
      network: match.network, // Will be converted to array if duplicate
    };
    
    if (matchMap.has(key)) {
      // Match already exists, merge networks
      const existingMatch = matchMap.get(key)!;
      
      // Convert network to array if it's not already
      const existingNetworks = Array.isArray(existingMatch.network) 
        ? existingMatch.network 
        : [existingMatch.network];
      
      // Add the new network
      if (!existingNetworks.includes(match.network)) {
        existingMatch.network = [...existingNetworks, match.network];
      }
      
      // Update the map
      matchMap.set(key, existingMatch);
    } else {
      // New match
      matchMap.set(key, processedMatch);
    }
  });
  
  // Convert map back to array
  return Array.from(matchMap.values());
}

/**
 * Process series data
 */
function processSeries(series: RawSeries[]): ProcessedSeries[] {
  // For now, just return the raw data
  // Additional processing can be added here
  return series as ProcessedSeries[];
}

/**
 * Process movie data
 */
function processMovies(movies: RawMovie[]): ProcessedMovie[] {
  // For now, just return the raw data
  // Additional processing can be added here
  return movies as ProcessedMovie[];
}

/**
 * Fetch data from a single endpoint with retry logic
 */
async function fetchWithRetry(endpoint: string, retries = CONFIG.MAX_RETRIES): Promise<any> {
  const url = `${getBaseUrl()}/${endpoint}`;
  
  try {
    // Check cache first
    const cacheKey = endpoint;
    const cachedData = memoryCache[cacheKey];
    
    if (cachedData && (Date.now() - cachedData.timestamp) < CONFIG.CACHE_TTL) {
      console.log(`Using cached data for ${endpoint}`);
      return cachedData.data;
    }
    
    // Use mock data for local development if enabled
    if (CONFIG.USE_MOCK_DATA) {
      console.log(`Using mock data for ${endpoint}`);
      // Determine which mock data to return based on the endpoint
      const endpointKey = endpoint.replace('.json', '') as keyof typeof MOCK_DATA;
      const mockData = MOCK_DATA[endpointKey] || [];
      
      // Cache the mock data
      memoryCache[cacheKey] = {
        data: mockData,
        timestamp: Date.now(),
      };
      
      return mockData;
    }
    
    // Fetch from API
    console.log(`Fetching real data from ${url}`);
    
    // Add a timestamp to bypass cache
    const fetchUrl = `${url}?_t=${Date.now()}`;
    const response = await fetch(fetchUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      // Include credentials for CORS requests
      credentials: 'same-origin',
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`Successfully fetched data from ${url}:`, data.length ? `${data.length} items` : 'empty response');
    
    // Cache the result
    memoryCache[cacheKey] = {
      data,
      timestamp: Date.now(),
    };
    
    return data;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    
    if (retries > 0) {
      console.warn(`Retrying... (${retries} retries left)`);
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, CONFIG.RETRY_DELAY));
      
      // Retry with one less retry
      return fetchWithRetry(endpoint, retries - 1);
    }
    
    console.error(`Failed to fetch ${endpoint} after ${CONFIG.MAX_RETRIES} retries:`, error);
    
    // If all retries fail and we have mock data enabled, use mock data as fallback
    if (CONFIG.USE_MOCK_DATA) {
      console.log(`Falling back to mock data for ${endpoint}`);
      const endpointKey = endpoint.replace('.json', '') as keyof typeof MOCK_DATA;
      return MOCK_DATA[endpointKey] || [];
    } else {
      // If we're not using mock data, still fall back to mock data as a last resort
      // This ensures the UI doesn't break completely
      console.log(`All retries failed. Falling back to mock data for ${endpoint} as a last resort`);
      const endpointKey = endpoint.replace('.json', '') as keyof typeof MOCK_DATA;
      return MOCK_DATA[endpointKey] || [];
    }
  }
}

/**
 * Main function to fetch and process Fubo data
 */
export async function fetchFuboData(
  endpoints: (keyof typeof CONFIG.ENDPOINTS)[] = ['matches', 'movies', 'series']
): Promise<FuboDataResult> {
  const result: Partial<FuboDataResult> = {
    matches: [],
    movies: [],
    series: [],
  };
  
  // Fetch data from each endpoint
  await Promise.all(
    endpoints.map(async (endpoint) => {
      const data = await fetchWithRetry(CONFIG.ENDPOINTS[endpoint]);
      
      // Process data based on endpoint type
      if (endpoint === 'matches' || endpoint === 'ca_matches') {
        result[endpoint] = processMatches(data);
      } else if (endpoint === 'series' || endpoint === 'ca_series') {
        result[endpoint] = processSeries(data);
      } else if (endpoint === 'movies' || endpoint === 'ca_movies') {
        result[endpoint] = processMovies(data);
      }
    })
  );
  
  // Log summary
  console.log('Fubo data fetched and processed:');
  Object.entries(result).forEach(([key, value]) => {
    console.log(`- ${key}: ${Array.isArray(value) ? value.length : 0} items`);
  });
  
  return result as FuboDataResult;
}

/**
 * Get data from localStorage cache
 */
export function getLocalStorageCache(key: string): any {
  try {
    const cachedData = localStorage.getItem(`fubo_data_${key}`);
    if (cachedData) {
      const { data, timestamp } = JSON.parse(cachedData);
      
      // Check if cache is still valid
      if ((Date.now() - timestamp) < CONFIG.CACHE_TTL) {
        return data;
      }
    }
  } catch (error) {
    console.error('Error reading from localStorage:', error);
  }
  
  return null;
}

/**
 * Save data to localStorage cache
 */
export function setLocalStorageCache(key: string, data: any): void {
  try {
    const cacheEntry = {
      data,
      timestamp: Date.now(),
    };
    
    localStorage.setItem(`fubo_data_${key}`, JSON.stringify(cacheEntry));
  } catch (error) {
    console.error('Error writing to localStorage:', error);
  }
} 