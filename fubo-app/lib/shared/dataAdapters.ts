import { MediaItem } from '../../contexts/shared/MediaSelectionContext';

// Raw match data from API
export interface RawMatch {
  id: string;
  title: string;
  league: string;
  network: string | string[]; // V1 has string, V2 has string[]
  sport: string;
  startTime: string; // UTC timestamp
  endTime: string; // UTC timestamp
  thumbnail: string;
  regionalRestriction?: boolean;
}

// Raw movie data from API
export interface RawMovie {
  id: string;
  title: string;
  releaseYear: number;
  genre: string[];
  thumbnail: string;
  duration: number; // in minutes
}

// Raw series data from API
export interface RawSeries {
  id: string;
  title: string;
  seasons: number;
  genre: string[];
  thumbnail: string;
}

/**
 * Convert UTC time to EST
 */
export function convertToEST(utcTime: string): string {
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
export function formatDate(utcTime: string): string {
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
export function isMatchLive(startTime: string, endTime: string): boolean {
  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);
  
  return now >= start && now <= end;
}

/**
 * Check if a match is in the past
 */
export function isMatchPast(endTime: string): boolean {
  const now = new Date();
  const end = new Date(endTime);
  
  return now > end;
}

/**
 * Adapter for match data (works with both v1 and v2)
 */
export function adaptMatch(match: RawMatch): MediaItem {
  // Format date and time
  const date = formatDate(match.startTime);
  const time = convertToEST(match.startTime);
  
  // Handle network (string in v1, array in v2)
  const network = Array.isArray(match.network) 
    ? match.network.join(', ') 
    : match.network;
  
  return {
    id: match.id,
    title: match.title,
    type: 'match',
    league: match.league,
    network,
    date,
    time,
    sport: match.sport,
    image: match.thumbnail,
  };
}

/**
 * Adapter for movie data
 */
export function adaptMovie(movie: RawMovie): MediaItem {
  return {
    id: movie.id,
    title: movie.title,
    type: 'movie',
    image: movie.thumbnail,
  };
}

/**
 * Adapter for series data
 */
export function adaptSeries(series: RawSeries): MediaItem {
  return {
    id: series.id,
    title: series.title,
    type: 'series',
    image: series.thumbnail,
  };
}

/**
 * Deduplicate matches by merging networks (V2 feature)
 */
export function deduplicateMatches(matches: RawMatch[]): RawMatch[] {
  const matchMap = new Map<string, RawMatch>();
  
  matches.forEach(match => {
    const key = `${match.league}-${match.title}-${match.startTime}`;
    
    if (matchMap.has(key)) {
      // Match already exists, merge networks
      const existingMatch = matchMap.get(key)!;
      const existingNetworks = Array.isArray(existingMatch.network) 
        ? existingMatch.network 
        : [existingMatch.network];
      const newNetwork = Array.isArray(match.network) 
        ? match.network 
        : [match.network];
      
      // Combine networks and remove duplicates
      const networkSet = new Set<string>();
      [...existingNetworks, ...newNetwork].forEach(n => networkSet.add(n));
      const combinedNetworks = Array.from(networkSet);
      
      // Update the existing match
      matchMap.set(key, {
        ...existingMatch,
        network: combinedNetworks,
      });
    } else {
      // New match, ensure network is an array
      matchMap.set(key, {
        ...match,
        network: Array.isArray(match.network) ? match.network : [match.network],
      });
    }
  });
  
  // Convert map back to array
  return Array.from(matchMap.values());
} 