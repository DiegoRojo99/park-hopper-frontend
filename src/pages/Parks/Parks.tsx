import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader } from '../../components/Loader';
import { ParkWithDestination } from '../../types/db';

const Parks: React.FC = () => {
  const [parks, setParks] = useState<ParkWithDestination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

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

  // Group parks by destination.name
  const grouped = parks.reduce<Record<string, ParkWithDestination[]>>((acc, park) => {
    const destName = park.destination?.name || 'Unknown';
    if (!acc[destName]) acc[destName] = [];
    acc[destName].push(park);
    return acc;
  }, {});

  const sortedDestinations = Object.entries(grouped).sort(([a], [b]) =>
    a.localeCompare(b)
  );

  return (
    <div className="flex flex-col items-center justify-center h-full w-full my-auto">
      <div
        className="w-full text-center bg-cover bg-center h-64 md:h-80 mb-4"
        style={{
          backgroundImage: "url('/images/theme-park-1.jpeg')",
          minHeight: '240px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      ></div>

      <h1 className="text-3xl md:text-4xl font-bold text-light-text dark:text-dark-text my-4 pb-2">
        Parks by Destination
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-3 w-full max-w-7xl px-4">
        {sortedDestinations.map(([destinationName, parks]) => (
          <div
            key={destinationName}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow p-2 flex flex-col"
          >
            <div className="flex flex-row items-center gap-4 mb-2">
              <img
                src={'/icons/ferris-wheel.svg'}
                alt={destinationName}
                className="w-8 h-auto"
              />
              <div className="flex flex-col flex-1 min-w-0">
                <h2 className="text-md md:text-lg font-semibold text-gray-800 dark:text-gray-100 truncate">
                  {destinationName}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {parks.length} park{parks.length > 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <hr className="mb-4 border-gray-300 dark:border-gray-600" />

            <div className="flex flex-col gap-2">
              {parks
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((park) => (
                  <div
                    key={park.id}
                    onClick={() => navigate(`/parks/${park.id}`)}
                    className="cursor-pointer border border-gray-300 dark:border-gray-600 rounded-md p-3 text-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-800 transition"
                  >
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {park.name}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Parks;