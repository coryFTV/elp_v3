'use client';

import React from 'react';
import { Match } from '@/types/match';
import { MatchCard } from './MatchCard';

interface MatchesGridProps {
  matches: Match[];
  onTagClick?: (type: 'league' | 'network' | 'sport', value: string) => void;
}

export function MatchesGrid({ matches, onTagClick }: MatchesGridProps) {
  if (matches.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No matches found. Try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" data-testid="matches-grid">
      {matches.map((match) => (
        <MatchCard 
          key={match.id} 
          match={match} 
          onTagClick={onTagClick}
        />
      ))}
    </div>
  );
} 