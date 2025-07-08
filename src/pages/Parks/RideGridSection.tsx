import { Attraction, LivePark } from "../../types/db";

export default function RideGridSection({ attractions, liveData }: { attractions: Attraction[], liveData: LivePark["liveData"] }) {
  if (!attractions || attractions.length === 0) {
    return <div>No attractions available.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {attractions.map((attraction) => (
        <AttractionCard key={attraction.id} attraction={attraction} liveData={liveData} />
      ))}
    </div>
  );
}

function AttractionCard({ attraction, liveData }: { attraction: Attraction, liveData: LivePark["liveData"] }) {
  const ride = liveData?.find((ride) => ride.id === attraction.id);
  const waitTime = ride?.queue?.STANDBY?.waitTime || null;

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow flex justify-between items-center border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col flex-1">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{attraction.name}</h3>
        {ride ? (
          <p className={`text-sm ${ride.status === "OPERATING" ? "text-green-600" : "text-red-600"}`}>
            {ride.status}
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
