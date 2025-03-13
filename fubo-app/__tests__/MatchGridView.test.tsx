import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MatchGridView from '../components/matches/MatchGridView';
import { CartProvider } from '../contexts/CartContext';

// Mock useRouter
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    query: {}
  }),
}));

// Mock affiliate link service
jest.mock('@/services/affiliateLinkService', () => ({
  buildMatchUrl: jest.fn(() => 'https://mocked-url.com')
}));

const mockMatches = [
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
];

describe('MatchGridView Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders grid of match cards correctly', () => {
    render(
      <CartProvider>
        <MatchGridView matches={mockMatches} />
      </CartProvider>
    );
    
    // Check if both matches are rendered
    expect(screen.getByText('Match 1: Team A vs Team B')).toBeInTheDocument();
    expect(screen.getByText('Match 2: Team C vs Team D')).toBeInTheDocument();
    
    // Check if different sports are displayed correctly
    expect(screen.getByText('Soccer')).toBeInTheDocument();
    expect(screen.getByText('Basketball')).toBeInTheDocument();
    
    // Check if leagues are displayed
    expect(screen.getByText('Premier League')).toBeInTheDocument();
    expect(screen.getByText('NBA')).toBeInTheDocument();
    
    // Check networks
    expect(screen.getByText('NBC')).toBeInTheDocument();
    expect(screen.getByText('ESPN')).toBeInTheDocument();
    
    // Check for LIVE badge on the second match
    const liveBadges = screen.getAllByText('LIVE');
    expect(liveBadges.length).toBe(1);
    
    // Check for Regional badge on the first match
    const regionalBadges = screen.getAllByText('Regional');
    expect(regionalBadges.length).toBe(1);
  });
  
  it('handles empty matches array', () => {
    render(
      <CartProvider>
        <MatchGridView matches={[]} />
      </CartProvider>
    );
    
    expect(screen.getByText('No matches found')).toBeInTheDocument();
  });
  
  it('handles tag filtering correctly', () => {
    const mockOnFilterChange = jest.fn();
    
    render(
      <CartProvider>
        <MatchGridView 
          matches={mockMatches} 
          onFilterChange={mockOnFilterChange} 
        />
      </CartProvider>
    );
    
    // Find and click on Premier League badge
    const leagueBadges = screen.getAllByTestId('league-badge');
    fireEvent.click(leagueBadges[0]);
    
    expect(mockOnFilterChange).toHaveBeenCalledWith({
      type: 'league',
      value: 'Premier League'
    });
    
    // Find and click on Soccer badge
    const sportBadges = screen.getAllByTestId('sport-badge');
    fireEvent.click(sportBadges[0]);
    
    expect(mockOnFilterChange).toHaveBeenCalledWith({
      type: 'sport',
      value: 'Soccer'
    });
  });
  
  it('displays search input and filters matches', () => {
    render(
      <CartProvider>
        <MatchGridView matches={mockMatches} />
      </CartProvider>
    );
    
    // Find search input
    const searchInput = screen.getByPlaceholderText('Search matches...');
    expect(searchInput).toBeInTheDocument();
    
    // Type 'Team A' in search input
    fireEvent.change(searchInput, { target: { value: 'Team A' } });
    
    // After search, only Match 1 should be visible
    expect(screen.getByText('Match 1: Team A vs Team B')).toBeInTheDocument();
    expect(screen.queryByText('Match 2: Team C vs Team D')).not.toBeInTheDocument();
    
    // Clear search
    fireEvent.change(searchInput, { target: { value: '' } });
    
    // Both matches should be visible again
    expect(screen.getByText('Match 1: Team A vs Team B')).toBeInTheDocument();
    expect(screen.getByText('Match 2: Team C vs Team D')).toBeInTheDocument();
  });
}); 