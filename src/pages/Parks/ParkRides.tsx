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
          <th className="px-2">Status</th>
          <th className="text-left">Ride Name</th>
          <th className="text-left">Wait</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {attractions.filter(filterNonApplicableRide).sort(sortByWaitTime).map((attraction, index) => (
          <AttractionRow key={attraction.id} attraction={attraction} index={index} />
        ))}
      </tbody>
    </table>
  );
};

function AttractionRow({ attraction, index }: { attraction: LiveAttraction, index: number }) {
  if (!attraction) return null;
  const liveData = attraction.liveData;
  const waitTime = liveData?.queue?.STANDBY?.waitTime || null;
  const statusClass =
    liveData?.status === "OPERATING" ? "text-green-600" : 
    liveData?.status === "DOWN" ? "text-yellow-600" : "text-red-600";

  return (
    <tr key={attraction.id} className={`hover:bg-gray-100 transition-colors cursor-pointer ${index % 2 === 0 ? "bg-white" : "bg-gray-100"}`}>
      {liveData ? (
        <td className={`${statusClass} flex items-center px-2`}>
          <span className="inline-flex items-center mx-auto">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 100-12 6 6 0 000 12z" />
            </svg>
          </span>          
        </td>
      ) : null}
      <td>
        <strong className="font-bold">{attraction.name}</strong>
      </td>
      {waitTime ? (
        <td>{waitTime}</td>
      ) : (
        <td>N/A</td>
      )}
    </tr>
  );
}