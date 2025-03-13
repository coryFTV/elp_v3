import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SportsPage from '../pages/sports';
import { CartProvider } from '../contexts/CartContext';

// Mock useRouter
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    query: {},
    pathname: '/sports'
  }),
}));

// Mock the match data service
jest.mock('@/services/matchDataService', () => ({
  getMatches: jest.fn(() => Promise.resolve([
    {
      id: '123',
      title: 'Match 1: Team A vs Team B',
      hometeam: 'Team A',
      awayteam: 'Team B',
      hometeamabbr: 'TA',
      awayteamabbr: 'TB',
      hometeamID: 'ta-id',
      awayteamID: 'tb-id',
      starttime: new Date(Date.now() + 3600000).toISOString(),
      endtime: new Date(Date.now() + 7200000).toISOString(),
      sport: 'Soccer',
      league: 'Premier League',
      league_id: 'pl-id',
      network: 'NBC',
      networkUrl: 'https://nbc.com',
      matchId: '123',
      matchUrl: '/matches/123',
      thumbnail: 'https://example.com/match1.jpg',
      country: 'England',
      url: '/match/123',
      regionalRestrictions: true
    },
    {
      id: '456',
      title: 'Match 2: Team C vs Team D',
      hometeam: 'Team C',
      awayteam: 'Team D',
      hometeamabbr: 'TC',
      awayteamabbr: 'TD',
      hometeamID: 'tc-id',
      awayteamID: 'td-id',
      starttime: new Date(Date.now() - 1800000).toISOString(), // Live match
      endtime: new Date(Date.now() + 1800000).toISOString(),
      sport: 'Basketball',
      league: 'NBA',
      league_id: 'nba-id',
      network: 'ESPN',
      networkUrl: 'https://espn.com',
      matchId: '456',
      matchUrl: '/matches/456',
      thumbnail: 'https://example.com/match2.jpg',
      country: 'USA',
      url: '/match/456',
      regionalRestrictions: false
    }
  ])),
  getFilterOptions: jest.fn(() => Promise.resolve({
    sports: ['Soccer', 'Basketball'],
    leagues: ['Premier League', 'NBA']
  }))
}));

// Mock the affiliate link service
jest.mock('@/services/affiliateLinkService', () => ({
  buildMatchUrl: jest.fn(() => 'https://mocked-url.com')
}));

describe('Sports Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders and loads match data', async () => {
    render(
      <CartProvider>
        <SportsPage />
      </CartProvider>
    );
    
    // Should show loading state initially
    expect(screen.getByText('Loading matches...')).toBeInTheDocument();
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByText('Loading matches...')).not.toBeInTheDocument();
    });
    
    // Should show match data
    expect(screen.getByText('Match 1: Team A vs Team B')).toBeInTheDocument();
    expect(screen.getByText('Match 2: Team C vs Team D')).toBeInTheDocument();
  });
  
  it('defaults to grid view and toggles to table view', async () => {
    render(
      <CartProvider>
        <SportsPage />
      </CartProvider>
    );
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByText('Loading matches...')).not.toBeInTheDocument();
    });
    
    // Grid view should be active by default
    const gridButton = screen.getByTestId('grid-view-button');
    const tableButton = screen.getByTestId('table-view-button');
    
    expect(gridButton).toHaveClass('bg-blue-600');
    expect(tableButton).not.toHaveClass('bg-blue-600');
    
    // The layout should be grid-like (cards)
    expect(screen.getByTestId('match-grid-view')).toBeInTheDocument();
    expect(screen.queryByTestId('match-table-view')).not.toBeInTheDocument();
    
    // Click the table view button
    fireEvent.click(tableButton);
    
    // Table view should now be active
    expect(gridButton).not.toHaveClass('bg-blue-600');
    expect(tableButton).toHaveClass('bg-blue-600');
    
    // The layout should be table-like
    expect(screen.queryByTestId('match-grid-view')).not.toBeInTheDocument();
    expect(screen.getByTestId('match-table-view')).toBeInTheDocument();
    
    // Click the grid view button again
    fireEvent.click(gridButton);
    
    // Grid view should be active again
    expect(gridButton).toHaveClass('bg-blue-600');
    expect(tableButton).not.toHaveClass('bg-blue-600');
    
    // The layout should be grid-like again
    expect(screen.getByTestId('match-grid-view')).toBeInTheDocument();
    expect(screen.queryByTestId('match-table-view')).not.toBeInTheDocument();
  });
  
  it('applies filters correctly', async () => {
    render(
      <CartProvider>
        <SportsPage />
      </CartProvider>
    );
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByText('Loading matches...')).not.toBeInTheDocument();
    });
    
    // Both matches should be visible initially
    expect(screen.getByText('Match 1: Team A vs Team B')).toBeInTheDocument();
    expect(screen.getByText('Match 2: Team C vs Team D')).toBeInTheDocument();
    
    // Click on the Soccer filter
    const soccerFilter = screen.getByText('Soccer');
    fireEvent.click(soccerFilter);
    
    // Only the soccer match should be visible now
    expect(screen.getByText('Match 1: Team A vs Team B')).toBeInTheDocument();
    expect(screen.queryByText('Match 2: Team C vs Team D')).not.toBeInTheDocument();
    
    // Clear the filter
    const clearFilterButton = screen.getByText('Clear Filters');
    fireEvent.click(clearFilterButton);
    
    // Both matches should be visible again
    expect(screen.getByText('Match 1: Team A vs Team B')).toBeInTheDocument();
    expect(screen.getByText('Match 2: Team C vs Team D')).toBeInTheDocument();
  });
  
  it('preserves filter state when toggling between views', async () => {
    render(
      <CartProvider>
        <SportsPage />
      </CartProvider>
    );
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByText('Loading matches...')).not.toBeInTheDocument();
    });
    
    // Apply a filter
    const soccerFilter = screen.getByText('Soccer');
    fireEvent.click(soccerFilter);
    
    // Only the soccer match should be visible
    expect(screen.getByText('Match 1: Team A vs Team B')).toBeInTheDocument();
    expect(screen.queryByText('Match 2: Team C vs Team D')).not.toBeInTheDocument();
    
    // Switch to table view
    const tableButton = screen.getByTestId('table-view-button');
    fireEvent.click(tableButton);
    
    // The filter should still be applied in table view
    expect(screen.getByText('Match 1: Team A vs Team B')).toBeInTheDocument();
    expect(screen.queryByText('Match 2: Team C vs Team D')).not.toBeInTheDocument();
    
    // Switch back to grid view
    const gridButton = screen.getByTestId('grid-view-button');
    fireEvent.click(gridButton);
    
    // The filter should still be applied in grid view
    expect(screen.getByText('Match 1: Team A vs Team B')).toBeInTheDocument();
    expect(screen.queryByText('Match 2: Team C vs Team D')).not.toBeInTheDocument();
  });
}); 