import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MatchCard } from '../components/matches/MatchCard';
import { CartProvider } from '../contexts/CartContext';

// Mock the affiliate link service
jest.mock('@/services/affiliateLinkService', () => ({
  buildMatchUrl: jest.fn(() => 'https://mocked-url.com')
}));

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn().mockImplementation(() => Promise.resolve()),
  },
});

// Mock window.alert
window.alert = jest.fn();

const mockMatch = {
  id: '123',
  title: 'Test Match: Team A vs Team B',
  hometeam: 'Team A',
  awayteam: 'Team B',
  hometeamabbr: 'TA',
  awayteamabbr: 'TB',
  hometeamID: 'ta-id',
  awayteamID: 'tb-id',
  starttime: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
  endtime: new Date(Date.now() + 7200000).toISOString(),   // 2 hours from now
  sport: 'Soccer',
  league: 'Test League',
  league_id: 'test-league-id',
  network: 'ESPN',
  networkUrl: 'https://espn.com',
  matchId: '123',
  matchUrl: '/matches/123',
  thumbnail: 'https://example.com/image.jpg',
  country: 'USA',
  url: '/match/123',
  regionalRestrictions: true
};

// Mock match that is currently live
const mockLiveMatch = {
  ...mockMatch,
  id: '456',
  title: 'Live Match: Team C vs Team D',
  starttime: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
  endtime: new Date(Date.now() + 1800000).toISOString()    // 30 minutes from now
};

describe('MatchCard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders match details correctly', () => {
    render(
      <CartProvider>
        <MatchCard match={mockMatch} />
      </CartProvider>
    );
    
    expect(screen.getByText('Test Match: Team A vs Team B')).toBeInTheDocument();
    expect(screen.getByText('Soccer')).toBeInTheDocument();
    expect(screen.getByText('Test League')).toBeInTheDocument();
    expect(screen.getByText('ESPN')).toBeInTheDocument();
    
    // Check for Regional badge
    expect(screen.getByTestId('regional-badge')).toBeInTheDocument();
    expect(screen.getByText('Regional')).toBeInTheDocument();
    
    // Check that LIVE badge is not present
    expect(screen.queryByTestId('live-badge')).not.toBeInTheDocument();
  });
  
  it('displays LIVE badge for currently ongoing matches', () => {
    render(
      <CartProvider>
        <MatchCard match={mockLiveMatch} />
      </CartProvider>
    );
    
    expect(screen.getByTestId('live-badge')).toBeInTheDocument();
    expect(screen.getByText('LIVE')).toBeInTheDocument();
  });
  
  it('calls onTagClick when clicking on a tag', () => {
    const onTagClickMock = jest.fn();
    
    render(
      <CartProvider>
        <MatchCard match={mockMatch} onTagClick={onTagClickMock} />
      </CartProvider>
    );
    
    // Click on league badge
    fireEvent.click(screen.getByTestId('league-badge'));
    expect(onTagClickMock).toHaveBeenCalledWith('league', 'Test League');
    
    // Click on sport badge
    fireEvent.click(screen.getByTestId('sport-badge'));
    expect(onTagClickMock).toHaveBeenCalledWith('sport', 'Soccer');
  });
  
  it('handles the "Copy Link" button click', () => {
    render(
      <CartProvider>
        <MatchCard match={mockMatch} />
      </CartProvider>
    );
    
    // Click on Generate Link button
    fireEvent.click(screen.getByTestId('generate-link-button'));
    
    // Check if clipboard API was called
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('https://mocked-url.com');
    
    // Check if alert was shown
    expect(window.alert).toHaveBeenCalledWith('Link copied to clipboard!');
  });
  
  it('handles adding and removing from cart', () => {
    render(
      <CartProvider>
        <MatchCard match={mockMatch} />
      </CartProvider>
    );
    
    // Initially should show "Select"
    expect(screen.getByText('Select')).toBeInTheDocument();
    
    // Click to add to cart
    fireEvent.click(screen.getByTestId('cart-button'));
    
    // Should now show "Selected"
    expect(screen.getByText('Selected')).toBeInTheDocument();
    
    // Click again to remove from cart
    fireEvent.click(screen.getByTestId('cart-button'));
    
    // Should show "Select" again
    expect(screen.getByText('Select')).toBeInTheDocument();
  });
}); 