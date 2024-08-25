import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for missing marker icons
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

import '../../common/Common.css';
import { Loader } from '../../common/Loader';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function ParksMap({ places, openLink }){

  const [userPosition, setUserPosition] = useState(false);
  const [zoom, setZoom] = useState(1);
  const defaultPosition = [30, 0]; // Default coordinates (e.g., London)

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserPosition([position.coords.latitude, position.coords.longitude]);
          setZoom(14)
        },
        () => {
          console.error("Unable to retrieve your location");
          setUserPosition(defaultPosition);
          setZoom(1);
        }
      );
    } else {
      console.error("Geolocation is not supported by your browser");
      setUserPosition(defaultPosition);
      setZoom(1);
    }
  }, []);


  if (!userPosition) {
    return <Loader />
  }

  return (
    <MapContainer center={userPosition} zoom={zoom} className='parks-map'>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {places.map((place, index) => (
        <Marker key={index} position={[place.lat, place.lng]}>
          <Popup>
            <p onClick={() => openLink(place.id)}>{place.name}</p>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default ParksMap;
