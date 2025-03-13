import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MatchesFilter } from '@/components/matches/MatchesFilter';

// Add jest-dom matchers
import { expect } from '@jest/globals';

describe('MatchesFilter Component', () => {
  const mockOnDateChange = jest.fn();
  const mockOnSportChange = jest.fn();
  const mockOnLeagueChange = jest.fn();
  const mockOnStartTimeChange = jest.fn();
  const mockOnEndTimeChange = jest.fn();
  
  const mockSports = ['Cricket', 'Baseball', 'Basketball', 'Soccer'];
  const mockLeagues = ['European Cricket League', 'MLB', 'NBA', 'English Premier League'];
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders filter options correctly', () => {
    render(
      <MatchesFilter
        onDateChange={mockOnDateChange}
        onSportChange={mockOnSportChange}
        onLeagueChange={mockOnLeagueChange}
        onStartTimeChange={mockOnStartTimeChange}
        onEndTimeChange={mockOnEndTimeChange}
        date=""
        sport=""
        league=""
        startTime=""
        endTime=""
        sports={mockSports}
        leagues={mockLeagues}
      />
    );
    
    // Check if filter labels and controls are rendered
    expect(screen.getByText('Filter Matches')).toBeTruthy();
    expect(screen.getByLabelText('Date')).toBeTruthy();
    expect(screen.getByLabelText('Start Time')).toBeTruthy();
    expect(screen.getByLabelText('End Time')).toBeTruthy();
    expect(screen.getByLabelText('Sport')).toBeTruthy();
    expect(screen.getByLabelText('League')).toBeTruthy();
    expect(screen.getByText('Reset Filters')).toBeTruthy();
    
    // Check sport options
    const sportSelect = screen.getByTestId('sport-filter');
    expect(sportSelect).toBeTruthy();
    expect(screen.getByText('All Sports')).toBeTruthy();
    mockSports.forEach(sport => {
      expect(screen.getByText(sport)).toBeTruthy();
    });
    
    // Check league options
    const leagueSelect = screen.getByTestId('league-filter');
    expect(leagueSelect).toBeTruthy();
    expect(screen.getByText('All Leagues')).toBeTruthy();
    mockLeagues.forEach(league => {
      expect(screen.getByText(league)).toBeTruthy();
    });
  });
  
  it('calls the onChange handlers when filters are changed', () => {
    render(
      <MatchesFilter
        onDateChange={mockOnDateChange}
        onSportChange={mockOnSportChange}
        onLeagueChange={mockOnLeagueChange}
        onStartTimeChange={mockOnStartTimeChange}
        onEndTimeChange={mockOnEndTimeChange}
        date=""
        sport=""
        league=""
        startTime=""
        endTime=""
        sports={mockSports}
        leagues={mockLeagues}
      />
    );
    
    // Change date
    const dateInput = screen.getByTestId('date-filter');
    fireEvent.change(dateInput, { target: { value: '2025-03-12' } });
    expect(mockOnDateChange).toHaveBeenCalledWith('2025-03-12');
    
    // Change start time
    const startTimeInput = screen.getByTestId('start-time-filter');
    fireEvent.change(startTimeInput, { target: { value: '10:00' } });
    expect(mockOnStartTimeChange).toHaveBeenCalledWith('10:00');
    
    // Change end time
    const endTimeInput = screen.getByTestId('end-time-filter');
    fireEvent.change(endTimeInput, { target: { value: '18:00' } });
    expect(mockOnEndTimeChange).toHaveBeenCalledWith('18:00');
    
    // Change sport
    const sportSelect = screen.getByTestId('sport-filter');
    fireEvent.change(sportSelect, { target: { value: 'Cricket' } });
    expect(mockOnSportChange).toHaveBeenCalledWith('Cricket');
    
    // Change league
    const leagueSelect = screen.getByTestId('league-filter');
    fireEvent.change(leagueSelect, { target: { value: 'MLB' } });
    expect(mockOnLeagueChange).toHaveBeenCalledWith('MLB');
  });
  
  it('resets all filters when the reset button is clicked', () => {
    render(
      <MatchesFilter
        onDateChange={mockOnDateChange}
        onSportChange={mockOnSportChange}
        onLeagueChange={mockOnLeagueChange}
        onStartTimeChange={mockOnStartTimeChange}
        onEndTimeChange={mockOnEndTimeChange}
        date="2025-03-12"
        sport="Cricket"
        league="MLB"
        startTime="10:00"
        endTime="18:00"
        sports={mockSports}
        leagues={mockLeagues}
      />
    );
    
    // Click reset button
    const resetButton = screen.getByTestId('reset-filters');
    fireEvent.click(resetButton);
    
    // Check if all onChange handlers were called with empty strings
    expect(mockOnDateChange).toHaveBeenCalledWith('');
    expect(mockOnSportChange).toHaveBeenCalledWith('');
    expect(mockOnLeagueChange).toHaveBeenCalledWith('');
    expect(mockOnStartTimeChange).toHaveBeenCalledWith('');
    expect(mockOnEndTimeChange).toHaveBeenCalledWith('');
  });
}); 