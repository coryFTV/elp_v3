'use client';

import { useState, useEffect } from 'react';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';

export type MediaType = 'movie' | 'series';

export interface MediaFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  genres: string[];
  selectedGenre: string;
  onGenreChange: (value: string) => void;
  sortOptions: {
    value: string;
    label: string;
  }[];
  selectedSort: string;
  onSortChange: (value: string) => void;
  mediaType: MediaType;
  onReset: () => void;
}

export function MediaFilter({
  searchTerm,
  onSearchChange,
  genres,
  selectedGenre,
  onGenreChange,
  sortOptions,
  selectedSort,
  onSortChange,
  mediaType,
  onReset
}: MediaFilterProps) {
  
  return (
    <div className="mb-6 p-4 bg-card rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">
        Filter {mediaType === 'movie' ? 'Movies' : 'TV Series'}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search Input */}
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            placeholder={`Search ${mediaType === 'movie' ? 'movies' : 'TV series'}...`}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            data-testid="search-input"
          />
        </div>
        
        {/* Genre Filter */}
        <div className="space-y-2">
          <Label htmlFor="genre">Genre</Label>
          <Select value={selectedGenre} onValueChange={onGenreChange}>
            <SelectTrigger id="genre" data-testid="genre-select">
              <SelectValue placeholder="Select genre" />
            </SelectTrigger>
            <SelectContent>
              {genres.map((genre) => (
                <SelectItem key={genre} value={genre} data-testid={`genre-${genre}`}>
                  {genre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Sort Options */}
        <div className="space-y-2">
          <Label htmlFor="sort">Sort By</Label>
          <Select value={selectedSort} onValueChange={onSortChange}>
            <SelectTrigger id="sort" data-testid="sort-select">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem 
                  key={option.value} 
                  value={option.value}
                  data-testid={`sort-${option.value}`}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Reset Button */}
        <div className="flex items-end">
          <Button 
            variant="outline" 
            onClick={onReset}
            className="w-full"
            data-testid="reset-filters"
          >
            Reset Filters
          </Button>
        </div>
      </div>
    </div>
  );
} 