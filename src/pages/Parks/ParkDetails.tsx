import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader } from "../../components/Loader";
import ChildrenTab from "../../components/ChildrenTab";
import { LivePark } from "../../types/Park";
import AttractionsSection from "../Attractions/AttractionsSection";
import ShowsSection from "../Shows/ShowsSection";
import RestaurantsSection from "../Restaurants/RestaurantsSection";

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

export default ParkDetails;