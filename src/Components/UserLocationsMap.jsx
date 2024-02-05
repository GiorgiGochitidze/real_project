import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const UserLocationsMap = () => {
  const [userLocations, setUserLocations] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  const customIcon = new L.Icon({
    iconUrl: "/redDot.png",
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
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://tnapp.onrender.com/api/getAllUserLocations"
        );
        const data = await response.json();

        // Ensure that data is an array
        if (Array.isArray(data)) {
          setUserLocations(data);
        } else {
          console.error("Invalid data format:", data);
        }
      } catch (error) {
        console.error("Error fetching user locations:", error.message);
      }
    };

    fetchData();

    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        handlePositionChange,
        (error) => {
          setLoading(false);
          console.error("Error getting location:", error.message);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      setLoading(false);
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  if (loading) {
    return <p>Loading current location...</p>;
  }

  if (!currentLocation) {
    return <p>Unable to fetch the current location.</p>;
  }

  // Filter out users with null or undefined locations or missing latitude/longitude
  const usersWithLocations = userLocations.filter(
    (user) =>
      user.location &&
      user.location.latitude !== undefined &&
      user.location.longitude !== undefined
  );

  return (
    <MapContainer
      center={[currentLocation.latitude, currentLocation.longitude]}
      zoom={10}
      style={{ height: "600px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
  
      {/* Marker for the current user's location */}
      {/* change currentlocation to false to disable show ur current location */}
      {currentLocation && ( 
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
      )}
  
      {/* Markers for other users with non-null locations */}
      {usersWithLocations.map((user) => (
        <Marker
          key={user.username}
          icon={customIcon}
          position={[user.location.latitude, user.location.longitude]}
        >
          <Popup>
            {user.username}'s Location
            <br />
            Latitude: {user.location.latitude}
            <br />
            Longitude: {user.location.longitude}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default UserLocationsMap;
