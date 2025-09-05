import { useState } from "react";
import SearchBar from "../../components/SearchBar";
import { LivePark } from "../../types/Park";
import { useMemo } from "react";
import RestaurantCard from "./RestaurantCard";

export default function RestaurantsSection({ restaurants }: { restaurants: LivePark["restaurants"] }) {
  const [search, setSearch] = useState('');
  
  const filteredRestaurants = useMemo(() => {
    if (!search || !restaurants) return restaurants || [];
    return restaurants.filter(restaurant => 
      restaurant.name.toLowerCase().includes(search.toLowerCase()) ||
      restaurant.cuisines?.some((cuisine: string) => 
        cuisine.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [restaurants, search]);

  if (!restaurants || restaurants.length === 0) {
    return <div className="w-full max-w-7xl mx-auto p-4 text-center text-gray-500">No restaurants available.</div>;
  }

  return (
    <div className="w-full sm:max-w-7xl mx-auto p-2 sm:p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Restaurants</h2>
        <p className="text-gray-500">{filteredRestaurants.length} restaurants</p>
      </div>
      <div className="mb-4">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search restaurants or cuisines..."
        />
      </div>
      {restaurants?.length ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {filteredRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">No restaurants available.</div>
      )}
    </div>
  );
};