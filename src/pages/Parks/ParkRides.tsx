import { Attraction, LivePark } from "../../types/db";

export default function ParkRidesTable({ attractions, liveData }: { attractions: Attraction[], liveData: LivePark["liveData"] }) {
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
        {attractions.sort((a, b) => a.name.localeCompare(b.name)).map((attraction) => (
          <AttractionRow key={attraction.id} attraction={attraction} liveData={liveData} />
        ))}
      </tbody>
    </table>
  );
};

function AttractionRow({ attraction, liveData }: { attraction: Attraction, liveData: LivePark["liveData"] }) {
  if (!attraction) return null;
  const ride = liveData?.find((ride) => ride.id === attraction.id);
  const waitTime = ride?.queue?.STANDBY?.waitTime || null;

  return (
    <tr key={attraction.id} className="hover:bg-gray-100 transition-colors cursor-pointer">
      <td>
        <strong className="font-bold">{attraction.name}</strong>
      </td>
      {ride ? (
        <td className={`${ride.status === "OPERATING" ? "text-green-600" : "text-red-600"}`}>
          {ride.status}
        </td>
      ) : null}
      {waitTime ? (
        <td>{waitTime}</td>
      ) : (
        <td>N/A</td>
      )}
    </tr>
  );
}