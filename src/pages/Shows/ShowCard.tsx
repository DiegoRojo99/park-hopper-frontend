import { LiveShow } from "../../types/db";
import { ClockIcon } from "@heroicons/react/24/outline";
import { BookmarkButton } from "../../components/BookmarkButton";
import VisitButton from "../../components/VisitButton";
// import AlertButton from "../../components/AlertButton";
import { Link } from "react-router-dom";
import formatTime from "../../lib/time";

function getNextShowtime(show: LiveShow) {
  if (!show.showtimes || show.showtimes.length === 0) return null;
  
  // Get current time in UTC
  const now = new Date();
  
  // Find the next showtime
  for (const time of show.showtimes) {
    const showtimeDate = new Date(time.startTime);
    if (showtimeDate > now) {
      return {
        time: formatTime(time.startTime, show.timezone),
        startTime: time.startTime
      };
    }
  }
  return null;
}

function getTimeUntilNext(startTime: string) {
  const now = new Date();
  const showTime = new Date(startTime);
  const diffMs = showTime.getTime() - now.getTime();
  
  if (diffMs <= 0) return null;
  
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;
  
  if (hours > 0) {
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }
  return `${minutes}m`;
}

export default function ShowCard({ show }: { show: LiveShow }) {
  const calculateDuration = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const durationMinutes = Math.round((end.getTime() - start.getTime()) / (1000 * 60));
    return durationMinutes;
  };

  const formatDuration = (duration: number | undefined) => {
    if (!duration) return null;
    if (duration < 60) return `${duration} min`;
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  };

  const firstShowtime = show.showtimes?.[0];
  const duration = firstShowtime ? calculateDuration(firstShowtime.startTime, firstShowtime.endTime) : undefined;
  const nextShow = getNextShowtime(show);
  const timeUntilNext = nextShow ? getTimeUntilNext(nextShow.startTime) : null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-gray-200 dark:border-gray-600 overflow-hidden group flex flex-col h-full relative">
      {/* Header with name */}
      <Link to={`/shows/${show.id}`} className="block">
        <div className="p-6 pb-4 flex-1 cursor-pointer">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {show.name}
            </h3>
            {!!duration && (
              <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-2">
                <ClockIcon className="h-4 w-4 shrink-0 mr-1.5" />
                <span>{formatDuration(duration)}</span>
              </div>
            )}
          </div>

          {/* Next showtime display - prominent center section */}
          <div className="flex justify-center mb-6">
            {nextShow ? (
              <div className="px-8 py-6 rounded-3xl border-2 w-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700">
                <div className="text-center">
                  <div className="text-xs font-medium opacity-80 mb-1">NEXT SHOWTIME</div>
                  <div className="text-2xl font-bold leading-none">{nextShow.time}</div>
                  {timeUntilNext && (
                    <div className="text-sm font-medium opacity-80 mt-2">Starts in {timeUntilNext}</div>
                  )}
                </div>
              </div>
            ) : (
              <div className="px-8 py-6 rounded-3xl border-2 w-full bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600">
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-400 dark:text-gray-500 leading-none">No Shows</div>
                  <div className="text-sm font-medium text-gray-400 dark:text-gray-500 mt-1">today</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Link>

      {/* Action buttons footer - always at bottom */}
      <div className="bg-gray-50 dark:bg-gray-700/30 border-t-2 border-gray-200 dark:border-gray-600 p-5 mt-auto">
        <div className="grid grid-cols-2 gap-4">
          {/* Visit Button */}
          <VisitButton 
            entityType="show"
            entityId={show.id}
            entityName={show.name}
            hideLabel={true}
            className="w-full h-14 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-2 border-green-200 dark:border-green-700 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-xl text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200"
          />
          
          {/* Alert Button */}
          {/* <div className="flex items-center justify-center bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border-2 border-orange-200 dark:border-orange-700 hover:bg-orange-100 dark:hover:bg-orange-900/30 rounded-xl h-14 transition-all duration-200 shadow-sm hover:shadow-md w-full">
            <AlertButton 
              entityId={show.id} 
              entityType="SHOW" 
            />
          </div> */}
          
          {/* Bookmark Button */}
          <div className="flex items-center justify-center bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-2 border-blue-200 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-xl h-14 transition-all duration-200 shadow-sm hover:shadow-md w-full">
            <BookmarkButton entityId={show.id} entityType="SHOW" size="lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
