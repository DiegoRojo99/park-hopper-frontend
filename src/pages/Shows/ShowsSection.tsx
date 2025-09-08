import { useMemo, useState } from "react";
import SearchBar from "../../components/SearchBar";
import { LiveShow } from "../../types/db";
import ShowCard from "./ShowCard";

export default function ShowsSection({ shows }: { shows: LiveShow[] | undefined }) {
  const [search, setSearch] = useState('');

  const filteredShows = useMemo(() => {
    if (!search || !shows) return shows;
    return shows.filter(show => 
      show.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [shows, search]);

  function sortByStartTime(a: LiveShow, b: LiveShow) {
    if (!a?.showtimes?.length) {
      return 1; // If no showtimes, push to end
    }
    if (!b?.showtimes?.length) {
      return -1; // If no showtimes, push to end
    }
    const aStart = new Date(a?.showtimes?.[0]?.startTime || "").getTime();
    const bStart = new Date(b?.showtimes?.[0]?.startTime || "").getTime();
    return aStart - bStart;
  }

  if (!shows || shows.length === 0) {
    return <div className="w-full max-w-7xl mx-auto p-4 text-center text-gray-500">No shows available.</div>;
  }
  
  if (!filteredShows || filteredShows.length === 0) {
    return (
      <div className="w-full sm:max-w-7xl mx-auto p-2 sm:p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Shows</h2>
          <p className="text-gray-500">0 shows</p>
        </div>
        <div className="mb-4">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search shows..."
          />
        </div>
        <div className="text-center text-gray-500">No shows found.</div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Shows</h2>
        <p className="text-gray-500">{filteredShows.length} shows</p>
      </div>
      <div className="mb-4">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search shows..."
        />
      </div>
      {shows?.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {(filteredShows || []).sort(sortByStartTime).map((show) => (
            <ShowCard key={show.id} show={show} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">No shows available.</div>
      )}
    </div>
  );
};