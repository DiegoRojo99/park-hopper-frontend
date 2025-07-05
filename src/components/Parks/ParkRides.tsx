import React from "react";
import { LandWithRides, Ride } from "../../types/db";

function filterSingleRider(ride: Ride): boolean {
  return !ride.name.includes("Single Rider");
}

function sortByWaitTime(a: Ride, b: Ride): number {
  if (a.waitTime === null) return -1; // Treat closed rides as having lower wait time
  if (b.waitTime === null) return 1; // Treat closed rides as having lower wait time
  return b.waitTime - a.waitTime;
}

export default function ParkRidesTable({ lands }: { lands: LandWithRides[] }) {
  if (lands.length === 0) {
    return <div>No rides available.</div>;
  }

  return (
    <table className="w-full mb-4 text-xs sm:text-base">
      <thead className="border-b border-black">
        <tr>
          <th className="text-left">Ride Name</th>
          <th className="text-left">Status</th>
          <th className="text-left">Wait</th>
        </tr>
      </thead>
      <tbody>
        {lands.map((land) => (
          <React.Fragment key={land.id}>
            <tr className="bg-gray-200">
              <td colSpan={3} className="font-bold">
                {land.name}
              </td>
            </tr>
            {land.rides.filter(filterSingleRider).sort(sortByWaitTime).map((ride) => (
              <RideRow key={ride.id} ride={ride} />
            ))}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
};

function RideRow({ ride }: { ride: Ride }) {
  if (!ride) return null;
  return (
    <tr key={ride.id} className="hover:bg-gray-100 transition-colors cursor-pointer">
      <td>
        <strong className="font-bold">{ride.name}</strong>
      </td>
      <td className={`${ride.isOpen ? "text-green-600" : "text-red-600"}`}>
        {ride.isOpen ? "Open" : "Closed"}
      </td>
      <td>{ride.isOpen ? ride.waitTime : "N/A"}</td>
    </tr>
  );
}