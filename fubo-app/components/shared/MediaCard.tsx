import React from 'react';
import { useConfig } from '../../hooks/useConfig';
import dynamic from 'next/dynamic';

// Dynamically import the appropriate version
const V1MediaCard = dynamic(() => import('../v1/MediaCard'), { ssr: true });
const V2MediaCard = dynamic(() => import('../v2/MediaCard'), { 
  ssr: true,
  loading: () => <V1MediaCard {...defaultProps} /> // Fallback to V1 while loading
});

// Define the props interface
export interface MediaCardProps {
  id: string;
  title: string;
  image?: string;
  date?: string;
  time?: string;
  league?: string;
  network?: string;
  sport?: string;
  isLive?: boolean;
  isRegionallyRestricted?: boolean;
  onAddToCart?: (id: string) => void;
  onSelectForExport?: (id: string, selected: boolean) => void;
  onGenerateLink?: (id: string) => void;
  selected?: boolean;
}

// Default props for fallback
const defaultProps: Partial<MediaCardProps> = {
  title: 'Loading...',
  image: '/placeholder.jpg',
};

/**
 * MediaCard component that renders either V1 or V2 version based on configuration
 */
export default function MediaCard(props: MediaCardProps) {
  const { isV2, isGridViewEnabled } = useConfig();
  
  // Use V2 if enabled and grid view is enabled
  if (isV2() && isGridViewEnabled()) {
    return <V2MediaCard {...props} />;
  }
  
  // Otherwise use V1
  return <V1MediaCard {...props} />;
} 