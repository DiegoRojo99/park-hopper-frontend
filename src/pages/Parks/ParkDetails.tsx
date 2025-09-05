import React from "react";
import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Loader } from "../../components/Loader";
import { LiveRestaurant, LiveShow, ShowTimes } from "../../types/db";
import ChildrenTab from "../../components/ChildrenTab";
import { LivePark } from "../../types/Park";
import SearchBar from "../../components/SearchBar";
import AttractionsSection from "../Attractions/AttractionsSection";

export const ParkDetailsContainer: React.FC = () => {
  const { parkId } = useParams<{ parkId: string }>();
  const [park, setPark] = useState<LivePark | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL!;
    if (!apiUrl) {
      setError("API URL is not defined");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);

    if (!parkId) {
      setError("Park ID is not provided");
      setLoading(false);
      return;
    }

    fetch(`${apiUrl}/api/parks/${parkId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch park details");
        return res.json();
      })
      .then((data) => setPark(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));

  }, [parkId]);

  if (loading) return <Loader />;
  if (error) return <div>Error: {error}</div>;
  if (!park) return <div>Park not found.</div>;

  return <ParkDetails park={park} />;
};

const ParkDetails: React.FC<{park: LivePark}> = ({ park }) => {
  const [selectedTab, setSelectedTab] = useState<"Attractions" | "Shows" | "Restaurants">("Attractions");
  const handleTabChange = (tab: "Attractions" | "Shows" | "Restaurants") => {
    setSelectedTab(tab);
  };

  function renderTabContent() {
    switch (selectedTab) {
      case "Attractions":
        return <AttractionsSection attractions={park.attractions} />;
      case "Shows":
        return <ShowsSection shows={park.shows} />;
      case "Restaurants":
        return <RestaurantsSection restaurants={park.restaurants} />;
      default:
        return null;
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <ParkHeroSection park={park} />
      <ChildrenTab selectedTab={selectedTab} setTab={handleTabChange} />
      {renderTabContent()}
    </div>
  );
};


function ParkHeroSection({ park }: { park: LivePark }) {
  return (
    <section
      className={`relative w-full text-center h-48 md:h-96 bg-light-secondary dark:bg-dark-secondary overflow-hidden`}
    >
      {park.mainImage && (
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${park.mainImage.url})` }}
        />
      )}
      {/* Overlay gradient for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70" />
      <div className="relative z-10 p-6 flex flex-col justify-center h-full">
        <h1 className="text-2xl sm:text-4xl font-bold text-white">
          {park.name}
        </h1>
        <p className="text-md sm:text-lg text-gray-200">
          {park.destination?.name || "No Destination"}
        </p>
      </div>
    </section>
  );
};

function ShowsSection({ shows }: { shows: LivePark["shows"] }) {
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

  function formatShowTime(time: string) {
    const date = new Date(time);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function ShowElement({ show }: { show: LiveShow }) {

    function displayShowTime(showtime: ShowTimes) {
      if (!showtime || !showtime.startTime || !showtime.endTime) {
        return <span className="text-gray-500">No showtime available</span>;
      }
      if (showtime.startTime === showtime.endTime) {
        return (
          <>
            {formatShowTime(showtime.startTime)}
          </>
        );
      }
      return (
        <>
         {formatShowTime(showtime.startTime)} - {formatShowTime(showtime.endTime)}
        </>
      )
    }

    return (
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
        <h3 className="text-md font-bold mb-2 min-h-12">
          {show.name}
        </h3>
        <hr />
        {show.showtimes?.length ? (
          <div className="mt-2 w-full flex flex-row flex-wrap justify-center mx-auto">
            {show.showtimes.map((time, index) => (
              <div key={index} className="w-fit text-sm text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-[4px] px-1 py-1 m-1">
                {displayShowTime(time)}
              </div>
            ))}
          </div>
         ) : (
          <div className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">
            No showtimes available.
          </div>
        )}
      </div>
    );
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
            <ShowElement key={show.id} show={show} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">No shows available.</div>
      )}
    </div>
  );
};

function RestaurantsSection({ restaurants }: { restaurants: LivePark["restaurants"] }) {
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

  function RestaurantElement({ restaurant }: { restaurant: LiveRestaurant }) {
    return (
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
        <h3 className="text-md font-bold text-center mb-2 min-h-12 flex">
          <span className="my-auto text-center mx-auto">{restaurant.name}</span>
        </h3>
        <hr />
        {restaurant.cuisines?.length ? (
          <>
            <div className="mt-2 text-center flex flex-row flex-wrap justify-center w-full">
              {restaurant.cuisines?.map((cuisine, index) => (
                <span key={index} className="text-sm w-full text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-[4px] px-2 py-1 m-1">
                  {cuisine}
                </span>
              ))}
            </div>
          </>
        ) : (
          <div className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">
            No cuisines available.
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
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
            <RestaurantElement key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">No restaurants available.</div>
      )}
    </div>
  );
};

export default ParkDetails;