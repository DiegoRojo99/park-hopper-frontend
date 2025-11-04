import { LiveAttraction } from "../../types/db";
import { BookmarkButton } from "../../components/BookmarkButton";

function sortByWaitTime(a: LiveAttraction, b: LiveAttraction) {
  const waitA = a.waitTime;
  const waitB = b.waitTime;
  if(!waitA) return 1; // Treat null as greater than any number
  if(!waitB) return -1; // Treat null as greater than any number
  return waitB - waitA;
}

function filterNonApplicableRide(attraction: LiveAttraction) {
  const status = attraction.status;
  return status && ["OPERATING", "DOWN", "CLOSED"].includes(status);
}

export default function ParkRidesTable({ attractions }: { attractions: LiveAttraction[] }) {
  if (attractions.length === 0) {
    return <div>No rides available.</div>;
  }

  return (
    <table className="w-full mb-4 text-xs sm:text-base table-fixed border-collapse">
      <thead className="border-b border-black">
        <tr className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-bold">
          <th className="px-2 w-[10%]">Open</th>
          <th className="text-left w-[60%] py-1">Ride Name</th>
          <th className="text-left w-[10%]">Wait</th>
          <th className="text-center w-[10%]"></th>
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
  const waitTime = attraction.waitTime || null;
  const rowClass = index % 2 === 0 ? "bg-white dark:bg-gray-800 py-1" : "bg-gray-100 dark:bg-gray-700 py-1";
  const statusClass =
    attraction.status === "OPERATING" ? "text-green-600" : 
    attraction.status === "DOWN" ? "text-yellow-600" : "text-red-600";

  return (
    <tr key={attraction.id} className={rowClass}>
      {attraction.status ? (
        <td className={`${statusClass} ${rowClass} flex items-center px-2 h-full`}>
          <span className="inline-flex items-center mx-auto my-auto">
            <svg className="w-4 h-4 my-[0.1rem] mr-1 bg-transparent" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 100-12 6 6 0 000 12z" />
            </svg>
          </span>          
        </td>
      ) : null}
      <td className="w-full pr-2">
        <strong className="block font-bold truncate">{attraction.name}</strong>
      </td>
      {waitTime ? (
        <td className="text-right pr-2">{waitTime}</td>
      ) : (
        <td className="text-right pr-2">N/A</td>
      )}
      <td className="text-center">
        <BookmarkButton entityId={attraction.id} entityType="ATTRACTION" size="sm" />
      </td>
    </tr>
  );
}