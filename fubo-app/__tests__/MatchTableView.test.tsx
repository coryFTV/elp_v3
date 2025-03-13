import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MatchTableView from '../components/matches/MatchTableView';
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

describe('MatchTableView Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders table with match data correctly', () => {
    render(
      <CartProvider>
        <MatchTableView matches={mockMatches} />
      </CartProvider>
    );
    
    // Check table headers
    expect(screen.getByText('Match')).toBeInTheDocument();
    expect(screen.getByText('Sport')).toBeInTheDocument();
    expect(screen.getByText('League')).toBeInTheDocument();
    expect(screen.getByText('Network')).toBeInTheDocument();
    expect(screen.getByText('Time')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
    
    // Check if both match titles are rendered
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
        <MatchTableView matches={[]} />
      </CartProvider>
    );
    
    // Should display a message when no matches
    expect(screen.getByText('No matches found')).toBeInTheDocument();
  });
  
  it('handles sorting when clicking on column headers', () => {
    render(
      <CartProvider>
        <MatchTableView matches={mockMatches} />
      </CartProvider>
    );
    
    // Click on Sport header to sort
    const sportHeader = screen.getByText('Sport');
    fireEvent.click(sportHeader);
    
    // Should show sort direction indicator
    expect(sportHeader).toHaveAttribute('aria-sort', 'ascending');
    
    // Click again to reverse sort
    fireEvent.click(sportHeader);
    expect(sportHeader).toHaveAttribute('aria-sort', 'descending');
    
    // Click on a different header
    const leagueHeader = screen.getByText('League');
    fireEvent.click(leagueHeader);
    
    // Sport header should reset, League header should show sort
    expect(sportHeader).not.toHaveAttribute('aria-sort');
    expect(leagueHeader).toHaveAttribute('aria-sort', 'ascending');
  });
  
  it('has working select/deselect buttons for each match', () => {
    render(
      <CartProvider>
        <MatchTableView matches={mockMatches} />
      </CartProvider>
    );
    
    // Get all select buttons
    const selectButtons = screen.getAllByText('Select');
    expect(selectButtons.length).toBe(2);
    
    // Click first select button
    fireEvent.click(selectButtons[0]);
    
    // Now should have one "Selected" button and one "Select" button
    expect(screen.getByText('Selected')).toBeInTheDocument();
    expect(screen.getAllByText('Select').length).toBe(1);
    
    // Click the "Selected" button to deselect
    fireEvent.click(screen.getByText('Selected'));
    
    // Should have two "Select" buttons again
    expect(screen.getAllByText('Select').length).toBe(2);
  });
  
  it('has working "Generate Link" buttons', () => {
    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockImplementation(() => Promise.resolve()),
      },
    });
    // Mock window.alert
    window.alert = jest.fn();
    
    render(
      <CartProvider>
        <MatchTableView matches={mockMatches} />
      </CartProvider>
    );
    
    // Get all Generate Link buttons
    const linkButtons = screen.getAllByText('Generate Link');
    expect(linkButtons.length).toBe(2);
    
    // Click first link button
    fireEvent.click(linkButtons[0]);
    
    // Check if clipboard API was called
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('https://mocked-url.com');
    
    // Check if alert was shown
    expect(window.alert).toHaveBeenCalledWith('Link copied to clipboard!');
  });
}); 