import { Attraction } from "../../types/db";

export default function RideGridSection({ attractions }: { attractions: Attraction[] }) {
  if (!attractions || attractions.length === 0) {
    return <div>No attractions available.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {attractions.map((attraction) => (
        <AttractionCard key={attraction.id} attraction={attraction} />
      ))}
    </div>
  );
}

function AttractionCard({ attraction }: { attraction: Attraction }) {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow flex justify-between items-center border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col flex-1">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{attraction.name}</h3>
        {/* <p className={`text-sm ${ride.isOpen ? "text-green-600" : "text-red-600"}`}>
          {ride.isOpen ? "Open" : "Closed"}
        </p> */}
      </div>
      {/* <div className="text-right w-20">
        {isOpen ? (
          <span
            className={`text-xl font-semibold ${
              ride.waitTime > 60 ? "text-red-500" : ride.waitTime > 30 ? "text-yellow-500" : "text-green-600"
            }`}
          >
            {ride.waitTime} min
          </span>
        ) : (
          <span className="text-sm text-gray-500 italic">Closed</span>
        )}
      </div> */}
    </div>
  );
};
