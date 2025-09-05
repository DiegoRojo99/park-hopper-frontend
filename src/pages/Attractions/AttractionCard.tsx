import { LiveAttraction } from "../../types/db";

export default function AttractionCard({ attraction }: { attraction: LiveAttraction }) {
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
