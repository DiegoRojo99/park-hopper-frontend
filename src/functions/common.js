function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function getLocaleFromTimezone(timezone) {
  const timezoneMap = {
    'America/New_York': 'en-US',
    'Europe/Madrid': 'es-ES',
    'Europe/Paris': 'fr-FR',
    'Asia/Tokyo': 'ja-JP',
    'America/Los_Angeles': 'en-US',
    'America/Mexico_City': 'es-MX',
  };
  
  return timezoneMap[timezone] || 'en-US';
}

export {
  capitalizeFirstLetter,
  getLocaleFromTimezone
}