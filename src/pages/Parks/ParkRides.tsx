import React from "react";
import { Attraction } from "../../types/db";

export default function ParkRidesTable({ attractions }: { attractions: Attraction[] }) {
  if (attractions.length === 0) {
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
        {attractions.map((attraction) => (
          <AttractionRow key={attraction.id} attraction={attraction} />
        ))}
      </tbody>
    </table>
  );
};

function AttractionRow({ attraction }: { attraction: Attraction }) {
  if (!attraction) return null;
  return (
    <tr key={attraction.id} className="hover:bg-gray-100 transition-colors cursor-pointer">
      <td>
        <strong className="font-bold">{attraction.name}</strong>
      </td>
      {/* <td className={`${ride.isOpen ? "text-green-600" : "text-red-600"}`}>
        {ride.isOpen ? "Open" : "Closed"}
      </td>
      <td>{ride.isOpen ? ride.waitTime : "N/A"}</td> */}
    </tr>
  );
}