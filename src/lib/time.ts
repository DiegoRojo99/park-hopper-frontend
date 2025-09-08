/* Format a date string to a specific time zone */
export default function formatTime(time: string, timeZone: string = 'America/New_York'): string {
  const date = new Date(time);
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: timeZone,
    hour12: true
  };
  return date.toLocaleString('en-US', options);
}