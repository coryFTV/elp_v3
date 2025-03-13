import React from 'react';

interface MatchesFilterProps {
  onDateChange: (date: string) => void;
  onSportChange: (sport: string) => void;
  onLeagueChange: (league: string) => void;
  date: string;
  sport: string;
  league: string;
  sports: string[];
  leagues: string[];
}

export function MatchesFilter({
  onDateChange,
  onSportChange,
  onLeagueChange,
  date,
  sport,
  league,
  sports,
  leagues
}: MatchesFilterProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <h2 className="text-lg font-semibold mb-4">Filter Matches</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="date-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            id="date-filter"
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            data-testid="date-filter"
          />
        </div>
        
        <div>
          <label htmlFor="sport-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Sport
          </label>
          <select
            id="sport-filter"
            value={sport}
            onChange={(e) => onSportChange(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            data-testid="sport-filter"
          >
            <option value="">All Sports</option>
            {sports.map((sportOption) => (
              <option key={sportOption} value={sportOption}>
                {sportOption}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="league-filter" className="block text-sm font-medium text-gray-700 mb-1">
            League
          </label>
          <select
            id="league-filter"
            value={league}
            onChange={(e) => onLeagueChange(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            data-testid="league-filter"
          >
            <option value="">All Leagues</option>
            {leagues.map((leagueOption) => (
              <option key={leagueOption} value={leagueOption}>
                {leagueOption}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={() => {
            onDateChange('');
            onSportChange('');
            onLeagueChange('');
          }}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          data-testid="reset-filters"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
} 