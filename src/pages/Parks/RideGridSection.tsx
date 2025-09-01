import { LiveAttraction } from "../../types/db";

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

export default function RideGridSection({ attractions }: { attractions: LiveAttraction[] }) {
  if (!attractions || attractions.length === 0) {
    return <div>No attractions available.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {attractions.filter(filterNonApplicableRide).sort(sortByWaitTime).map((attraction) => (
        <AttractionCard key={attraction.id} attraction={attraction} />
      ))}
    </div>
  );
}

function AttractionCard({ attraction }: { attraction: LiveAttraction }) {
  if (!attraction) return null;
  const waitTime = attraction.waitTime || null;

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow flex justify-between items-center border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col flex-1">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{attraction.name}</h3>
        {attraction.status ? (
          <p className={`text-sm ${attraction.status === "OPERATING" ? "text-green-600" : "text-red-600"}`}>
            {attraction.status}
          </p>
        ) : (
          <p className="text-sm text-gray-500">Unknown</p>
        )}
      </div>
      <div className="text-right w-20">
        {waitTime ? (
          <span
            className={`text-xl font-semibold ${
              waitTime > 60 ? "text-red-500" : waitTime > 30 ? "text-yellow-500" : "text-green-600"
            }`}
          >
            {waitTime} min
          </span>
        ) : (
          <span className="text-sm text-gray-500 italic">Closed</span>
        )}
      </div>
    </div>
  );
};
