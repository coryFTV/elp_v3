export interface Movie {
  id: string;
  title: string;
  releaseYear: number;
  genre: string;
  director?: string;
  actors?: string[];
  description?: string;
  duration?: number; // in minutes
  rating: number | string; // can be a number or string like "TV-14"
  imageUrl?: string;
  bannerUrl?: string;
  streamingUrl?: string;
  networkId?: string;
  network?: string;
  regionalRestrictions?: boolean;
  
  // Additional fields from JSON
  shortDescription?: string;
  longDescription?: string;
  genres?: string[];
  directors?: string[];
  durationSeconds?: number;
  poster?: string;
  thumbnail?: string;
  url?: string;
  deepLink?: string;
  tmsId?: string;
  licenseWindowStart?: string;
  licenseWindowEnd?: string;
} 