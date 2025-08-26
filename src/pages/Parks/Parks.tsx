import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader } from '../../components/Loader';
import { ParkWithDetails } from '../../types/Park';

const Parks: React.FC = () => {
  const [parks, setParks] = useState<ParkWithDetails[]>([]);
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
        Parks
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl px-4">
        {parks.sort((a, b) => a.name.localeCompare(b.name)).map((park) => {
          const logo = park.logoImage?.url;
          const main = park.mainImage?.url;
          return (
            <div
              key={park.id}
              onClick={() => navigate(`/parks/${park.id}`)}
              className="cursor-pointer bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden flex flex-col hover:scale-[1.03] transition-transform"
            >
              <div className="relative w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                {main ? (
                  <img src={main} alt={park.name + ' main'} className="object-cover w-full h-full" />
                ) : logo ? (
                  <img src={logo} alt={park.name + ' logo'} className="object-contain w-32 h-32 mx-auto" />
                ) : (
                  <span className="text-gray-400">No image</span>
                )}
              </div>
              <div className="p-4 flex flex-col items-center">
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">{park.name}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{park.destination?.name}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Parks;