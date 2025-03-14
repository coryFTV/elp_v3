import { MediaItem } from '../../contexts/shared/MediaSelectionContext';

// Partner settings interface
export interface PartnerSettings {
  partnerId: string;
  subId1?: string;
  subId2?: string;
  subId3?: string;
  defaultLinkType: 'league' | 'match' | 'network';
  includeUtmParams: boolean;
  // V2 additions
  exportColumns?: {
    sport: boolean;
    network: boolean;
    startTime: boolean;
  };
}

// Link history entry (V2)
export interface LinkHistoryEntry {
  id: string;
  url: string;
  type: 'league' | 'match' | 'network';
  title: string;
  timestamp: number;
}

// Default partner settings
export const defaultPartnerSettings: PartnerSettings = {
  partnerId: 'test123',
  defaultLinkType: 'league',
  includeUtmParams: true,
  exportColumns: {
    sport: false,
    network: false,
    startTime: false,
  },
};

/**
 * Generate an affiliate link for a media item
 */
export function generateAffiliateLink(
  item: MediaItem,
  settings: PartnerSettings,
  linkType?: 'league' | 'match' | 'network'
): string {
  // Use specified link type or default from settings
  const type = linkType || settings.defaultLinkType;
  
  // Base URL
  let baseUrl = 'https://www.fubo.tv/';
  
  // Append path based on link type and item type
  if (item.type === 'match') {
    if (type === 'league') {
      baseUrl += `league/${item.league?.toLowerCase().replace(/\s+/g, '-')}`;
    } else if (type === 'match') {
      baseUrl += `watch/${item.id}`;
    } else if (type === 'network') {
      baseUrl += `network/${item.network?.toLowerCase().replace(/\s+/g, '-')}`;
    }
  } else if (item.type === 'movie') {
    baseUrl += `movie/${item.id}`;
  } else if (item.type === 'series') {
    baseUrl += `series/${item.id}`;
  }
  
  // Add query parameters
  const params = new URLSearchParams();
  
  // Partner ID (required)
  params.append('irmp', settings.partnerId);
  
  // Optional subIDs
  if (settings.subId1) params.append('subId1', settings.subId1);
  if (settings.subId2) params.append('subId2', settings.subId2);
  if (settings.subId3) params.append('subId3', settings.subId3);
  
  // Add shared ID (league + match, encoded)
  if (item.type === 'match' && item.league) {
    const sharedId = `${item.league}-${item.id}`;
    params.append('sharedid', encodeURIComponent(sharedId));
  }
  
  // Add UTM parameters if enabled
  if (settings.includeUtmParams) {
    params.append('utm_source', 'affiliate');
    params.append('utm_medium', 'referral');
    params.append('utm_campaign', `${settings.partnerId}_${type}`);
  }
  
  // Return the full URL
  return `${baseUrl}?${params.toString()}`;
}

/**
 * Generate CSV data for selected items
 */
export function generateCsvData(
  items: MediaItem[],
  settings: PartnerSettings
): string {
  // Determine columns based on settings
  const columns = ['Event Name', 'League', 'Affiliate Link'];
  
  // Add optional columns if enabled in V2
  if (settings.exportColumns?.sport) columns.push('Sport');
  if (settings.exportColumns?.network) columns.push('Network');
  if (settings.exportColumns?.startTime) columns.push('Start Time (EST)');
  
  // Create CSV header
  let csv = columns.join(',') + '\n';
  
  // Add rows for each item
  items.forEach(item => {
    const link = generateAffiliateLink(item, settings);
    const row = [
      `"${item.title}"`,
      item.league ? `"${item.league}"` : '',
      `"${link}"`,
    ];
    
    // Add optional columns if enabled
    if (settings.exportColumns?.sport) row.push(item.sport ? `"${item.sport}"` : '');
    if (settings.exportColumns?.network) row.push(item.network ? `"${item.network}"` : '');
    if (settings.exportColumns?.startTime) row.push(item.time ? `"${item.time} EST"` : '');
    
    csv += row.join(',') + '\n';
  });
  
  return csv;
}

/**
 * Save a link to history (V2 feature)
 */
export function saveLinkToHistory(
  item: MediaItem,
  url: string,
  type: 'league' | 'match' | 'network'
): void {
  // Get existing history from localStorage
  const historyJson = localStorage.getItem('linkHistory');
  const history: LinkHistoryEntry[] = historyJson ? JSON.parse(historyJson) : [];
  
  // Create new entry
  const entry: LinkHistoryEntry = {
    id: item.id,
    url,
    type,
    title: item.title,
    timestamp: Date.now(),
  };
  
  // Add to history and save
  history.unshift(entry); // Add to beginning
  localStorage.setItem('linkHistory', JSON.stringify(history));
}

/**
 * Get link history (V2 feature)
 */
export function getLinkHistory(): LinkHistoryEntry[] {
  const historyJson = localStorage.getItem('linkHistory');
  return historyJson ? JSON.parse(historyJson) : [];
}

/**
 * Clear link history (V2 feature)
 */
export function clearLinkHistory(): void {
  localStorage.removeItem('linkHistory');
}

/**
 * Delete a link from history (V2 feature)
 */
export function deleteLinkFromHistory(timestamp: number): void {
  const historyJson = localStorage.getItem('linkHistory');
  if (!historyJson) return;
  
  const history: LinkHistoryEntry[] = JSON.parse(historyJson);
  const updatedHistory = history.filter(entry => entry.timestamp !== timestamp);
  
  localStorage.setItem('linkHistory', JSON.stringify(updatedHistory));
} 