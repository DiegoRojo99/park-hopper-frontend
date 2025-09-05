import { LiveShow, ShowTimes } from "../../types/db";

function formatShowTime(time: string) {
  const date = new Date(time);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function ShowCard({ show }: { show: LiveShow }) {
  function displayShowTime(showtime: ShowTimes) {
    if (!showtime || !showtime.startTime || !showtime.endTime) {
      return <span className="text-gray-500">No showtime available</span>;
    }
    if (showtime.startTime === showtime.endTime) {
      return (
        <>
          {formatShowTime(showtime.startTime)}
        </>
      );
    }
    return (
      <>
        {formatShowTime(showtime.startTime)} - {formatShowTime(showtime.endTime)}
      </>
    )
  }

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h3 className="text-md font-bold mb-2 min-h-12">
        {show.name}
      </h3>
      <hr />
      {show.showtimes?.length ? (
        <div className="mt-2 w-full flex flex-row flex-wrap justify-center mx-auto">
          {show.showtimes.map((time, index) => (
            <div key={index} className="w-fit text-sm text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-[4px] px-1 py-1 m-1">
              {displayShowTime(time)}
            </div>
          ))}
        </div>
        ) : (
        <div className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">
          No showtimes available.
        </div>
      )}
    </div>
  );
}