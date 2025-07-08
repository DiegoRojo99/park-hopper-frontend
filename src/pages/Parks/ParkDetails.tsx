import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader } from "../../components/Loader";
import ParkRidesTable from "./ParkRides";
import RideGridSection from "./RideGridSection";
import { ParkWithDestinationAndChildren } from "../../types/db";

export const ParkDetailsContainer: React.FC = () => {
  const { parkId } = useParams<{ parkId: string }>();
  const [park, setPark] = useState<ParkWithDestinationAndChildren | null>(null);
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

const ParkDetails: React.FC<{park: ParkWithDestinationAndChildren}> = ({ park }) => {
  const [gridView, setGridView] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-4">
      <ParkHeroSection park={park} />
      <GridViewToggle gridView={gridView} setGridView={setGridView} />
      <AttractionsSection attractions={park.attractions} gridView={gridView} />
    </div>
  );
};

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

function ParkHeroSection({ park }: { park: ParkWithDestinationAndChildren }) {
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

function AttractionsSection({ attractions, gridView }: { attractions: ParkWithDestinationAndChildren["attractions"], gridView: boolean }) {
  if (!attractions || attractions.length === 0) {
    return <div className="text-center text-gray-500">No attractions available.</div>;
  }

  if (gridView) {
    return <RideGridSection attractions={attractions} />;
  }

  return (
    <div className="w-full mx-auto">
      <ParkRidesTable attractions={attractions} />
    </div>
  );
}

export default ParkDetails;