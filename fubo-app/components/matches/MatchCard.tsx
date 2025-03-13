'use client';

import React, { useState } from 'react';
import { Match } from '@/types/match';
import { formatDate, formatTime } from '@/lib/matchesService';
import { useCart, CartItem } from '@/contexts/CartContext';
import { ShoppingCart, Check, Link as LinkIcon, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { buildMatchUrl } from '@/services/affiliateLinkService';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface MatchCardProps {
  match: Match;
  onTagClick?: (type: 'league' | 'network' | 'sport', value: string) => void;
}

export function MatchCard({ match, onTagClick }: MatchCardProps) {
  const { addToCart, isInCart, removeFromCart } = useCart();
  const [imageError, setImageError] = useState(false);
  
  // Check if match is live
  const isLive = () => {
    const now = new Date();
    const startTime = new Date(match.starttime);
    const endTime = new Date(match.endtime);
    
    return now >= startTime && now <= endTime;
  };
  
  // Convert UTC time to EST (America/New_York timezone)
  const formatToEST = (utcTimeString: string) => {
    const date = new Date(utcTimeString);
    return date.toLocaleString('en-US', {
      timeZone: 'America/New_York',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Handle adding or removing from cart
  const handleCartAction = () => {
    if (isInCart(match.id)) {
      removeFromCart(match.id);
    } else {
      const cartItem: CartItem = {
        id: match.id,
        title: match.title,
        type: 'match',
        data: match
      };
      addToCart(cartItem);
    }
  };
  
  // Generate an affiliate link for a match
  const generateLink = () => {
    const url = buildMatchUrl(match.id, { 
      sharedId: `${match.league}-${match.id}`,
      utmContent: match.title
    });
    
    // Only run on client side
    if (typeof window !== 'undefined') {
      // Copy to clipboard
      navigator.clipboard.writeText(url)
        .then(() => {
          alert('Link copied to clipboard!');
        })
        .catch((err) => {
          console.error('Error copying to clipboard:', err);
          alert('Failed to copy link. Please try again.');
        });
    }
  };
  
  const handleTagClick = (type: 'league' | 'network' | 'sport', value: string) => {
    if (onTagClick) {
      onTagClick(type, value);
    }
  };
  
  const renderThumbnail = () => {
    if (!match.thumbnail || imageError) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-slate-200">
          <ImageIcon className="h-12 w-12 text-slate-400" />
          <span className="text-slate-400 ml-2">No image</span>
        </div>
      );
    }
    
    return (
      <Image
        src={match.thumbnail}
        alt={match.title}
        width={320}
        height={180}
        className="w-full h-full object-cover transition-transform hover:scale-105"
        onError={() => setImageError(true)}
        priority={false}
        unoptimized={false}
      />
    );
  };
  
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative">
        <div className="aspect-video bg-slate-100 relative overflow-hidden">
          {renderThumbnail()}
        </div>
        
        {isLive() && (
          <Badge 
            className="absolute top-2 right-2 bg-red-600 text-white"
            data-testid="live-badge"
          >
            LIVE
          </Badge>
        )}
        
        {match.regionalRestrictions && (
          <Badge 
            className="absolute top-2 left-2 bg-amber-500 text-white"
            data-testid="regional-badge"
          >
            Regional
          </Badge>
        )}
      </div>
      
      <CardContent className="p-4 flex-grow flex flex-col">
        <div className="text-sm text-gray-500 mb-1">
          {formatToEST(match.starttime)} EST
        </div>
        
        <h3 className="font-semibold mb-2">{match.title}</h3>
        
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge 
            className="bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer"
            onClick={() => handleTagClick('league', match.league)}
            data-testid="league-badge"
          >
            {match.league}
          </Badge>
          
          <Badge 
            className="bg-purple-100 text-purple-800 hover:bg-purple-200 cursor-pointer"
            onClick={() => handleTagClick('network', match.network)}
            data-testid="network-badge"
          >
            {match.network}
          </Badge>
          
          <Badge 
            className="bg-green-100 text-green-800 hover:bg-green-200 cursor-pointer"
            onClick={() => handleTagClick('sport', match.sport)}
            data-testid="sport-badge"
          >
            {match.sport}
          </Badge>
        </div>
      </CardContent>
      
      <CardFooter className="border-t p-3 flex justify-between gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-grow" 
          onClick={generateLink}
          data-testid="generate-link-button"
        >
          <LinkIcon className="w-4 h-4 mr-2" />
          Copy Link
        </Button>
        
        <Button 
          variant={isInCart(match.id) ? "default" : "secondary"}
          size="sm" 
          className={cn("flex-grow", isInCart(match.id) ? "bg-green-600 hover:bg-green-700" : "")}
          onClick={handleCartAction}
          data-testid="cart-button"
        >
          {isInCart(match.id) ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Selected
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4 mr-2" />
              Select
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
} 