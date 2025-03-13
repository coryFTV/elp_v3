import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MatchesTable } from '@/components/matches/MatchesTable';
import { Match } from '@/types/match';

// Sample match data for testing
const sampleMatches: Match[] = [
  {
    "id": "29580438",
    "title": "Old Victorians vs. Farmers",
    "hometeam": "Old Victorians",
    "awayteam": "Farmers",
    "hometeamabbr": "OLV",
    "awayteamabbr": "FRM",
    "hometeamID": "12345",
    "awayteamID": "67890",
    "starttime": "2025-03-12T14:00:00Z",
    "endtime": "2025-03-12T15:00:00Z",
    "sport": "Cricket",
    "league": "European Cricket League",
    "league_id": "17203826",
    "network": "Willow Sports (Canada)",
    "networkUrl": "https://www.fubo.tv/welcome/channel/willow-sports?irmp=365718&irad=596299",
    "matchId": "EP032826920341",
    "matchUrl": "https://www.fubo.tv/welcome/matches/EP032826920341?irmp=365718&irad=596299",
    "thumbnail": "https://imgx.fubo.tv/league_logos/league_placeholder.png",
    "country": "US",
    "url": "https://www.fubo.tv/welcome/leagues/17203826?irmp=365718&irad=596299",
    "regionalRestrictions": false
  },
  {
    "id": "29664722",
    "title": "New York Yankees vs. Boston Red Sox",
    "hometeam": "New York Yankees",
    "awayteam": "Boston Red Sox",
    "hometeamabbr": "NYY",
    "awayteamabbr": "BOS",
    "hometeamID": "34567",
    "awayteamID": "89012",
    "starttime": "2025-03-13T18:00:00Z",
    "endtime": "2025-03-13T21:00:00Z",
    "sport": "Baseball",
    "league": "MLB",
    "league_id": "17203828",
    "network": "ESPN",
    "networkUrl": "https://www.fubo.tv/welcome/channel/espn?irmp=365718&irad=596299",
    "matchId": "EP032826920343",
    "matchUrl": "https://www.fubo.tv/welcome/matches/EP032826920343?irmp=365718&irad=596299",
    "thumbnail": "https://imgx.fubo.tv/league_logos/league_placeholder.png",
    "country": "US",
    "url": "https://www.fubo.tv/welcome/leagues/17203828?irmp=365718&irad=596299",
    "regionalRestrictions": false
  }
];

describe('MatchesTable Component', () => {
  it('renders matches correctly', () => {
    render(<MatchesTable matches={sampleMatches} />);
    
    // Check if the table headers are rendered
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Time')).toBeInTheDocument();
    expect(screen.getByText('Sport')).toBeInTheDocument();
    expect(screen.getByText('League')).toBeInTheDocument();
    expect(screen.getByText('Matchup')).toBeInTheDocument();
    expect(screen.getByText('Network')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
    
    // Check if match data is rendered correctly
    expect(screen.getByText('Old Victorians vs. Farmers')).toBeInTheDocument();
    expect(screen.getByText('New York Yankees vs. Boston Red Sox')).toBeInTheDocument();
    expect(screen.getByText('Cricket')).toBeInTheDocument();
    expect(screen.getByText('Baseball')).toBeInTheDocument();
    expect(screen.getByText('European Cricket League')).toBeInTheDocument();
    expect(screen.getByText('MLB')).toBeInTheDocument();
    
    // Check if buttons are rendered
    expect(screen.getAllByText('Generate Link')).toHaveLength(2);
    expect(screen.getAllByText('Add to Cart')).toHaveLength(2);
    
    // Check for specific data-testid attributes
    expect(screen.getByTestId('match-date-29580438')).toBeInTheDocument();
    expect(screen.getByTestId('match-time-29580438')).toBeInTheDocument();
    expect(screen.getByTestId('match-link-29580438')).toBeInTheDocument();
    expect(screen.getByTestId('match-cart-29580438')).toBeInTheDocument();
  });
  
  it('displays a message when no matches are found', () => {
    render(<MatchesTable matches={[]} />);
    
    expect(screen.getByText('No matches found with the selected filters.')).toBeInTheDocument();
  });
}); 