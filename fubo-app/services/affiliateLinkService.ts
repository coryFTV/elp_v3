/**
 * Affiliate Link Generation Service
 * Provides utilities to generate different types of affiliate links with proper parameters
 */

// Supported link types
export type LinkType = 'league' | 'match' | 'network';

// Default settings for partner affiliate links
export const DEFAULT_SETTINGS = {
  impactRadiusId: 'test123',
  subId1: 'partner',
  subId2: '',
  subId3: '',
  includeUtm: true
};

// Base URLs for different link types
const BASE_URLS: Record<LinkType, string> = {
  league: 'https://www.fubo.tv/sports/league',
  match: 'https://www.fubo.tv/sports/match',
  network: 'https://www.fubo.tv/watch',
};

// Parameters interface
export interface AffiliateParams {
  // Required
  linkType: LinkType;
  
  // Partner ID (Impact Radius ID)
  impactRadiusId?: string;
  
  // Content IDs
  leagueId?: string;
  matchId?: string;
  networkId?: string;
  
  // Optional SubIDs
  subId1?: string;
  subId2?: string;
  subId3?: string;
  
  // UTM Parameters
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  
  // Additional parameters
  sharedId?: string;
  irad?: string;
}

/**
 * Builds an affiliate link based on the provided parameters
 * @param params Parameters for the affiliate link
 * @returns A properly formatted affiliate link URL
 */
export function buildAffiliateLink(params: AffiliateParams): string {
  // Destructure params with defaults from settings
  const {
    linkType,
    impactRadiusId = DEFAULT_SETTINGS.impactRadiusId, // Use default from settings
    leagueId = '',
    matchId = '',
    networkId = '',
    subId1 = DEFAULT_SETTINGS.subId1, // Use default from settings
    subId2 = DEFAULT_SETTINGS.subId2 || '', // Use default from settings if exists
    subId3 = DEFAULT_SETTINGS.subId3 || '', // Use default from settings if exists
    utmSource = 'affiliate',
    utmMedium = 'partner',
    utmCampaign = '',
    utmContent = '',
    utmTerm = '',
    sharedId = '',
    irad = 'fubo-affiliate'
  } = params;
  
  // Determine base URL based on link type
  let baseUrl = BASE_URLS[linkType];
  
  // Add content ID to the base URL if provided
  if (linkType === 'league' && leagueId) {
    baseUrl = `${baseUrl}/${leagueId}`;
  } else if (linkType === 'match' && matchId) {
    baseUrl = `${baseUrl}/${matchId}`;
  } else if (linkType === 'network' && networkId) {
    baseUrl = `${baseUrl}/${networkId}`;
  }
  
  // Start building the query parameters
  const queryParams: string[] = [];
  
  // Add Impact Radius ID
  if (impactRadiusId) {
    queryParams.push(`irmp=${encodeURIComponent(impactRadiusId)}`);
  }
  
  // Add irad
  if (irad) {
    queryParams.push(`irad=${encodeURIComponent(irad)}`);
  }
  
  // Add sharedId (league + match encoded)
  if (sharedId) {
    queryParams.push(`sharedid=${encodeURIComponent(sharedId)}`);
  }
  
  // Add SubIDs if provided
  if (subId1) {
    queryParams.push(`subId1=${encodeURIComponent(subId1)}`);
  }
  
  if (subId2) {
    queryParams.push(`subId2=${encodeURIComponent(subId2)}`);
  }
  
  if (subId3) {
    queryParams.push(`subId3=${encodeURIComponent(subId3)}`);
  }
  
  // Add UTM parameters if provided
  if (utmSource) {
    queryParams.push(`utm_source=${encodeURIComponent(utmSource)}`);
  }
  
  if (utmMedium) {
    queryParams.push(`utm_medium=${encodeURIComponent(utmMedium)}`);
  }
  
  if (utmCampaign) {
    queryParams.push(`utm_campaign=${encodeURIComponent(utmCampaign)}`);
  }
  
  if (utmContent) {
    queryParams.push(`utm_content=${encodeURIComponent(utmContent)}`);
  }
  
  if (utmTerm) {
    queryParams.push(`utm_term=${encodeURIComponent(utmTerm)}`);
  }
  
  // Combine the base URL with query parameters
  return queryParams.length > 0
    ? `${baseUrl}?${queryParams.join('&')}`
    : baseUrl;
}

/**
 * Builds a league URL with the provided parameters
 * @param leagueId ID of the league
 * @param params Other affiliate parameters
 * @returns A properly formatted league URL
 */
export function buildLeagueUrl(leagueId: string, params: Omit<AffiliateParams, 'linkType' | 'leagueId'>): string {
  return buildAffiliateLink({
    linkType: 'league',
    leagueId,
    ...params
  });
}

/**
 * Builds a match URL with the provided parameters
 * @param matchId ID of the match
 * @param params Other affiliate parameters
 * @returns A properly formatted match URL
 */
export function buildMatchUrl(matchId: string, params: Omit<AffiliateParams, 'linkType' | 'matchId'>): string {
  return buildAffiliateLink({
    linkType: 'match',
    matchId,
    ...params
  });
}

/**
 * Builds a network URL with the provided parameters
 * @param networkId ID of the network
 * @param params Other affiliate parameters
 * @returns A properly formatted network URL
 */
export function buildNetworkUrl(networkId: string, params: Omit<AffiliateParams, 'linkType' | 'networkId'>): string {
  return buildAffiliateLink({
    linkType: 'network',
    networkId,
    ...params
  });
}

interface LinkOptions {
  irmp?: string;
  irad?: string;
  sharedId?: string;
  subId1?: string;
  subId2?: string;
  subId3?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
}

// Mock partner settings (would come from user settings in a real app)
const DEFAULT_SETTINGS_MOCK = {
  irmp: 'test123',
  subId1: '',
  subId2: '',
  subId3: '',
  includeUtm: true
};

/**
 * Build an affiliate link for a match
 */
export function buildMatchUrlMock(matchId: string, options: LinkOptions = {}): string {
  // In a real app, this would use the actual baseUrl from API or config
  const baseUrl = 'https://fubo.tv/match';
  
  // Combine default settings with provided options
  const settings = {
    ...DEFAULT_SETTINGS_MOCK,
    ...options
  };
  
  // Build the query parameters
  const params = new URLSearchParams();
  
  // Add Impact Radius params
  params.append('irmp', settings.irmp || DEFAULT_SETTINGS_MOCK.irmp);
  
  if (settings.irad) {
    params.append('irad', settings.irad);
  }
  
  if (settings.sharedId) {
    params.append('sharedid', settings.sharedId);
  }
  
  // Add subIds if provided
  if (settings.subId1 || DEFAULT_SETTINGS_MOCK.subId1) {
    params.append('subId1', settings.subId1 || DEFAULT_SETTINGS_MOCK.subId1);
  }
  
  if (settings.subId2 || DEFAULT_SETTINGS_MOCK.subId2) {
    params.append('subId2', settings.subId2 || DEFAULT_SETTINGS_MOCK.subId2);
  }
  
  if (settings.subId3 || DEFAULT_SETTINGS_MOCK.subId3) {
    params.append('subId3', settings.subId3 || DEFAULT_SETTINGS_MOCK.subId3);
  }
  
  // Add UTM parameters if enabled
  if (DEFAULT_SETTINGS_MOCK.includeUtm) {
    params.append('utm_source', settings.utmSource || 'affiliate');
    params.append('utm_medium', settings.utmMedium || 'partner');
    params.append('utm_campaign', settings.utmCampaign || 'sports');
    
    if (settings.utmContent) {
      params.append('utm_content', settings.utmContent);
    }
  }
  
  // Return the full URL
  return `${baseUrl}/${matchId}?${params.toString()}`;
}

/**
 * Build an affiliate link for a league
 */
export function buildLeagueUrlMock(leagueId: string, options: LinkOptions = {}): string {
  const baseUrl = 'https://fubo.tv/sports/league';
  const params = new URLSearchParams();
  
  // Combine default settings with provided options
  const settings = {
    ...DEFAULT_SETTINGS_MOCK,
    ...options
  };
  
  // Add Impact Radius params
  params.append('irmp', settings.irmp || DEFAULT_SETTINGS_MOCK.irmp);
  
  if (settings.irad) {
    params.append('irad', settings.irad);
  }
  
  if (settings.sharedId) {
    params.append('sharedid', settings.sharedId);
  }
  
  // Add subIds if provided
  if (settings.subId1 || DEFAULT_SETTINGS_MOCK.subId1) {
    params.append('subId1', settings.subId1 || DEFAULT_SETTINGS_MOCK.subId1);
  }
  
  if (settings.subId2 || DEFAULT_SETTINGS_MOCK.subId2) {
    params.append('subId2', settings.subId2 || DEFAULT_SETTINGS_MOCK.subId2);
  }
  
  if (settings.subId3 || DEFAULT_SETTINGS_MOCK.subId3) {
    params.append('subId3', settings.subId3 || DEFAULT_SETTINGS_MOCK.subId3);
  }
  
  // Add UTM parameters if enabled
  if (DEFAULT_SETTINGS_MOCK.includeUtm) {
    params.append('utm_source', settings.utmSource || 'affiliate');
    params.append('utm_medium', settings.utmMedium || 'partner');
    params.append('utm_campaign', settings.utmCampaign || 'league');
    
    if (settings.utmContent) {
      params.append('utm_content', settings.utmContent);
    }
  }
  
  // Return the full URL
  return `${baseUrl}/${leagueId}?${params.toString()}`;
}

/**
 * Build an affiliate link for a network
 */
export function buildNetworkUrlMock(networkName: string, options: LinkOptions = {}): string {
  const baseUrl = 'https://fubo.tv/network';
  const networkSlug = networkName.toLowerCase().replace(/\s+/g, '-');
  const params = new URLSearchParams();
  
  // Combine default settings with provided options
  const settings = {
    ...DEFAULT_SETTINGS_MOCK,
    ...options
  };
  
  // Add Impact Radius params
  params.append('irmp', settings.irmp || DEFAULT_SETTINGS_MOCK.irmp);
  
  if (settings.irad) {
    params.append('irad', settings.irad);
  }
  
  if (settings.sharedId) {
    params.append('sharedid', settings.sharedId);
  }
  
  // Add subIds if provided
  if (settings.subId1 || DEFAULT_SETTINGS_MOCK.subId1) {
    params.append('subId1', settings.subId1 || DEFAULT_SETTINGS_MOCK.subId1);
  }
  
  if (settings.subId2 || DEFAULT_SETTINGS_MOCK.subId2) {
    params.append('subId2', settings.subId2 || DEFAULT_SETTINGS_MOCK.subId2);
  }
  
  if (settings.subId3 || DEFAULT_SETTINGS_MOCK.subId3) {
    params.append('subId3', settings.subId3 || DEFAULT_SETTINGS_MOCK.subId3);
  }
  
  // Add UTM parameters if enabled
  if (DEFAULT_SETTINGS_MOCK.includeUtm) {
    params.append('utm_source', settings.utmSource || 'affiliate');
    params.append('utm_medium', settings.utmMedium || 'partner');
    params.append('utm_campaign', settings.utmCampaign || 'network');
    
    if (settings.utmContent) {
      params.append('utm_content', settings.utmContent);
    }
  }
  
  // Return the full URL
  return `${baseUrl}/${networkSlug}?${params.toString()}`;
} 