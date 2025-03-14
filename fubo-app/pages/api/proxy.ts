import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * API Route that proxies requests to the Fubo API
 * This avoids CORS issues since the request to the Fubo API is made server-side
 */

// Valid endpoints (for security, only allow specific endpoints)
const VALID_ENDPOINTS = [
  'matches.json',
  'movies.json',
  'series.json',
  'ca_matches.json',
  'ca_movies.json',
  'ca_series.json',
];

// Base URL for the Fubo API
const BASE_URL = 'https://metadata-feeds.fubo.tv/Test';

// Mock data for when the API is unreachable or returns errors
const MOCK_DATA = {
  'matches.json': [
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
  'series.json': [
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
  'movies.json': [
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
  ],
};

// Get mock data for a specific endpoint
function getMockData(endpoint: string) {
  const key = endpoint as keyof typeof MOCK_DATA;
  return MOCK_DATA[key] || [];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get the endpoint from the query
  const { endpoint } = req.query;
  
  // Validate the endpoint
  if (!endpoint || typeof endpoint !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid endpoint parameter' });
  }
  
  // For security, only allow specific endpoints
  if (!VALID_ENDPOINTS.includes(endpoint)) {
    return res.status(403).json({ 
      error: 'Endpoint not allowed',
      message: `Only the following endpoints are allowed: ${VALID_ENDPOINTS.join(', ')}`,
    });
  }

  try {
    // Construct the API URL
    const apiUrl = `${BASE_URL}/${endpoint}`;
    
    console.log(`Proxying request to: ${apiUrl}`);
    
    // Fetch data from the API with improved headers
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36',
        'Origin': 'https://fubo.tv',
        'Referer': 'https://fubo.tv/'
      },
    });

    // Check if the request was successful
    if (!response.ok) {
      console.error(`Error from Fubo API: ${response.status} ${response.statusText}`);
      
      // Return mock data on error for a smoother experience
      console.log(`Returning mock data for ${endpoint} due to API error`);
      const mockData = getMockData(endpoint);
      
      // Set header to indicate this is mock data
      res.setHeader('X-Data-Source', 'mock');
      res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=1200');
      
      return res.status(200).json(mockData);
    }

    // Parse the JSON response
    const data = await response.json();
    
    // Set appropriate headers
    res.setHeader('X-Data-Source', 'api');
    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    
    // Return the data
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error proxying request:', error);
    
    // Return mock data on error for a smoother experience
    console.log(`Returning mock data for ${endpoint} due to exception`);
    const mockData = getMockData(endpoint);
    
    // Set header to indicate this is mock data
    res.setHeader('X-Data-Source', 'mock');
    res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=1200');
    
    // Return mock data with 200 status to avoid client errors
    return res.status(200).json(mockData);
  }
} 