import { LiveAttraction } from "../../types/db";

export default function AttractionCard({ attraction }: { attraction: LiveAttraction }) {
  // Handle case where attraction might be undefined or null
  if (!attraction) return null;

  const waitTime = attraction.waitTime || null;
  const statusColors: { [key: string]: string } = {
    OPERATING: 'text-green-600',
    DOWN: 'text-yellow-600',
    CLOSED: 'text-red-600',
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow flex justify-between items-center border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col flex-1">
        <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white">{attraction.name}</h3>
        {attraction.status ? (
          <p className={`text-sm ${statusColors[attraction.status] || "text-gray-500"}`}>
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
          <span className="text-xl text-gray-500 italic">-</span>
        )}
      </div>
    </div>
  );
};
