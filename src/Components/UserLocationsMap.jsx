import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const UserLocationsMap = () => {
  const [userLocations, setUserLocations] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);

  const customIcon = new L.Icon({
    iconUrl: '/redDot.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  const fetchUserLocations = () => {
    // Fetch user locations from the backend
    fetch('https://tnapp.onrender.com/api/getUserLocations')
      .then((response) => response.json())
      .then((data) => {
        console.log('Fetched user locations:', data);
        setUserLocations(data);
      })
      .catch((error) => {
        console.error('Error fetching user locations:', error.message);
      });
  };

  const getCurrentLocation = () => {
    // Fetch the user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ latitude, longitude });
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
    // Initial fetch of user locations
    fetchUserLocations();

    // Fetch and update current location every 5 seconds
    const intervalId = setInterval(getCurrentLocation, 5000);

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array ensures this effect runs only once

  if (!userLocations || !currentLocation) {
    return <p>Loading user locations...</p>;
  }

  console.log('Rendering user locations:', userLocations);

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

      {Object.entries(userLocations).map(([username, location]) => (
        <Marker
          key={username}
          icon={customIcon}
          position={[location.latitude, location.longitude]}
        >
          <Popup>
            {username}'s Location
            <br />
            Latitude: {location.latitude}
            <br />
            Longitude: {location.longitude}
          </Popup>
        </Marker>
      ))}

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
