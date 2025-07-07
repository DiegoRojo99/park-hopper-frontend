'use client';

import { useEffect, useState } from 'react';

type Park = {
  id: string;
  name: string;
};

export default function SyncParksPage() {
  const [parks, setParks] = useState<Park[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL;
    fetch(`${apiUrl}/api/parks`)
      .then(res => res.json())
      .then(data => setParks(data))
      .catch(err => {
        console.error('Failed to load parks:', err);
        setError(err.message || 'Failed to load parks');
      });
  }, []);

  const handleSync = async (id: string) => {
    setLoading(true);
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      const res = await fetch(`${apiUrl}/api/sync/parks?parkId=${id}`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Sync failed');
      alert('Sync triggered');
    } catch (err) {
      console.error(err);
      alert('Sync failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Parks</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {parks.map((park) => (
          <button
            key={park.id}
            onClick={() => handleSync(park.id)}
            className="aspect-square bg-blue-100 hover:bg-blue-200 rounded-xl shadow flex items-center justify-center text-center text-sm font-medium transition disabled:opacity-50"
            disabled={loading}
          >
            {park.name}
          </button>
        ))}
      </div>
    </div>
  );
}
