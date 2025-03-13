import { Match } from '@/types/match';

// In a real app, this would be an environment variable or config
const MATCHES_API_URL = '/api/matches';

/**
 * Fetch matches data from the API
 * @returns Promise resolving to array of Match objects
 */
export async function fetchMatches(): Promise<Match[]> {
  try {
    const response = await fetch(MATCHES_API_URL);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch matches: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching matches:', error);
    throw error;
  }
}

/**
 * Format a date string to a user-friendly format
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Format a time string to a user-friendly format
 */
export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
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
 * Convert UTC time to EST (America/New_York timezone)
 */
export function formatToEST(utcTimeString: string): string {
  const date = new Date(utcTimeString);
  return date.toLocaleString('en-US', {
    timeZone: 'America/New_York',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Filter matches by date
 * @param matches Array of matches
 * @param date Date string to filter by (YYYY-MM-DD)
 * @returns Filtered matches
 */
export function filterMatchesByDate(matches: Match[], date: string): Match[] {
  // If no date is provided, return all matches
  if (!date) return matches;
  
  return matches.filter(match => {
    const matchDate = new Date(match.starttime).toISOString().split('T')[0];
    return matchDate === date;
  });
}

/**
 * Filter matches by sport
 * @param matches Array of matches
 * @param sport Sport name to filter by
 * @returns Filtered matches
 */
export function filterMatchesBySport(matches: Match[], sport: string): Match[] {
  // If no sport is provided, return all matches
  if (!sport) return matches;
  
  return matches.filter(match => 
    match.sport.toLowerCase() === sport.toLowerCase()
  );
}

/**
 * Filter matches by league
 * @param matches Array of matches
 * @param league League name to filter by
 * @returns Filtered matches
 */
export function filterMatchesByLeague(matches: Match[], league: string): Match[] {
  // If no league is provided, return all matches
  if (!league) return matches;
  
  return matches.filter(match => 
    match.league.toLowerCase().includes(league.toLowerCase())
  );
}

/**
 * Get unique sports from matches
 * @param matches Array of matches
 * @returns Array of unique sport names
 */
export function getUniqueSports(matches: Match[]): string[] {
  const sportsSet = new Set<string>();
  
  matches.forEach(match => {
    if (match.sport) {
      sportsSet.add(match.sport);
    }
  });
  
  return Array.from(sportsSet).sort();
}

/**
 * Get unique leagues from matches
 * @param matches Array of matches
 * @returns Array of unique league names
 */
export function getUniqueLeagues(matches: Match[]): string[] {
  const leaguesSet = new Set<string>();
  
  matches.forEach(match => {
    if (match.league) {
      leaguesSet.add(match.league);
    }
  });
  
  return Array.from(leaguesSet).sort();
} 