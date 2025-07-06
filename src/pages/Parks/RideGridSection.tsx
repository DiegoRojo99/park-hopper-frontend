import { LandWithRides, Ride } from "../../types/db";

function filterSingleRider(ride: Ride): boolean {
  return !ride.name.includes("Single Rider");
}

function sortByWaitTime(a: Ride, b: Ride): number {
  if (a.waitTime === null) return -1; // Treat closed rides as having lower wait time
  if (b.waitTime === null) return 1; // Treat closed rides as having lower wait time
  return b.waitTime - a.waitTime;
}

export default function RideGridSection({ lands }: { lands: LandWithRides[] }) {
  if (!lands || lands.length === 0) {
    return <div>No rides available.</div>;
  }

  const rides = lands.flatMap((land) =>
    land.rides.filter(filterSingleRider).map((ride) => ({
      ...ride,
      landName: land.name,
    }))
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {rides.sort(sortByWaitTime).map((ride) => (
        <RideCard key={ride.id} ride={ride} landName={ride.landName} />
      ))}
    </div>
  );
}

function RideCard({ ride, landName }: { ride: Ride, landName: string }) {
  const isOpen = ride.waitTime !== null;

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow flex justify-between items-center border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col flex-1">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{ride.name}</h3>
        <h5 className="text-md text-gray-600 dark:text-gray-400">{landName}</h5>
        <p className={`text-sm ${ride.isOpen ? "text-green-600" : "text-red-600"}`}>
          {ride.isOpen ? "Open" : "Closed"}
        </p>
      </div>
      <div className="text-right w-20">
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
      </div>
    </div>
  );
};
