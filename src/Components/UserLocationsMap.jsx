import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const UserLocationsMap = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  const customIcon = new L.Icon({
    iconUrl: '/redDot.png',
    iconSize: [22, 22],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  const handlePositionChange = (position) => {
    const { latitude, longitude } = position.coords;
    setCurrentLocation({ latitude, longitude });
    setLoading(false);
  };

  useEffect(() => {
    if (navigator.geolocation) {
      // Set up a continuous watch on the user's position
      const watchId = navigator.geolocation.watchPosition(
        handlePositionChange,
        (error) => {
          setLoading(false);
          console.error('Error getting location:', error.message);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );

      // Clear the watch on component unmount
      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      setLoading(false);
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  if (loading) {
    return <p>Loading current location...</p>;
  }

  if (!currentLocation) {
    return <p>Unable to fetch the current location.</p>;
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
