function getHoursAndMinutes(time, timezone){
  return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: timezone });
}

function getCurrentTimeInTimezone(timezone) {
  const today = new Date();
  const currentTime = new Date(today.toLocaleString("en-US"));
  return getHoursAndMinutes(currentTime, timezone);
}

function formatShowtime(startTime, endTime, timezone) {
  const start = new Date(startTime);
  const end = new Date(endTime);
  
  const formattedStart = start.toLocaleTimeString([], { timeZone: timezone, hour: '2-digit', minute: '2-digit' });
  const formattedEnd = end.toLocaleTimeString([], { timeZone: timezone, hour: '2-digit', minute: '2-digit' });

  return start.getTime() === end.getTime() ? formattedStart : `${formattedStart} - ${formattedEnd}`;
}

function getNextShowtime(showtimes, timezone) {
  const currentTime = getCurrentTimeInTimezone(timezone);
  if(showtimes.length === 1){
    const show = showtimes[0];
    if(getHoursAndMinutes(new Date(show.endTime), timezone) < currentTime){
      return "No upcoming showtimes";
    }
    return formatShowtime(show.startTime, show.endTime, timezone);
  }

  const nextShow = showtimes.find(show => getHoursAndMinutes(new Date(show.startTime), timezone) > currentTime);
  if (nextShow) {
    return formatShowtime(nextShow.startTime, nextShow.endTime, timezone);
  } 
  else {
    return "No upcoming showtimes";
  }
}

export {
  getCurrentTimeInTimezone,
  getNextShowtime,
  formatShowtime
}