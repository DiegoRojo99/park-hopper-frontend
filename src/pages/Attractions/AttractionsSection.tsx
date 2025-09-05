import { useMemo, useState } from "react";
import { LivePark } from "../../types/Park";
import SearchBar from "../../components/SearchBar";
import AttractionGrid from "./AttractionGrid";

export default function AttractionsSection({ attractions }: { attractions: LivePark["attractions"] }) {
  const [search, setSearch] = useState('');
  
  const filteredAttractions = useMemo(() => {
    if (!search || !attractions) return attractions || [];
    return attractions.filter(attraction => 
      attraction.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [attractions, search]);

  return (
    <div className="w-full sm:max-w-6xl mx-auto p-2 sm:p-4">
      <div className="mb-4">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search attractions..."
        />
      </div>
      {attractions?.length ? (
        <div>
          <AttractionGrid attractions={filteredAttractions} />
        </div>
      ) : (
        <div className="text-center text-gray-500">No attractions available.</div>
      )}
    </div>
  );
};