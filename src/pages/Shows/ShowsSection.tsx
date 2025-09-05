import { useMemo, useState } from "react";
import SearchBar from "../../components/SearchBar";
import { LivePark } from "../../types/Park";
import { LiveShow } from "../../types/db";
import ShowCard from "./ShowCard";

export default function ShowsSection({ shows }: { shows: LivePark["shows"] }) {
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


  return (
    <div className="w-full max-w-7xl mx-auto p-4">
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