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
    <div className="w-full max-w-7xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Attractions</h2>
        <p className="text-gray-500">{filteredAttractions.length} attractions</p>
      </div>
      <div className="mb-4">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search attractions..."
        />
      </div>
      <AttractionGrid attractions={filteredAttractions} />
    </div>
  );
};