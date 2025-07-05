import React from "react";
import { LandWithRides, ParkWithLandsAndRides } from "../../types/db";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader } from "../Loader";

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

  console.log("Park details:", park);
  return <ParkDetails park={park} lands={lands} />;
};

const ParkDetails: React.FC<ParkDetailsProps> = ({ park, lands }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-4">
      <h1 className="text-xl sm:text-3xl font-bold my-4">{park.name}</h1>
      <table className="w-full mb-4 text-xs sm:text-base ">
        <thead className="border-b border-black">
          <tr>
            <th className="text-left">Ride Name</th>
            <th className="text-left">Status</th>
            <th className="text-left">Wait</th>
          </tr>
        </thead>
        <tbody>
          {lands.length === 0 ? (
            <tr>
              <td colSpan={4}>No lands available.</td>
            </tr>
          ) : (
            lands.map((land) => {
              if (land.rides.length === 0) return <></>;
              return land.rides.length === 0 ? (
                <tr>
                  <td colSpan={4}>No rides in this land.</td>
                </tr>
              ) : (
                land.rides.map((ride: any) => (
                  <tr key={ride.id} className="hover:bg-gray-100 transition-colors cursor-pointer">
                    <td>
                      <strong className="font-bold">{ride.name}</strong>
                    </td>
                    <td>{ride.is_open ? "Open" : "Closed"}</td>
                    <td>{ride.is_open ? ride.wait_time : "N/A"}</td>
                  </tr>
                ))
              )
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ParkDetails;