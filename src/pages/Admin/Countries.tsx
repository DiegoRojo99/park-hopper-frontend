import React, { useEffect, useState } from 'react';
import { Loader } from '../../components/Loader';

interface Country {
  id: string;
  name: string;
  code: string;
  flagUrl?: string | null;
}

interface Destination {
  id: string;
  name: string;
  countryId?: string | null;
  city?: string | null;
}

export default function Countries() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Form states
  const [newCountry, setNewCountry] = useState({
    name: '',
    code: '',
    flagUrl: ''
  });

  const [selectedDestination, setSelectedDestination] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<string>('');

  // Fetch countries and destinations
  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL!;
        
        // Fetch countries
        const countriesRes = await fetch(`${apiUrl}/api/admin/countries`);
        if (!countriesRes.ok) throw new Error('Failed to fetch countries');
        const countriesData = await countriesRes.json();
        setCountries(countriesData.sort((a: Country, b: Country) => a.name.localeCompare(b.name)));

        // Fetch destinations
        const destinationsRes = await fetch(`${apiUrl}/api/entities?type=DESTINATION`);
        if (!destinationsRes.ok) throw new Error('Failed to fetch destinations');

        // Get just destinations that need location update
        const destinationsData = await destinationsRes.json();
        const filteredDestinations = destinationsData.filter((dest: Destination) => !dest.countryId || !dest.city);
        console.log(`${filteredDestinations.length} out of ${destinationsData.length} destinations need location update`);
        setDestinations(filteredDestinations.sort((a: Destination, b: Destination) => a.name.localeCompare(b.name)));
      } 
      catch (err: any) {
        setError(err.message);
      } 
      finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreateCountry = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const apiUrl = process.env.REACT_APP_API_URL!;
      const response = await fetch(`${apiUrl}/api/admin/countries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCountry),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to create country');
      }

      const createdCountry = await response.json();
      setCountries(prev => [...prev, createdCountry]);
      setNewCountry({ name: '', code: '', flagUrl: '' });
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleUpdateDestinationLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDestination || !selectedCountry || !selectedCity) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const apiUrl = process.env.REACT_APP_API_URL!;
      const response = await fetch(
        `${apiUrl}/api/admin/destinations/${selectedDestination}/location`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            countryId: selectedCountry,
            city: selectedCity,
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update location');
      }

      // Update local state
      setDestinations(prev =>
        prev.map(dest =>
          dest.id === selectedDestination
            ? { ...dest, countryId: selectedCountry, city: selectedCity }
            : dest
        )
      );

      // Reset form
      setSelectedDestination('');
      setSelectedCity('');
      setSelectedCountry('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Countries Management</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Create Country Form */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Create New Country</h2>
          <form onSubmit={handleCreateCountry}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Name
                  <input
                    type="text"
                    value={newCountry.name}
                    onChange={(e) => setNewCountry(prev => ({ ...prev, name: e.target.value }))}
                    className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Code
                  <input
                    type="text"
                    value={newCountry.code}
                    onChange={(e) => setNewCountry(prev => ({ ...prev, code: e.target.value }))}
                    className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                    maxLength={2}
                    placeholder="e.g., US"
                  />
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Flag URL
                  <input
                    type="url"
                    value={newCountry.flagUrl}
                    onChange={(e) => setNewCountry(prev => ({ ...prev, flagUrl: e.target.value }))}
                    className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="https://example.com/flag.png"
                  />
                </label>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Create Country
              </button>
            </div>
          </form>
        </div>

        {/* Update Destination Location Form */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Update Destination Location</h2>
          <form onSubmit={handleUpdateDestinationLocation}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Destination
                  <select
                    value={selectedDestination}
                    onChange={(e) => setSelectedDestination(e.target.value)}
                    className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select a destination</option>
                    {destinations.map((dest) => (
                      <option key={dest.id} value={dest.id}>
                        {dest.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Country
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select a country</option>
                    {countries.map((country) => (
                      <option key={country.id} value={country.id}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  City
                  <input
                    type="text"
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                    placeholder="e.g., Orlando"
                  />
                </label>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Update Location
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Countries List */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Existing Countries</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {countries.map((country) => (
            <div key={country.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex items-center space-x-3">
              {country.flagUrl && (
                <img
                  src={country.flagUrl}
                  alt={`${country.name} flag`}
                  className="w-8 h-8 object-cover rounded-sm"
                />
              )}
              <div>
                <h3 className="font-medium">{country.name}</h3>
                <p className="text-sm text-gray-500">{country.code}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
