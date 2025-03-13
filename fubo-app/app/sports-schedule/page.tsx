'use client';

import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { MatchesTable } from '@/components/matches/MatchesTable';
import { MatchesGrid } from '@/components/matches/MatchesGrid';
import { MatchesFilter } from '@/components/matches/MatchesFilter';
import { ViewToggle, ViewType } from '@/components/matches/ViewToggle';
import { Match } from '@/types/match';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { 
  fetchMatches, 
  filterMatchesByDate, 
  filterMatchesBySport, 
  filterMatchesByLeague,
  getUniqueSports,
  getUniqueLeagues
} from '@/services/matchesService';

export default function SportsSchedule() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<ViewType>('grid'); // Default to grid view
  
  // Filter states
  const [date, setDate] = useState('');
  const [sport, setSport] = useState('');
  const [league, setLeague] = useState('');
  
  // Filter options
  const [sports, setSports] = useState<string[]>([]);
  const [leagues, setLeagues] = useState<string[]>([]);
  
  // Fetch matches data
  useEffect(() => {
    const getMatches = async () => {
      try {
        setLoading(true);
        const data = await fetchMatches();
        setMatches(data);
        setFilteredMatches(data);
        setSports(getUniqueSports(data));
        setLeagues(getUniqueLeagues(data));
        setError(null);
      } catch (err) {
        console.error('Failed to fetch matches:', err);
        setError('Failed to load matches. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    getMatches();
  }, []);
  
  // Apply filters when they change
  useEffect(() => {
    let result = matches;
    
    if (date) {
      result = filterMatchesByDate(result, date);
    }
    
    if (sport) {
      result = filterMatchesBySport(result, sport);
    }
    
    if (league) {
      result = filterMatchesByLeague(result, league);
    }
    
    setFilteredMatches(result);
  }, [matches, date, sport, league]);
  
  // Handle tag clicks from match cards
  const handleTagClick = (type: 'league' | 'network' | 'sport', value: string) => {
    switch (type) {
      case 'league':
        setLeague(value);
        break;
      case 'sport':
        setSport(value);
        break;
      // Network tag is not currently used for filtering in this implementation
      default:
        break;
    }
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb 
          items={[
            { label: 'Sports Schedule', href: '/sports-schedule', isCurrent: true }
          ]}
          data-testid="sports-breadcrumb"
        />
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <h1 className="text-3xl font-bold">Sports Schedule</h1>
          <ViewToggle view={view} onViewChange={setView} />
        </div>
        
        {loading ? (
          <div className="text-center p-8">
            <p className="text-gray-500">Loading matches...</p>
          </div>
        ) : error ? (
          <div className="text-center p-8 bg-red-50 rounded-lg">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <>
            <MatchesFilter
              onDateChange={setDate}
              onSportChange={setSport}
              onLeagueChange={setLeague}
              date={date}
              sport={sport}
              league={league}
              sports={sports}
              leagues={leagues}
            />
            
            {view === 'grid' ? (
              <MatchesGrid 
                matches={filteredMatches} 
                onTagClick={handleTagClick} 
              />
            ) : (
              <MatchesTable matches={filteredMatches} />
            )}
          </>
        )}
      </div>
    </Layout>
  );
} 