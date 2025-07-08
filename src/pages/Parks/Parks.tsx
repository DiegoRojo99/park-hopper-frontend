import React, { useEffect, useState } from 'react';
import { Loader } from '../../components/Loader';
import { Link } from 'react-router-dom';
import { ParkWithDestination } from '../../types/db';

const Parks: React.FC = () => {
  const [parks, setParks] = useState<ParkWithDestination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
          throw new Error('Failed to fetch park groups');
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

  const sortedParks = parks.sort((a, b) => a.name.localeCompare(b.name));

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

      <h1 className="text-3xl md:text-4xl font-bold text-light-text dark:text-dark-text my-4">
        Parks
      </h1>

      {parks.length === 0 ? (
        <div>No parks found.</div>
      ) : (
        <div className="w-[90vw] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 p-4 mb-4 bg-white dark:bg-dark-bg rounded-lg">
          {sortedParks.map((park, index) => (
            <ParkGridItem
              key={park.id}
              park={park}
            />
          ))}
        </div>
      )}
    </div>
  );
};

function ParkGridItem({
  park,
}: {
  park: ParkWithDestination;
}) {

  return (
    <Link
      to={`/parks/${park.id}`}
      className={`
        p-4 flex flex-col items-center justify-center h-full
        cursor-pointer duration-200 
        border border-gray-300 dark:border-gray-700
        hover:border hover:border-blue-500 hover:bg-blue-50
      `}
    >
      <p className="text-sm sm:text-base md:text-lg text-center font-semibold text-gray-800 dark:text-gray-200 mb-2">
        {park.name}
      </p>
      {park.destination && (
        <p className="text-gray-400 dark:text-gray-300 text-sm mt-0">
          {park.destination.name}
        </p>
      )}
    </Link>
  );
}

export default Parks;