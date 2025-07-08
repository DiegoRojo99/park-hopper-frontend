import { LiveAttraction } from "../../types/db";

function sortByWaitTime(a: LiveAttraction, b: LiveAttraction) {
  const waitA = a.liveData?.queue?.STANDBY?.waitTime;
  const waitB = b.liveData?.queue?.STANDBY?.waitTime;
  if(!waitA) return 1; // Treat null as greater than any number
  if(!waitB) return -1; // Treat null as greater than any number
  return waitB - waitA;
}

function filterNonApplicableRide(attraction: LiveAttraction) {
  const status = attraction.liveData?.status;
  return status && ["OPERATING", "DOWN", "CLOSED"].includes(status);
}

export default function ParkRidesTable({ attractions }: { attractions: LiveAttraction[] }) {
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
        {attractions.filter(filterNonApplicableRide).sort(sortByWaitTime).map((attraction) => (
          <AttractionRow key={attraction.id} attraction={attraction} />
        ))}
      </tbody>
    </table>
  );
};

function AttractionRow({ attraction }: { attraction: LiveAttraction }) {
  if (!attraction) return null;
  const liveData = attraction.liveData;
  const waitTime = liveData?.queue?.STANDBY?.waitTime || null;

  return (
    <tr key={attraction.id} className="hover:bg-gray-100 transition-colors cursor-pointer">
      <td>
        <strong className="font-bold">{attraction.name}</strong>
      </td>
      {liveData ? (
        <td className={`${liveData.status === "OPERATING" ? "text-green-600" : "text-red-600"}`}>
          {liveData.status}
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