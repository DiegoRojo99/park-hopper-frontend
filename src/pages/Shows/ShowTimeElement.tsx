import { ShowTimes } from "../../types/db";
import { CalendarIcon } from "@heroicons/react/24/outline";

interface ShowTimeElementProps {
  showtime: ShowTimes;
}

function formatShowTime(time: string) {
  const date = new Date(time);
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/New_York',
    hour12: true
  };
  return date.toLocaleString('en-US', options);
}

export function ShowTimeElement({ showtime }: ShowTimeElementProps) {
  function displayShowTime(showtime: ShowTimes) {
    if (!showtime || !showtime.startTime || !showtime.endTime) {
      return <span className="text-gray-500">No showtime available</span>;
    }
    if (showtime.startTime === showtime.endTime) {
      return formatShowTime(showtime.startTime);
    }
    return `${formatShowTime(showtime.startTime)} - ${formatShowTime(showtime.endTime)}`;
  }

  return (
    <div className="flex items-center space-x-1 bg-gray-50 dark:bg-gray-700/50 rounded-lg px-2 py-1 border border-gray-200 dark:border-gray-600">
      <CalendarIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
      <span className="text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
        {displayShowTime(showtime)}
      </span>
    </div>
  );
}
