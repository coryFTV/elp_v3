'use client';

import React, { useState } from 'react';
import { Match } from '@/types/match';
import { formatDate, formatTime } from '@/lib/matchesService';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, Check, Link as LinkIcon, ChevronUp, ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { buildMatchUrl } from '@/services/affiliateLinkService';

type SortField = 'title' | 'sport' | 'league' | 'network' | 'starttime';
type SortDirection = 'ascending' | 'descending';

interface MatchTableViewProps {
  matches: Match[];
}

export default function MatchTableView({ matches }: MatchTableViewProps) {
  const { addToCart, isInCart, removeFromCart } = useCart();
  const [sortField, setSortField] = useState<SortField>('starttime');
  const [sortDirection, setSortDirection] = useState<SortDirection>('ascending');
  
  // Check if match is live
  const isLive = (match: Match) => {
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
  
  // Handle sorting on column headers
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if already sorting by this field
      setSortDirection(sortDirection === 'ascending' ? 'descending' : 'ascending');
    } else {
      // New field, default to ascending
      setSortField(field);
      setSortDirection('ascending');
    }
  };
  
  // Sort matches based on current sort field and direction
  const sortedMatches = [...matches].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortField) {
      case 'title':
        aValue = a.title;
        bValue = b.title;
        break;
      case 'sport':
        aValue = a.sport;
        bValue = b.sport;
        break;
      case 'league':
        aValue = a.league;
        bValue = b.league;
        break;
      case 'network':
        aValue = a.network;
        bValue = b.network;
        break;
      case 'starttime':
      default:
        aValue = new Date(a.starttime).getTime();
        bValue = new Date(b.starttime).getTime();
        break;
    }
    
    if (sortDirection === 'ascending') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
  
  // Handle adding or removing from cart
  const handleCartAction = (match: Match) => {
    if (isInCart(match.id)) {
      removeFromCart(match.id);
    } else {
      addToCart({
        id: match.id,
        title: match.title,
        type: 'match',
        data: match
      });
    }
  };
  
  // Generate an affiliate link for a match
  const generateLink = (match: Match) => {
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
  
  if (matches.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-lg" data-testid="match-table-view">
        <p className="text-gray-500">No matches found</p>
      </div>
    );
  }
  
  return (
    <div className="overflow-x-auto" data-testid="match-table-view">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('title')}
              aria-sort={sortField === 'title' ? sortDirection : undefined}
            >
              Match
              {sortField === 'title' && (
                <span className="ml-1 inline-block">
                  {sortDirection === 'ascending' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </span>
              )}
            </TableHead>
            
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('sport')}
              aria-sort={sortField === 'sport' ? sortDirection : undefined}
            >
              Sport
              {sortField === 'sport' && (
                <span className="ml-1 inline-block">
                  {sortDirection === 'ascending' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </span>
              )}
            </TableHead>
            
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('league')}
              aria-sort={sortField === 'league' ? sortDirection : undefined}
            >
              League
              {sortField === 'league' && (
                <span className="ml-1 inline-block">
                  {sortDirection === 'ascending' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </span>
              )}
            </TableHead>
            
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('network')}
              aria-sort={sortField === 'network' ? sortDirection : undefined}
            >
              Network
              {sortField === 'network' && (
                <span className="ml-1 inline-block">
                  {sortDirection === 'ascending' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </span>
              )}
            </TableHead>
            
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('starttime')}
              aria-sort={sortField === 'starttime' ? sortDirection : undefined}
            >
              Time
              {sortField === 'starttime' && (
                <span className="ml-1 inline-block">
                  {sortDirection === 'ascending' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </span>
              )}
            </TableHead>
            
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        
        <TableBody>
          {sortedMatches.map((match) => (
            <TableRow key={match.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  {match.title}
                  <div className="flex gap-1">
                    {isLive(match) && (
                      <Badge className="bg-red-600 text-white" data-testid="live-badge">
                        LIVE
                      </Badge>
                    )}
                    {match.regionalRestrictions && (
                      <Badge className="bg-amber-500 text-white" data-testid="regional-badge">
                        Regional
                      </Badge>
                    )}
                  </div>
                </div>
              </TableCell>
              
              <TableCell>
                <Badge className="bg-green-100 text-green-800">
                  {match.sport}
                </Badge>
              </TableCell>
              
              <TableCell>
                <Badge className="bg-blue-100 text-blue-800">
                  {match.league}
                </Badge>
              </TableCell>
              
              <TableCell>
                <Badge className="bg-purple-100 text-purple-800">
                  {match.network}
                </Badge>
              </TableCell>
              
              <TableCell>{formatToEST(match.starttime)}</TableCell>
              
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => generateLink(match)}
                  >
                    <LinkIcon className="w-4 h-4 mr-1" />
                    Generate Link
                  </Button>
                  
                  <Button
                    variant={isInCart(match.id) ? "default" : "secondary"}
                    size="sm"
                    className={isInCart(match.id) ? "bg-green-600 hover:bg-green-700" : ""}
                    onClick={() => handleCartAction(match)}
                  >
                    {isInCart(match.id) ? (
                      <>
                        <Check className="w-4 h-4 mr-1" />
                        Selected
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4 mr-1" />
                        Select
                      </>
                    )}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 