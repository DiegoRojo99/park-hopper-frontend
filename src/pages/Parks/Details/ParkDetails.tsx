import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader } from "../../../components/Loader";
import ChildrenTab from "../../../components/ChildrenTab";
import { LivePark } from "../../../types/Park";
import AttractionsSection from "../../Attractions/AttractionsSection";
import ShowsSection from "../../Shows/ShowsSection";
import RestaurantsSection from "../../Restaurants/RestaurantsSection";
import ParkHeroSection from "./ParkHeroSection";

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

export default ParkDetails;