function openGoogleMaps(latitude, longitude) {
  if(latitude && longitude){
    const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    window.open(url, '_blank');
  }
};

export { openGoogleMaps }