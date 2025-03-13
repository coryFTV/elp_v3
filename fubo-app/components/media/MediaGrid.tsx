'use client';

import { Movie } from '@/types/movie';
import { Series } from '@/types/series';
import { MediaCard, MediaType } from './MediaCard';

interface MediaGridProps {
  items: (Movie | Series)[];
  mediaType: MediaType;
}

export function MediaGrid({ items, mediaType }: MediaGridProps) {
  if (items.length === 0) {
    return (
      <div className="text-center p-8 rounded-lg bg-card">
        <h3 className="text-xl font-semibold mb-2">No items found</h3>
        <p className="text-muted-foreground">
          Try adjusting your filters or search query.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {items.map((item) => (
        <div key={item.id} data-testid={`${mediaType}-item-${item.id}`}>
          <MediaCard media={item} mediaType={mediaType} />
        </div>
      ))}
    </div>
  );
} 