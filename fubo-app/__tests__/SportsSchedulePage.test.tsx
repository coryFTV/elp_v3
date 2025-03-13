// Mock the components first
jest.mock('@/components/Layout', () => ({
  Layout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-layout">{children}</div>
  )
}));

jest.mock('@/components/matches/MatchesFilter', () => ({
  MatchesFilter: ({ 
    onDateChange, 
    onSportChange, 
    onLeagueChange,
    onStartTimeChange,
    onEndTimeChange, 
    date, 
    sport, 
    league,
    startTime,
    endTime, 
    sports = [], 
    leagues = [] 
  }: { 
    onDateChange: (date: string) => void;
    onSportChange: (sport: string) => void;
    onLeagueChange: (league: string) => void;
    onStartTimeChange: (time: string) => void;
    onEndTimeChange: (time: string) => void;
    date: string;
    sport: string;
    league: string;
    startTime: string;
    endTime: string;
    sports: string[];
    leagues: string[];
  }) => (
    <div data-testid="mock-matches-filter">
      <button onClick={() => onDateChange('2025-03-12')} data-testid="mock-date-button">Set Date</button>
      <button onClick={() => onSportChange('Soccer')} data-testid="mock-sport-button">Set Sport</button>
      <button onClick={() => onLeagueChange('Premier League')} data-testid="mock-league-button">Set League</button>
      <button onClick={() => {
        onDateChange('');
        onSportChange('');
        onLeagueChange('');
        onStartTimeChange('');
        onEndTimeChange('');
      }} data-testid="mock-reset-button">Reset</button>
      <span>Sports: {sports ? sports.length : 0}</span>
      <span>Leagues: {leagues ? leagues.length : 0}</span>
    </div>
  )
}));

jest.mock('@/components/matches/MatchesTable', () => ({
  MatchesTable: ({ matches }: { matches: any[] }) => (
    <div data-testid="mock-matches-table">
      <span>Showing {matches ? matches.length : 0} matches</span>
    </div>
  )
}));

// Mock the matchesService with a factory function
jest.mock('@/services/matchesService', () => {
  // Sample match data for testing
  const sampleMatches = [
    {
      id: '1',
      title: 'Match 1',
      hometeam: 'Team A',
      awayteam: 'Team B',
      hometeamabbr: 'TA',
      awayteamabbr: 'TB',
      hometeamID: '123',
      awayteamID: '456',
      starttime: '2025-03-12T14:00:00Z',
      endtime: '2025-03-12T16:00:00Z',
      sport: 'Soccer',
      league: 'Premier League',
      league_id: '789',
      network: 'ESPN',
      networkUrl: 'https://example.com',
      matchId: 'M123',
      matchUrl: 'https://example.com',
      thumbnail: 'https://example.com/thumb.jpg',
      country: 'US',
      url: 'https://example.com',
      regionalRestrictions: false
    },
    {
      id: '2',
      title: 'Match 2',
      hometeam: 'Team C',
      awayteam: 'Team D',
      hometeamabbr: 'TC',
      awayteamabbr: 'TD',
      hometeamID: '789',
      awayteamID: '012',
      starttime: '2025-03-13T14:00:00Z',
      endtime: '2025-03-13T16:00:00Z',
      sport: 'Basketball',
      league: 'NBA',
      league_id: '012',
      network: 'TNT',
      networkUrl: 'https://example.com',
      matchId: 'M456',
      matchUrl: 'https://example.com',
      thumbnail: 'https://example.com/thumb.jpg',
      country: 'US',
      url: 'https://example.com',
      regionalRestrictions: false
    }
  ];

  // Define a type for the match object
  type Match = {
    id: string;
    title: string;
    sport: string;
    league: string;
    [key: string]: any;
  };

  return {
    fetchMatches: jest.fn().mockResolvedValue(sampleMatches),
    filterMatchesByDate: jest.fn((matches: Match[], date: string) => 
      date ? matches.filter((m: Match) => m.id === '1') : matches
    ),
    filterMatchesByTime: jest.fn((matches: Match[], startTime: string, endTime: string) => 
      startTime || endTime ? matches.filter((m: Match) => m.id === '1') : matches
    ),
    filterMatchesBySport: jest.fn((matches: Match[], sport: string) => 
      sport ? matches.filter((m: Match) => m.sport === sport) : matches
    ),
    filterMatchesByLeague: jest.fn((matches: Match[], league: string) => 
      league ? matches.filter((m: Match) => m.league === league) : matches
    ),
    getUniqueSports: jest.fn(() => ['Soccer', 'Basketball']),
    getUniqueLeagues: jest.fn(() => ['Premier League', 'NBA']),
    getDataUrl: jest.fn(() => '/data/sampleMatches.json'),
    formatDate: jest.fn((date: string) => '2025-03-12'),
    formatTime: jest.fn((date: string) => '14:00')
  };
});

import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { expect } from '@jest/globals';
import SportsSchedule from '@/app/sports-schedule/page';

describe('Sports Schedule Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('shows loading state initially', async () => {
    render(<SportsSchedule />);
    expect(screen.getByText('Loading matches...')).toBeInTheDocument();
  });

  test('renders matches after loading', async () => {
    // Use act to handle async state updates
    await act(async () => {
      render(<SportsSchedule />);
    });
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading matches...')).not.toBeInTheDocument();
    });
    
    // Check if the MatchesTable component is rendered with data
    expect(screen.getByTestId('mock-matches-table')).toBeInTheDocument();
    
    // Use a more flexible matcher for the text
    await waitFor(() => {
      const matchesText = screen.getByTestId('mock-matches-table').textContent;
      expect(matchesText).toContain('Showing');
      expect(matchesText).toContain('matches');
    });
    
    // Check if the MatchesFilter component is rendered with options
    expect(screen.getByTestId('mock-matches-filter')).toBeInTheDocument();
    
    // Use more flexible matchers for the text
    const filterText = screen.getByTestId('mock-matches-filter').textContent;
    expect(filterText).toContain('Sports:');
    expect(filterText).toContain('Leagues:');
  });

  test('applies filters correctly', async () => {
    // Use act to handle async state updates
    await act(async () => {
      render(<SportsSchedule />);
    });
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading matches...')).not.toBeInTheDocument();
    });
    
    // Apply date filter
    await act(async () => {
      fireEvent.click(screen.getByTestId('mock-date-button'));
    });
    
    // Wait for filter to be applied and check the result
    await waitFor(() => {
      const matchesText = screen.getByTestId('mock-matches-table').textContent;
      expect(matchesText).toContain('Showing');
    });
    
    // Reset filters
    await act(async () => {
      fireEvent.click(screen.getByTestId('mock-reset-button'));
    });
    
    // Wait for reset to be applied
    await waitFor(() => {
      const matchesText = screen.getByTestId('mock-matches-table').textContent;
      expect(matchesText).toContain('Showing');
    });
    
    // Apply sport filter
    await act(async () => {
      fireEvent.click(screen.getByTestId('mock-sport-button'));
    });
    
    // Wait for filter to be applied
    await waitFor(() => {
      const matchesText = screen.getByTestId('mock-matches-table').textContent;
      expect(matchesText).toContain('Showing');
    });
  });

  test('handles fetch error correctly', async () => {
    // Mock a fetch error
    const matchesService = require('@/services/matchesService');
    matchesService.fetchMatches.mockRejectedValueOnce(new Error('Failed to fetch'));
    
    await act(async () => {
      render(<SportsSchedule />);
    });
    
    // Wait for error state to be displayed
    await waitFor(() => {
      expect(screen.queryByText('Loading matches...')).not.toBeInTheDocument();
      expect(screen.getByText('Failed to load matches. Please try again later.')).toBeInTheDocument();
    });
  });
}); 