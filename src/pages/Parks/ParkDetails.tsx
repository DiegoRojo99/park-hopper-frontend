import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader } from "../../components/Loader";
import ParkRidesTable from "./ParkRides";
import RideGridSection from "./RideGridSection";
import { LivePark } from "../../types/db";
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

    fetch(`${apiUrl}/api/parks/${parkId}/live`)
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
    <div className="w-full max-w-6xl mx-auto p-4">
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
  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      {shows?.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {shows.map((show) => (
            <div key={show.id} className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
              <h3 className="text-lg font-bold text-center">{show.name}</h3>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">No shows available.</div>
      )}
    </div>
  );
};

function RestaurantsSection({ restaurants }: { restaurants: LivePark["restaurants"] }) {
  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      {restaurants?.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {restaurants.map((restaurant) => (
            <div key={restaurant.id} className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
              <h3 className="text-lg font-bold text-center">{restaurant.name}</h3>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">No restaurants available.</div>
      )}
    </div>
  );
};

export default ParkDetails;