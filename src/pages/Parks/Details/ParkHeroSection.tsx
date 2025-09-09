import { formatScheduleType, getScheduleBadgeStyle, getScheduleInfo } from "../../../lib/schedule";
import { LivePark } from "../../../types/Park";
import { MapPinIcon, ClockIcon } from "@heroicons/react/24/outline";

export default function ParkHeroSection({ park }: { park: LivePark }) {
  const parkLiveData = park.live;
  const runningAttractions = parkLiveData?.attractions?.filter(attraction => attraction.status === 'OPERATING') || [];
  const averageWaitTime = runningAttractions.length > 0
    ? Math.round(runningAttractions.reduce((acc, curr) => acc + (curr.waitTime || 0), 0) / runningAttractions.length)
    : null;

  return (
    <section
      className={`relative w-full text-center md:h-96 bg-light-secondary dark:bg-dark-secondary overflow-hidden`}
    >
      {/* Park main image */}
      {park.mainImage && (
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${park.mainImage.url})` }}
        />
      )}

      {/* Overlay gradient for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70" />
      
      {/* Park information overlay */}
      <div className="relative z-10 p-6 flex flex-col justify-end h-full">
        {/* Row 1: Park name and status */}
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl sm:text-4xl font-bold text-white">
            {park.name}
          </h1>
        </div>

        {/* Row 2: Location and Hours */}
        <div className="flex flex-col gap-2 mb-3">
          <div className="flex items-center gap-1.5">
            <MapPinIcon className="h-4 w-4 text-gray-300" />
            <span className="text-gray-200">{park.destination?.name || "No Destination"}</span>
          </div>
          <div className="flex flex-col gap-1">
            {(() => {
              const schedule = getScheduleInfo(park);
              return (
                <>
                  <div className="flex items-center gap-1.5">
                    <ClockIcon className="h-4 w-4 text-gray-300" />
                    {schedule.regular ? (
                      <span className="text-gray-200">
                        {schedule.regular.open} - {schedule.regular.close}
                      </span>
                    ) : (
                      <span className="text-gray-400">Hours not available</span>
                    )}
                  </div>
                  {schedule.additional.map((hours, index) => {
                    const styles = getScheduleBadgeStyle(hours.type);
                    return (
                      <div key={index} className="flex items-center gap-1.5">
                        <span className={`text-xs px-1.5 py-0.5 ${styles.bg} ${styles.text} rounded`}>
                          {formatScheduleType(hours.type)}
                        </span>
                        <span className="text-xs text-gray-300">
                          {hours.open} - {hours.close}
                        </span>
                      </div>
                    );
                  })}
                </>
              );
            })()}
          </div>
        </div>

        {/* Row 3: Attractions count and average wait time */}
        <div className="flex items-center gap-4">
          {parkLiveData?.attractions && parkLiveData.attractions.length > 0 && (
            <>
              {/* Park status */}
              {park?.status && (
                <span className={`px-4 py-3 text-xs font-medium text-white rounded-full w-fit font-semibold
                  ${park.status === 'OPERATING' ? 'bg-green-500' : 'bg-red-500'}`}>
                  {park.status === 'OPERATING' ? 'OPEN' : 'CLOSED'}
                </span>
              )}
              {/* Average wait time */}
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <div className="flex items-baseline">
                  <span className="text-base font-bold text-white">
                    {averageWaitTime !== null ? averageWaitTime : 'N/A'}
                  </span>
                  <span className="ml-1 text-white">min</span>
                  <span className="ml-2 text-sm text-gray-200">Avg. Wait</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};