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
  const hostname = window.location.hostname;
  return hostname.endsWith('.fubo.tv') || hostname === 'localhost' || hostname === '127.0.0.1';
}

/**
 * Get the base URL for API requests
 */
function getBaseUrl(): string {
  // If we're not on a valid domain, log a warning
  if (!isValidDomain()) {
    console.warn('Warning: Current domain may not be allowed by CORS. Requests might fail.');
    console.warn('For local development, add "127.0.0.1 your-site.fubo.tv" to /etc/hosts');
    console.warn('and configure your local server to run on your-site.fubo.tv:<port>');
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
    
    // Fetch from API
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    
    const data = await response.json();
    
    // Cache the result
    memoryCache[cacheKey] = {
      data,
      timestamp: Date.now(),
    };
    
    return data;
  } catch (error) {
    if (retries > 0) {
      console.warn(`Error fetching ${endpoint}, retrying... (${retries} retries left)`);
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, CONFIG.RETRY_DELAY));
      
      // Retry with one less retry
      return fetchWithRetry(endpoint, retries - 1);
    }
    
    console.error(`Failed to fetch ${endpoint} after ${CONFIG.MAX_RETRIES} retries:`, error);
    return [];
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