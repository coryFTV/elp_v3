export interface Series {
  id: string | number;
  title: string;
  startYear?: number;
  endYear?: number | null;
  genre?: string;
  creator?: string;
  actors?: string[];
  description: string;
  seasons?: number;
  rating: number | string; // scale of 1-10 or string like "TVMA"
  imageUrl?: string;
  bannerUrl?: string;
  streamingUrl?: string;
  networkId?: string;
  network?: string;
  regionalRestrictions?: boolean;
  
  // Additional fields from JSON
  originalAiringDate?: string; 
  thumbnail?: string;
  url?: string;
  deepLink?: string;
  episodes?: SeriesEpisode[];
  seasonCount?: number;
  episodeCount?: number;
}

export interface SeriesEpisode {
  tmsId?: string;
  title: string;
  description: string;
  originalAiringDate?: string;
  durationSeconds?: number;
  rating?: string;
  seasonNumber: number;
  episodeNumber: number;
  licenseWindowStart?: string;
  licenseWindowEnd?: string;
  horizontalImage?: string;
  deepLink?: string;
} 