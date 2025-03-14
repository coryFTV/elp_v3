import { Match } from '../types/match';
import { fetchFuboData } from './data/fuboDataService';

// Define a function to get the data URL - makes testing easier
export const getDataUrl = (): string => {
  // Check if we're in a test environment
  if (typeof window === 'undefined' || process.env.NODE_ENV === 'test') {
    return '/data/sampleMatches.json';
  }
  // Production URL
  return '/data/sampleMatches.json';
};

// Convert Fubo matches to app Match type
const convertFuboMatchesToAppFormat = (fuboMatches: any[]): Match[] => {
  return fuboMatches.map(fuboMatch => ({
    id: fuboMatch.id,
    title: fuboMatch.title,
    hometeam: fuboMatch.hometeam || '',
    awayteam: fuboMatch.awayteam || '',
    hometeamabbr: fuboMatch.hometeamabbr || '',
    awayteamabbr: fuboMatch.awayteamabbr || '',
    hometeamID: fuboMatch.hometeamID || '0',
    awayteamID: fuboMatch.awayteamID || '0',
    starttime: fuboMatch.starttime,
    endtime: fuboMatch.endtime,
    sport: fuboMatch.sport || '',
    league: fuboMatch.league || '',
    league_id: fuboMatch.league_id || '',
    network: Array.isArray(fuboMatch.network) ? fuboMatch.network[0] : fuboMatch.network || '',
    networkUrl: fuboMatch.networkUrl || '',
    matchId: fuboMatch.matchId || fuboMatch.id,
    matchUrl: fuboMatch.matchUrl || fuboMatch.url || '',
    thumbnail: fuboMatch.thumbnail || '',
    country: fuboMatch.country || 'US',
    url: fuboMatch.url || '',
    regionalRestrictions: fuboMatch.regionalRestrictions || false
  }));
};

export const fetchMatches = async (): Promise<Match[]> => {
  try {
    // First try to fetch from Fubo data service
    try {
      const fuboData = await fetchFuboData(['matches']);
      if (fuboData.matches && fuboData.matches.length > 0) {
        console.log('Using Fubo API data for matches');
        return convertFuboMatchesToAppFormat(fuboData.matches);
      }
    } catch (fuboError) {
      console.warn('Error fetching from Fubo API, falling back to sample data:', fuboError);
    }
    
    // Fallback to sample data
    console.log('Using sample data for matches');
    const response = await fetch(getDataUrl());
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data as Match[];
  } catch (error) {
    console.error('Error fetching matches:', error);
    throw error;
  }
};

export const filterMatchesByDate = (matches: Match[], date: string): Match[] => {
  if (!date) return matches;
  
  return matches.filter(match => {
    const matchDate = new Date(match.starttime).toISOString().split('T')[0];
    return matchDate === date;
  });
};

export const filterMatchesBySport = (matches: Match[], sport: string): Match[] => {
  if (!sport) return matches;
  
  return matches.filter(match => match.sport === sport);
};

export const filterMatchesByLeague = (matches: Match[], league: string): Match[] => {
  if (!league) return matches;
  
  return matches.filter(match => match.league === league);
};

export const getUniqueSports = (matches: Match[]): string[] => {
  const sportsSet = new Set<string>();
  
  matches.forEach(match => {
    if (match.sport) {
      sportsSet.add(match.sport);
    }
  });
  
  return Array.from(sportsSet);
};

export const getUniqueLeagues = (matches: Match[]): string[] => {
  const leaguesSet = new Set<string>();
  
  matches.forEach(match => {
    if (match.league) {
      leaguesSet.add(match.league);
    }
  });
  
  return Array.from(leaguesSet);
};

/**
 * Filter matches by time range
 * @param matches Array of matches
 * @param startTime Time string to filter by (HH:MM format)
 * @param endTime Time string to filter by (HH:MM format)
 * @returns Filtered matches
 */
export const filterMatchesByTime = (matches: Match[], startTime: string, endTime: string): Match[] => {
  // If no time range is provided, return all matches
  if (!startTime && !endTime) return matches;
  
  return matches.filter(match => {
    const matchDateTime = new Date(match.starttime);
    const matchHours = matchDateTime.getUTCHours();
    const matchMinutes = matchDateTime.getUTCMinutes();
    const matchTimeInMinutes = matchHours * 60 + matchMinutes;
    
    // Parse start time if provided
    let startTimeInMinutes = -1;
    if (startTime) {
      const [startHours, startMinutes] = startTime.split(':').map(Number);
      startTimeInMinutes = startHours * 60 + startMinutes;
    }
    
    // Parse end time if provided
    let endTimeInMinutes = -1;
    if (endTime) {
      const [endHours, endMinutes] = endTime.split(':').map(Number);
      endTimeInMinutes = endHours * 60 + endMinutes;
    }
    
    // Apply filters based on provided parameters
    if (startTime && !endTime) {
      // Only filter by start time
      return matchTimeInMinutes >= startTimeInMinutes;
    } else if (!startTime && endTime) {
      // Only filter by end time
      return matchTimeInMinutes <= endTimeInMinutes;
    } else {
      // Filter by both start and end time
      return matchTimeInMinutes >= startTimeInMinutes && matchTimeInMinutes <= endTimeInMinutes;
    }
  });
}; 