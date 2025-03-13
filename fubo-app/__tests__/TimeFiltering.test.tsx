import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { expect } from '@jest/globals';
import { filterMatchesByTime } from '@/services/matchesService';
import { Match } from '@/types/match';

// Sample matches for testing
const sampleMatches: Match[] = [
  {
    id: '1',
    title: 'Match 1',
    hometeam: 'Team A',
    awayteam: 'Team B',
    hometeamabbr: 'TA',
    awayteamabbr: 'TB',
    hometeamID: '123',
    awayteamID: '456',
    starttime: '2025-03-12T10:00:00Z', // 10:00 AM
    endtime: '2025-03-12T12:00:00Z',
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
    starttime: '2025-03-12T14:00:00Z', // 2:00 PM
    endtime: '2025-03-12T16:00:00Z',
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
  },
  {
    id: '3',
    title: 'Match 3',
    hometeam: 'Team E',
    awayteam: 'Team F',
    hometeamabbr: 'TE',
    awayteamabbr: 'TF',
    hometeamID: '345',
    awayteamID: '678',
    starttime: '2025-03-12T18:00:00Z', // 6:00 PM
    endtime: '2025-03-12T20:00:00Z',
    sport: 'Hockey',
    league: 'NHL',
    league_id: '345',
    network: 'NBC',
    networkUrl: 'https://example.com',
    matchId: 'M789',
    matchUrl: 'https://example.com',
    thumbnail: 'https://example.com/thumb.jpg',
    country: 'US',
    url: 'https://example.com',
    regionalRestrictions: false
  }
];

describe('Time Filtering Functionality', () => {
  it('filters matches by time range correctly', () => {
    // Filter with a start time of 12:00 and end time of 17:00
    const startTime = '12:00';
    const endTime = '17:00';
    
    const filtered = filterMatchesByTime(sampleMatches, startTime, endTime);
    
    // Only Match 2 (2:00 PM) should be in the results
    expect(filtered.length).toBe(1);
    expect(filtered[0].id).toBe('2');
  });
  
  it('returns all matches when no time range is provided', () => {
    const filtered = filterMatchesByTime(sampleMatches, '', '');
    
    expect(filtered.length).toBe(3);
  });
  
  it('filters matches after start time when only start time is provided', () => {
    const startTime = '15:00';
    
    const filtered = filterMatchesByTime(sampleMatches, startTime, '');
    
    // Only Match 3 (6:00 PM) should be in the results
    expect(filtered.length).toBe(1);
    expect(filtered[0].id).toBe('3');
  });
  
  it('filters matches before end time when only end time is provided', () => {
    const endTime = '12:00';
    
    const filtered = filterMatchesByTime(sampleMatches, '', endTime);
    
    // Only Match 1 (10:00 AM) should be in the results
    expect(filtered.length).toBe(1);
    expect(filtered[0].id).toBe('1');
  });
}); 