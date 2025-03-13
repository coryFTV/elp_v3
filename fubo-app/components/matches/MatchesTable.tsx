'use client';

import React from 'react';
import { Match } from '@/types/match';
import { formatDate, formatTime } from '@/lib/matchesService';
import { useCart, CartItem } from '@/contexts/CartContext';
import { ShoppingCart, Check, Link as LinkIcon } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { buildMatchUrl } from '@/services/affiliateLinkService';

interface MatchesTableProps {
  matches: Match[];
}

export function MatchesTable({ matches }: MatchesTableProps) {
  const { addToCart, isInCart, removeFromCart } = useCart();
  
  // Handle adding or removing from cart
  const handleCartAction = (match: Match) => {
    if (isInCart(match.id)) {
      // Remove from cart
      removeFromCart(match.id);
    } else {
      // Create cart item
      const cartItem: CartItem = {
        id: match.id,
        title: match.title,
        type: 'match',
        data: match
      };
      
      // Add to cart
      addToCart(cartItem);
    }
  };
  
  // Generate an affiliate link for a match
  const generateLink = (match: Match) => {
    const url = buildMatchUrl(match.id, { 
      sharedId: `${match.league}-${match.id}`,
      utmContent: match.title
    });
    
    // Copy to clipboard
    navigator.clipboard.writeText(url)
      .then(() => {
        alert('Link copied to clipboard!');
      })
      .catch((err) => {
        console.error('Error copying to clipboard:', err);
        alert('Failed to copy link. See console for details.');
      });
  };
  
  if (matches.length === 0) {
    return (
      <div className="text-center p-8 bg-white rounded-lg shadow">
        <p className="text-gray-500">No matches found with the selected filters.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg shadow">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sport</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">League</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Matchup</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Network</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {matches.map((match) => {
            const inCart = isInCart(match.id);
            
            return (
              <tr key={match.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" data-testid={`match-date-${match.id}`}>
                  {formatDate(match.starttime)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" data-testid={`match-time-${match.id}`}>
                  {formatTime(match.starttime)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {match.sport}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {match.league}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {match.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {match.network}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex items-center"
                    onClick={() => generateLink(match)}
                    data-testid={`match-link-${match.id}`}
                  >
                    <LinkIcon className="h-4 w-4 mr-1" />
                    Link
                  </Button>
                  
                  <Button
                    size="sm"
                    variant={inCart ? "default" : "secondary"}
                    className={`flex items-center ${inCart ? 'bg-green-600 hover:bg-green-700 text-white' : ''}`}
                    onClick={() => handleCartAction(match)}
                    data-testid={`match-cart-${match.id}`}
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
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
} 