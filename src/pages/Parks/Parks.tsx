import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Loader } from '../../components/Loader';
import { ParkWithDetails } from '../../types/Park';
import ParkCard from './ParkCard';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import SearchBar from '../../components/SearchBar';

const Parks: React.FC = () => {
  const [parks, setParks] = useState<ParkWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [destinationFilter, setDestinationFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'destination'>('name');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const filtersRef = useRef<HTMLDivElement>(null);

  // Get unique destinations for filter
  const destinations = useMemo(() => {
    const dests = Array.from(new Set(parks.map(p => p.destination?.name).filter(Boolean)));
    return dests.sort((a, b) => a.localeCompare(b));
  }, [parks]);

  // Filter, search, sort parks
  const filteredParks = useMemo(() => {
    let filtered = parks;
    if (search) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    }
    if (destinationFilter !== 'all') {
      filtered = filtered.filter(p => p.destination?.name === destinationFilter);
    }
    if (sortBy === 'name') {
      filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'destination') {
      filtered = filtered.sort((a, b) => (a.destination?.name || '').localeCompare(b.destination?.name || ''));
    }
    return filtered;
  }, [parks, search, destinationFilter, sortBy]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filtersRef.current && !filtersRef.current.contains(event.target as Node)) {
        setIsFiltersOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchParks = async () => {
      const apiUrl = process.env.REACT_APP_API_URL!;
      if (!apiUrl) {
        setError('API URL is not defined');
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`${apiUrl}/api/parks`);
        if (!response.ok) {
          throw new Error('Failed to fetch parks');
        }
        const data = await response.json();
        setParks(data);
      } catch (err: any) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    fetchParks();
  }, []);

  if (loading) return <Loader />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex flex-col items-center w-full py-6 px-4 md:px-2">
      <div className='max-w-7xl text-left w-full mb-4'>
        <h1 className="text-2xl md:text-4xl font-bold  mb-2">
          Discover Theme Parks
        </h1>
        <p className="text-gray-400 dark:text-gray-200 text-sm md:text-lg">
          Explore theme parks worldwide with live wait times and real-time updates
        </p>
      </div>

      <div className="w-full max-w-7xl mb-6">
        <div className="relative flex items-center gap-2">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search parks..."
          />
          <div className="relative" ref={filtersRef}>
            <button
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className={`p-2 rounded-lg border border-gray-300 hover:bg-gray-50 
                ${isFiltersOpen ? 'bg-gray-50 ring-2 ring-blue-500' : ''}`}
            >
              <AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-600" />
            </button>

            {isFiltersOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                <div className="px-4 py-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Destination
                  </label>
                  <select
                    value={destinationFilter}
                    onChange={e => setDestinationFilter(e.target.value)}
                    className="block w-full border border-gray-300 rounded-md py-1.5 px-3"
                  >
                    <option value="all">All Destinations</option>
                    {destinations.map(dest => (
                      <option key={dest} value={dest}>{dest}</option>
                    ))}
                  </select>
                </div>
                <div className="border-t border-gray-100 my-2" />
                <div className="px-4 py-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sort by
                  </label>
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value as any)}
                    className="block w-full border border-gray-300 rounded-md py-1.5 px-3"
                  >
                    <option value="name">Name</option>
                    <option value="destination">Destination</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full max-w-7xl">
        {filteredParks.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">No parks found.</div>
        ) : (
          filteredParks.map((park) => (
            <ParkCard key={park.id} park={park} />
          ))
        )}
      </div>
    </div>
  );
};

export default Parks;