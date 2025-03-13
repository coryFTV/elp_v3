'use client';

import React, { useState } from 'react';
import { Match } from '@/types/match';
import { MatchCard } from './MatchCard';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface MatchGridViewProps {
  matches: Match[];
  onFilterChange?: (filter: { type: string; value: string }) => void;
}

export default function MatchGridView({ matches, onFilterChange }: MatchGridViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter matches based on search term
  const filteredMatches = matches.filter(match => {
    if (!searchTerm) return true;
    
    const searchableFields = [
      match.title,
      match.hometeam,
      match.awayteam,
      match.sport,
      match.league,
      match.network,
    ].join(' ').toLowerCase();
    
    return searchableFields.includes(searchTerm.toLowerCase());
  });
  
  // Handle tag clicks (sport, league, network)
  const handleTagClick = (type: 'league' | 'network' | 'sport', value: string) => {
    if (onFilterChange) {
      onFilterChange({ type, value });
    }
  };
  
  if (matches.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-lg" data-testid="match-grid-view">
        <p className="text-gray-500">No matches found</p>
      </div>
    );
  }
  
  return (
    <div data-testid="match-grid-view">
      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <Input
          type="text"
          placeholder="Search matches..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {filteredMatches.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No matches found for "{searchTerm}"</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMatches.map((match) => (
            <MatchCard 
              key={match.id} 
              match={match} 
              onTagClick={handleTagClick}
            />
          ))}
        </div>
      )}
    </div>
  );
} 