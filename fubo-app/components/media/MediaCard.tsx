'use client';

import Image from 'next/image';
import { Card, CardContent, CardFooter } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Movie } from '@/types/movie';
import { Series } from '@/types/series';
import { Star, ShoppingCart, Check, Calendar, Clock, Film, Tv } from 'lucide-react';
import { useCart, CartItem, CartItemType } from '@/contexts/CartContext';
import { useState } from 'react';

export type MediaType = 'movie' | 'series';

interface MediaCardProps {
  media: Movie | Series;
  mediaType: MediaType;
}

export function MediaCard({ media, mediaType }: MediaCardProps) {
  const { addToCart, isInCart, removeFromCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const isMovie = mediaType === 'movie';
  // Use a local fallback image instead of placeholder.com which may fail
  const fallbackImage = "/images/media-placeholder.svg"; 
  
  // Type guard to narrow down media type
  const getYear = () => {
    if (isMovie) {
      return (media as Movie).releaseYear;
    } else {
      const series = media as Series;
      // Handle startYear/endYear or just originalAiringDate
      if (series.startYear) {
        return series.endYear ? `${series.startYear}-${series.endYear}` : `${series.startYear}-Present`;
      } else if (series.originalAiringDate) {
        return new Date(series.originalAiringDate).getFullYear();
      }
      return 'N/A';
    }
  };

  // Get appropriate description based on media type
  const getDescription = () => {
    if (isMovie) {
      const movie = media as Movie;
      return movie.longDescription || movie.shortDescription || movie.description || '';
    } else {
      return media.description || '';
    }
  };

  // Get appropriate image URL
  const getImageUrl = () => {
    if (imageError) return fallbackImage;
    
    // Check different image properties based on the data format
    return media.imageUrl || 
           (media as any).thumbnail || 
           (media as any).poster || 
           fallbackImage;
  };
  
  // Get genres display
  const getGenres = () => {
    if (isMovie) {
      const movie = media as Movie;
      if (movie.genres && Array.isArray(movie.genres) && movie.genres.length > 0) {
        return movie.genres[0]; // Just display first genre for space
      }
      return movie.genre || 'Unknown';
    }
    return media.genre || 'Unknown';
  };
  
  // Get director/creator
  const getCreator = () => {
    if (isMovie) {
      const movie = media as Movie;
      if (movie.directors && Array.isArray(movie.directors) && movie.directors.length > 0) {
        return `Director: ${movie.directors[0]}`;
      }
      return movie.director ? `Director: ${movie.director}` : '';
    } else {
      const series = media as Series;
      return series.creator ? `Creator: ${series.creator}` : '';
    }
  };
  
  // Get duration
  const getDuration = () => {
    if (isMovie) {
      const movie = media as Movie;
      return movie.duration ? `${movie.duration} min` : '';
    } else {
      const series = media as Series;
      
      // Handle both data formats
      const seasons = series.seasonCount || series.seasons || 0;
      const episodes = series.episodeCount || (Array.isArray(series.episodes) ? series.episodes.length : 0);
      
      if (seasons === 1) {
        return `${seasons} Season, ${episodes} Episodes`;
      }
      return `${seasons} Seasons, ${episodes} Episodes`;
    }
  };
  
  // Check if this item is already in the cart
  const inCart = isInCart(media.id.toString());
  
  // Handle adding or removing from cart
  const handleCartAction = () => {
    if (inCart) {
      // Remove from cart
      removeFromCart(media.id.toString());
    } else {
      // Add to cart with animation
      setIsAdding(true);
      
      // Create cart item
      const cartItem: CartItem = {
        id: media.id.toString(),
        title: media.title,
        type: mediaType as CartItemType,
        data: media
      };
      
      // Add to cart
      addToCart(cartItem);
      
      // Reset animation after a short delay
      setTimeout(() => setIsAdding(false), 500);
    }
  };

  return (
    <Card 
      className="overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow"
      data-testid="media-card"
    >
      <div className="relative h-[320px] overflow-hidden">
        <Image
          src={getImageUrl()}
          alt={media.title}
          fill
          style={{ objectFit: 'cover' }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="transition-transform hover:scale-105"
          onError={() => setImageError(true)}
        />
        <Badge 
          className="absolute top-2 right-2" 
          variant="secondary"
          data-testid={`${mediaType}-network`}
        >
          {media.network || 'Unknown'}
        </Badge>
        <Badge 
          className="absolute top-2 left-2" 
          variant={isMovie ? "destructive" : "default"}
        >
          {isMovie ? <Film className="h-3 w-3 mr-1" /> : <Tv className="h-3 w-3 mr-1" />}
          {isMovie ? 'Movie' : 'TV'}
        </Badge>
      </div>
      
      <CardContent className="flex-grow p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg truncate" title={media.title}>
            {media.title}
          </h3>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-500 mr-1" />
            <span className="text-sm font-medium">
              {typeof media.rating === 'number' 
                ? media.rating.toFixed(1) 
                : media.rating}
            </span>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge variant="outline" className="flex items-center" data-testid={`${mediaType}-year`}>
            <Calendar className="h-3 w-3 mr-1" />
            {getYear()}
          </Badge>
          <Badge variant="outline" data-testid={`${mediaType}-genre`}>
            {getGenres()}
          </Badge>
          <Badge variant="outline" className="flex items-center" data-testid={`${mediaType}-duration`}>
            <Clock className="h-3 w-3 mr-1" />
            {getDuration()}
          </Badge>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-3">
          {getDescription()}
        </p>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
          {getCreator()}
        </div>
        
        <Button 
          size="sm" 
          variant={inCart ? "default" : "secondary"}
          className={`ml-2 flex items-center ${inCart ? 'bg-green-600 hover:bg-green-700 text-white' : ''} ${isAdding ? 'animate-pulse' : ''}`}
          onClick={handleCartAction}
          data-testid={`add-to-cart-${media.id.toString()}`}
        >
          {inCart ? (
            <>
              <Check className="h-4 w-4 mr-1" />
              In Cart
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4 mr-1" />
              Add
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
} 