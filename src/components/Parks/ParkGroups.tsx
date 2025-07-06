import React, { useEffect, useState } from 'react';
import { ParkGroupWithParks } from '../../types/db';
import { Loader } from '../Loader';
import { Link } from 'react-router-dom';

const ParkGroups: React.FC = () => {
  const [parkGroups, setParkGroups] = useState<ParkGroupWithParks[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchParkGroups = async () => {
      const apiUrl = process.env.REACT_APP_API_URL!;
      if (!apiUrl) {
        setError('API URL is not defined');
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`${apiUrl}/api/parkGroups`);
        if (!response.ok) {
          throw new Error('Failed to fetch park groups');
        }
        const data = await response.json();
        setParkGroups(data);
      } catch (err: any) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchParkGroups();
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
      {parkGroups.length === 0 ? (
        <div>No parks found.</div>
      ) : (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
          {parkGroups.sort((a, b) => a.name.localeCompare(b.name)).map((group) => (
            <ParkGroup key={group.id} group={group} />
          ))}
        </div>
      )}
    </div>
  );
};

function ParkGroup({ group }: { group: ParkGroupWithParks }) {
  return (
    <div key={group.id} className="border p-4 rounded-lg shadow bg-white text-gray-800 w-full">
      <h2 className="text-xl font-bold mb-2 text-center">{group.name}</h2>
      <table className="w-full">
        <tbody>
          {group.parks.sort((a, b) => a.name.localeCompare(b.name)).map((park) => (
            <tr key={park.id} className="hover:bg-gray-100 transition-colors cursor-pointer border-t p-2">
              <td className="text-blue-600 hover:underline">
                <Link to={`/parks/${park.id}`} className="w-full">{park.name}</Link>
              </td>
              <td className="text-gray-600 text-sm">{park.country}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ParkGroups;