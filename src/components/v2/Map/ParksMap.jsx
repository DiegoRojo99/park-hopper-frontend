import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for missing marker icons
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

import '../../common/Common.css';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function ParksMap({ places, openLink }){
  const defaultPosition = [51.505, -0.09]; // Default coordinates (e.g., London)

  return (
    <MapContainer center={defaultPosition} zoom={1} className='parks-map'>
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
