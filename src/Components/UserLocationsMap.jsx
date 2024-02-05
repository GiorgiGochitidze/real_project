import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const UserLocationsMap = () => {
  const [currentLocation, setCurrentLocation] = useState(null);

  const customIcon = new L.Icon({
    iconUrl: '/redDot.png',
    iconSize: [22, 22],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  const getCurrentLocation = () => {
    // Fetch the user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ latitude, longitude });
          console.log('Current Location:', { latitude, longitude });
        },
        (error) => {
          console.error('Error getting location:', error.message);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  useEffect(() => {
    // Fetch and update current location initially
    getCurrentLocation();

    // Set up an interval to fetch and update the location every 3 seconds
    const intervalId = setInterval(() => {
      getCurrentLocation();
    }, 3000);

    // Clear the interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array ensures this effect runs only once

  if (!currentLocation) {
    return <p>Loading current location...</p>;
  }

  return (
    <MapContainer
      center={[currentLocation.latitude, currentLocation.longitude]}
      zoom={10}
      style={{ height: '600px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Marker for the current user's location */}
      <Marker
        icon={customIcon}
        position={[currentLocation.latitude, currentLocation.longitude]}
      >
        <Popup>
          Your Current Location
          <br />
          Latitude: {currentLocation.latitude}
          <br />
          Longitude: {currentLocation.longitude}
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default UserLocationsMap;
