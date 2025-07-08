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

  return (
    <div className="flex flex-col items-center justify-center h-full w-full my-auto">
      <div
        className="w-screen text-center bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/theme-park-1.jpeg')",
          minHeight: '240px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
      </div>
      {parks.length === 0 ? (
        <div>No parks found.</div>
      ) : (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
          {parks.sort((a, b) => a.name.localeCompare(b.name)).map((park) => (
            <ParkRow key={park.id} park={park} />
          ))}
        </div>
      )}
    </div>
  );
};

function ParkRow({ park }: { park: ParkWithDestination }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center">
      <Link to={`/parks/${park.id}`} className="text-xl font-semibold text-blue-600 hover:underline">
        {park.name}
      </Link>
      {park.destination && (
        <p className="text-gray-600 mt-2">
          Destination: {park.destination.name}
        </p>
      )}
    </div>
  );
}

export default Parks;