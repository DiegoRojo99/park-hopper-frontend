import { LiveShow, ShowTimes } from "../../types/db";
import { CalendarIcon, ClockIcon } from "@heroicons/react/24/outline";
import { ShowTimeElement } from "./ShowTimeElement";
import { BookmarkButton } from "../../components/BookmarkButton";
import formatTime from "../../lib/time";

function getNextShowtime(show: LiveShow) {
  if (!show.showtimes || show.showtimes.length === 0) return null;
  
  // Get current time in UTC
  const now = new Date();
  
  // Find the next showtime
  for (const time of show.showtimes) {
    const showtimeDate = new Date(time.startTime);
    if (showtimeDate > now) {
      return formatTime(time.startTime, show.timezone);
    }
  }
  return null;
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
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">        
          <h3 className="text-md font-bold">
            {show.name}
          </h3>
          {!!duration && (
            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-1">
              <ClockIcon className="h-4 w-4 shrink-0 mr-1.5" />
              <span className="leading-none">{formatDuration(duration)}</span>
            </div>
          )}
          {getNextShowtime(show) && (
            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-1">
              <CalendarIcon className="h-4 w-4 shrink-0 mr-1.5" />
              <span className="leading-none">Next Show: {getNextShowtime(show)}</span>
            </div>
          )}
        </div>
        <BookmarkButton entityId={show.id} entityType="SHOW" size="sm" />
      </div>
      <ShowCardAdditionalShowtimes show={show} />
    </div>
  );
}

function filterPastShowtime(showtime: ShowTimes) {
  const now = new Date();
  return new Date(showtime.startTime) > now;
}

function filterDifferentDateShowtime(showtime: ShowTimes) {
  const now = new Date();
  return new Date(showtime.startTime).toDateString() !== now.toDateString();
}

function filterShowtimesByDateAndTime(show: LiveShow) {
  return show.showtimes?.filter(st => {
    if (!st.startTime) return false;
    if (!filterPastShowtime(st)) return false;
    if (!filterDifferentDateShowtime(st)) return false;
    return true;
  });
}

function ShowCardAdditionalShowtimes({ show }: { show: LiveShow }) {
  const dateFilteredShowtimes = filterShowtimesByDateAndTime(show);
  const numberOfShowtimes = dateFilteredShowtimes ? dateFilteredShowtimes.length : 0;

  if (numberOfShowtimes < 2) {
    const showTimeExists = numberOfShowtimes === 1;
    return (
      <>
        <hr className="mt-2 mb-3" />
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mt-2">
          <CalendarIcon className="h-4 w-4" />
          <span>No {showTimeExists ? "additional" : ""} upcoming showtimes available today.</span>
        </div>
      </>
    );
  }
  return (
    <>
      <hr className="mt-2 mb-3" />
      <div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Additional Showtimes:</p>
        <div className="flex flex-wrap gap-2 justify-start">
          {show.showtimes.slice(1).map((time, index) => (
            <ShowTimeElement key={index} showtime={time} timezone={show.timezone} />
          ))}
        </div>
      </div>
    </>
  );
}
