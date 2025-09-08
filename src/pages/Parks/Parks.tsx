import React, { useEffect, useState, useMemo } from 'react';
import { Loader } from '../../components/Loader';
import { ParkWithDetails } from '../../types/Park';
import ParkCard from './ParkCard';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import SearchBar from '../../components/SearchBar';
import ParkFilterModal from './ParkFilterModal';

const Parks: React.FC = () => {
  const [parks, setParks] = useState<ParkWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [destinationFilter, setDestinationFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'destination'>('name');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState({
    destinationFilter: 'all',
    sortBy: 'name' as 'name' | 'destination'
  });
  
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
    } 
    else if (sortBy === 'destination') {
      filtered = filtered.sort((a, b) => (a.destination?.name || '').localeCompare(b.destination?.name || ''));
    }
    return filtered;
  }, [parks, search, destinationFilter, sortBy]);

  // Initialize temp filters when modal opens
  useEffect(() => {
    if (isModalOpen) {
      setTempFilters({
        destinationFilter,
        sortBy
      });
    }
  }, [isModalOpen, destinationFilter, sortBy]);

  const handleApplyFilters = () => {
    setDestinationFilter(tempFilters.destinationFilter);
    setSortBy(tempFilters.sortBy);
    setIsModalOpen(false);
  };

  const handleResetFilters = () => {
    const defaultFilters = {
      destinationFilter: 'all',
      sortBy: 'name' as const
    };
    setTempFilters(defaultFilters);
    setDestinationFilter(defaultFilters.destinationFilter);
    setSortBy(defaultFilters.sortBy);
    setIsModalOpen(false);
  };

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
          <button
            onClick={() => setIsModalOpen(true)}
            className={`p-2 rounded-lg border border-gray-300 hover:bg-gray-50 
              ${isModalOpen ? 'bg-gray-50 ring-2 ring-blue-500' : ''}`}
          >
            <AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-600" />
          </button>

          <ParkFilterModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onApply={handleApplyFilters}
            onReset={handleResetFilters}
            destinations={destinations}
            destinationFilter={tempFilters.destinationFilter}
            setDestinationFilter={(value) => setTempFilters(prev => ({ ...prev, destinationFilter: value }))}
            sortBy={tempFilters.sortBy}
            setSortBy={(value) => setTempFilters(prev => ({ ...prev, sortBy: value }))}
          />
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