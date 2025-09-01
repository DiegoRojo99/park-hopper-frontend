import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader } from "../../components/Loader";
import ParkRidesTable from "./ParkRides";
import RideGridSection from "./RideGridSection";
import { LivePark, LiveRestaurant, LiveShow, ShowTimes } from "../../types/db";
import ChildrenTab from "../../components/ChildrenTab";

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
    <div className="flex flex-col items-center justify-center h-full w-full p-4">
      <ParkHeroSection park={park} />
      <ChildrenTab selectedTab={selectedTab} setTab={handleTabChange} />
      {renderTabContent()}
    </div>
  );
};


function ParkHeroSection({ park }: { park: LivePark }) {
  return (
    <section
      className={`relative w-full text-center h-32`}
    >
      <div className="relative z-10 p-6 flex flex-col justify-center h-full">
        <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 dark:text-white">
          {park.name}
        </h1>
        <p className="text-md sm:text-lg text-gray-600 dark:text-gray-300">
          {park.destination?.name || "No Destination"}
        </p>
      </div>
    </section>
  );
};

function AttractionsSection({ attractions }: { attractions: LivePark["attractions"] }) {
  const [gridView, setGridView] = useState(false);

  function GridViewToggle({
    gridView,
    setGridView,
  }: {
    gridView: boolean;
    setGridView: (value: boolean) => void;
  }) {
    return (
      <div className="flex justify-end w-full mb-4">
        <div className="inline-flex bg-gray-200 rounded-md overflow-hidden shadow">
          <button
            onClick={() => setGridView(true)}
            className={`flex items-center px-3 py-2 transition-colors ${
              gridView ? "bg-blue-500 text-white" : "text-gray-700"
            }`}
          >
            <img src='/icons/grid-2x2.svg' alt="Grid View" className="w-5 h-5 mr-1" />
            {/* <span className="hidden sm:inline">Grid</span> */}
          </button>
          <button
            onClick={() => setGridView(false)}
            className={`flex items-center px-3 py-2 transition-colors ${
              !gridView ? "bg-blue-500 text-white" : "text-gray-700"
            }`}
          >
            <img src='/icons/list.svg' alt="List View" className="w-5 h-5 mr-1" />
            {/* <span className="hidden sm:inline">List</span> */}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full sm:max-w-6xl mx-auto p-2 sm:p-4">
      <GridViewToggle gridView={gridView} setGridView={setGridView} />
      {attractions?.length ? (
        <div>
          {gridView ? (
            <RideGridSection attractions={attractions} />
          ) : (
            <ParkRidesTable attractions={attractions} />
          )}
        </div>
      ) : (
        <div className="text-center text-gray-500">No attractions available.</div>
      )}
    </div>
  );
};

function ShowsSection({ shows }: { shows: LivePark["shows"] }) {
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
        <h3 className="text-md font-bold text-center mb-2 min-h-12 flex">
          <span className="my-auto text-center mx-auto">{show.name}</span>
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
      {shows?.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {shows.sort(sortByStartTime).map((show) => (
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
      {restaurants?.length ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {restaurants.map((restaurant) => (
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