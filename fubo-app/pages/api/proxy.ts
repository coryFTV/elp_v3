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
    
    // Fetch data from the API
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    // Check if the request was successful
    if (!response.ok) {
      console.error(`Error from Fubo API: ${response.status} ${response.statusText}`);
      return res.status(response.status).json({ 
        error: `Error from Fubo API: ${response.status} ${response.statusText}` 
      });
    }

    // Parse the JSON response
    const data = await response.json();
    
    // Set appropriate headers
    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    
    // Return the data
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error proxying request:', error);
    return res.status(500).json({ error: 'Failed to fetch data from Fubo API' });
  }
} 