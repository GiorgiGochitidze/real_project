import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const UserLocationsMap = () => {
  const [userLocations, setUserLocations] = useState(null);

  useEffect(() => {
    // Fetch user locations from the backend
    fetch('http://localhost:5000/api/getUserLocations')
      .then((response) => response.json())
      .then((data) => {
        console.log('Fetched user locations:', data);
        setUserLocations(data);
      })
      .catch((error) => {
        console.error('Error fetching user locations:', error.message);
      });
  }, []);
  

  if (!userLocations) {
    return <p>Loading user locations...</p>;
  }

  console.log('Rendering user locations:', userLocations);

  const customIcon = new L.Icon({
    iconUrl: '/redDot.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  return (
    <MapContainer
      center={[41.65110015869141, 41.63626861572266]} // Set a default center
      zoom={10}
      style={{ height: '600px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {Object.entries(userLocations).map(([username, location]) => (
        <Marker
          key={username}
          icon={customIcon}
          position={[location.latitude, location.longitude]}
        >
          <Popup>
            {username}'s Location<br />
            Latitude: {location.latitude}<br />
            Longitude: {location.longitude}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default UserLocationsMap;
