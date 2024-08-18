function parsePeriodTime(dateString) {
  
  const timeMatch = dateString.match(/T(\d{2}:\d{2})/);
  
  if (timeMatch) {
      let time = timeMatch[1];
      
      const [hour, minute] = time.split(':').map(Number);
      const isPM = hour >= 12;
      const formattedHour = hour % 12 || 12;
      const period = isPM ? 'PM' : 'AM';

      return `${formattedHour}:${minute.toString().padStart(2, '0')} ${period}`;
  } else {
      return "Invalid time format";
  }
}

function parseTime(dateString) {
  const timeMatch = dateString.match(/T(\d{2}:\d{2})/);

  if (timeMatch) {
      let time = timeMatch[1];
      
      const [hour, minute] = time.split(':').map(Number);
      return `${hour}:${minute.toString().padStart(2, '0')}`;
  } else {
      return "Invalid time format";
  }
}

export {
  parsePeriodTime,
  parseTime
}