'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuCheckboxItem 
} from '@/components/ui/dropdown-menu';

interface FilterBarProps {
  options: {
    genres?: string[];
    networks?: string[];
    sports?: string[];
    leagues?: string[];
  };
  activeFilters: Record<string, string[]>;
  onFilterChange: (type: string, value: string, isAdding: boolean) => void;
  onClearFilters: () => void;
}

export function FilterBar({ 
  options, 
  activeFilters, 
  onFilterChange, 
  onClearFilters 
}: FilterBarProps) {
  // Get the count of active filters across all filter types
  const activeFilterCount = Object.values(activeFilters).reduce(
    (count, values) => count + values.length, 
    0
  );

  // Determine which filter dropdowns to show based on the available options
  const showGenres = options.genres && options.genres.length > 0;
  const showNetworks = options.networks && options.networks.length > 0;
  const showSports = options.sports && options.sports.length > 0;
  const showLeagues = options.leagues && options.leagues.length > 0;

  // Convert a filter type to human-readable label
  const getFilterTypeLabel = (type: string): string => {
    switch(type) {
      case 'genre': return 'Genre';
      case 'network': return 'Network';
      case 'sport': return 'Sport';
      case 'league': return 'League';
      default: return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-wrap gap-2 items-center">
        {/* Genre Filter */}
        {showGenres && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Genres
                {activeFilters.genre && activeFilters.genre.length > 0 && (
                  <span className="ml-1 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
                    {activeFilters.genre.length}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              {options.genres?.map((genre) => (
                <DropdownMenuCheckboxItem
                  key={genre}
                  checked={activeFilters.genre?.includes(genre)}
                  onCheckedChange={(checked: boolean) => 
                    onFilterChange('genre', genre, checked)
                  }
                >
                  {genre}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Network Filter */}
        {showNetworks && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Networks
                {activeFilters.network && activeFilters.network.length > 0 && (
                  <span className="ml-1 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
                    {activeFilters.network.length}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              {options.networks?.map((network) => (
                <DropdownMenuCheckboxItem
                  key={network}
                  checked={activeFilters.network?.includes(network)}
                  onCheckedChange={(checked: boolean) => 
                    onFilterChange('network', network, checked)
                  }
                >
                  {network}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Sport Filter */}
        {showSports && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Sports
                {activeFilters.sport && activeFilters.sport.length > 0 && (
                  <span className="ml-1 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
                    {activeFilters.sport.length}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              {options.sports?.map((sport) => (
                <DropdownMenuCheckboxItem
                  key={sport}
                  checked={activeFilters.sport?.includes(sport)}
                  onCheckedChange={(checked: boolean) => 
                    onFilterChange('sport', sport, checked)
                  }
                >
                  {sport}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* League Filter */}
        {showLeagues && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Leagues
                {activeFilters.league && activeFilters.league.length > 0 && (
                  <span className="ml-1 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
                    {activeFilters.league.length}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              {options.leagues?.map((league) => (
                <DropdownMenuCheckboxItem
                  key={league}
                  checked={activeFilters.league?.includes(league)}
                  onCheckedChange={(checked: boolean) => 
                    onFilterChange('league', league, checked)
                  }
                >
                  {league}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Clear filters button - only shown when filters are active */}
        {activeFilterCount > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearFilters}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            Clear filters
            <X className="ml-1 h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Active filters display */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(activeFilters).map(([type, values]) => 
            values.map(value => (
              <div 
                key={`${type}-${value}`}
                className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm flex items-center"
              >
                <span className="text-xs text-muted-foreground mr-1">
                  {getFilterTypeLabel(type)}:
                </span>
                {value}
                <button
                  className="ml-1 rounded-full hover:bg-secondary-foreground/20 p-1"
                  onClick={() => onFilterChange(type, value, false)}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
} 