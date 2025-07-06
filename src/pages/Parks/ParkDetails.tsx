import React from "react";
import { LandWithRides, ParkWithLandsAndRides } from "../../types/db";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader } from "../../components/Loader";
import ParkRidesTable from "./ParkRides";
import RideGridSection from "./RideGridSection";

type ParkDetailsProps = {
  park: ParkWithLandsAndRides;
  lands: LandWithRides[];
};

export const ParkDetailsContainer: React.FC = () => {
  const { parkId } = useParams<{ parkId: string }>();
  const [park, setPark] = useState<ParkWithLandsAndRides | null>(null);
  const [lands, setLands] = useState<LandWithRides[]>([]);
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

    fetch(`${apiUrl}/api/parks/${parkId}/live`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch park live data");
        return res.json();
      })
      .then((data) => setLands(data.lands))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [parkId]);

  if (loading) return <Loader />;
  if (error) return <div>Error: {error}</div>;
  if (!park) return <div>Park not found.</div>;

  return <ParkDetails park={park} lands={lands} />;
};

const ParkDetails: React.FC<ParkDetailsProps> = ({ park, lands }) => {
  const [gridView, setGridView] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-4">
      <ParkHeroSection park={park} />
      <GridViewToggle gridView={gridView} setGridView={setGridView} />
      { gridView ? (
        <RideGridSection lands={lands} />
      ) : (
        <div className="w-full mx-auto">
          <ParkRidesTable lands={lands} />
        </div>
      )}
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

function ParkHeroSection({ park }: { park: ParkWithLandsAndRides }) {
  const hasImage = Boolean(park.image_url);

  return (
    <section
      className={`relative w-full text-center ${
        hasImage ? "h-64" : "h-32"
      }`}
    >
      {hasImage && (
        <img
          src={park.image_url}
          alt={park.name}
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
      )}

      <div className="relative z-10 p-6 flex flex-col justify-center h-full">
        <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 dark:text-white">
          {park.name}
        </h1>
        <p className="text-md sm:text-lg text-gray-600 dark:text-gray-300">
          {park.country}
        </p>
      </div>
    </section>
  );
};

export default ParkDetails;