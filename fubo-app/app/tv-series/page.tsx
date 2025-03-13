'use client';

import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { MediaFilter } from '../../components/media/MediaFilter';
import { MediaGrid } from '../../components/media/MediaGrid';
import { Series } from '@/types/series';
import { 
  fetchSeries, 
  searchSeriesByTitle, 
  filterSeriesByGenre, 
  sortSeriesByStartYear, 
  sortSeriesByRating, 
  getUniqueGenres 
} from '@/services/seriesService';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert';
import { Skeleton } from '../../components/ui/skeleton';

export default function TVSeriesPage() {
  const [series, setSeries] = useState<Series[]>([]);
  const [filteredSeries, setFilteredSeries] = useState<Series[]>([]);
  const [genres, setGenres] = useState<string[]>(['All']);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [sortOption, setSortOption] = useState('rating-desc');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Define sort options
  const sortOptions = [
    { value: 'rating-desc', label: 'Rating (High to Low)' },
    { value: 'rating-asc', label: 'Rating (Low to High)' },
    { value: 'year-desc', label: 'Year (Newest First)' },
    { value: 'year-asc', label: 'Year (Oldest First)' },
  ];

  // Fetch series on component mount
  useEffect(() => {
    const getSeries = async () => {
      try {
        setIsLoading(true);
        const fetchedSeries = await fetchSeries();
        setSeries(fetchedSeries);
        setFilteredSeries(fetchedSeries);
        setGenres(getUniqueGenres(fetchedSeries));
        
        // Apply initial sort
        const sortedSeries = sortSeriesByRating(fetchedSeries, false);
        setFilteredSeries(sortedSeries);
      } catch (err) {
        setError('Failed to load TV series. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    getSeries();
  }, []);

  // Apply filters and sorting when any filter changes
  useEffect(() => {
    if (series.length === 0) return;

    let result = [...series];

    // Apply search filter
    if (searchTerm) {
      result = searchSeriesByTitle(result, searchTerm);
    }

    // Apply genre filter
    if (selectedGenre !== 'All') {
      result = filterSeriesByGenre(result, selectedGenre);
    }

    // Apply sorting
    const [sortBy, sortDirection] = sortOption.split('-');
    const ascending = sortDirection === 'asc';

    if (sortBy === 'rating') {
      result = sortSeriesByRating(result, ascending);
    } else if (sortBy === 'year') {
      result = sortSeriesByStartYear(result, ascending);
    }

    setFilteredSeries(result);
  }, [series, searchTerm, selectedGenre, sortOption]);

  // Reset all filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedGenre('All');
    setSortOption('rating-desc');
  };

  return (
    <Layout>
      <div className="container mx-auto py-6 px-4">
        <h1 className="text-3xl font-bold mb-6">TV Series</h1>

        <MediaFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          genres={genres}
          selectedGenre={selectedGenre}
          onGenreChange={setSelectedGenre}
          sortOptions={sortOptions}
          selectedSort={sortOption}
          onSortChange={setSortOption}
          mediaType="series"
          onReset={handleResetFilters}
        />

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="space-y-3">
                <Skeleton className="h-[320px] w-full rounded-md" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            ))}
          </div>
        ) : error ? (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <>
            <div className="mb-4 text-sm text-muted-foreground">
              Showing {filteredSeries.length} of {series.length} TV series
            </div>
            <MediaGrid items={filteredSeries} mediaType="series" />
          </>
        )}
      </div>
    </Layout>
  );
} 