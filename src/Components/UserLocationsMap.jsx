import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const UserLocationsMap = ({
  currentLocation,
  updateLocation,
}) => {
  const [loading, setLoading] = useState(true);
  const [focusedUser, setFocusedUser] = useState(null);
  const [userLocationsState, setUserLocations] = useState([]);


  const customIcon = new L.Icon({
    iconUrl: "/redDot.png",
    iconSize: [20, 20],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
  const handlePositionChange = (position) => {
    console.log("New position:", position.coords);
    const { latitude, longitude } = position.coords;
    updateLocation(latitude, longitude);
    setFocusedUser({ location: { latitude, longitude } });
    setLoading(false);
  };
  

  const fetchAllUserLocations = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/getAllUserLocations"
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

  const handleLogout = () => {
    // Handle logout event, e.g., by sending a signal to the server
    // indicating that the user has logged out.
    // This could be an API call or socket event depending on your backend.
    // For demonstration purposes, we'll clear the current location.
    setCurrentLocation(null);
  };

  useEffect(() => {
    fetchAllUserLocations(); // Initial fetch

    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        handlePositionChange,
        (error) => {
          setLoading(false);
          console.error("Error getting location:", error.message);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );

      // Fetch all user locations every 10 seconds
      const intervalId = setInterval(fetchAllUserLocations, 1000);

      window.addEventListener("beforeunload", handleLogout);

      return () => {
        navigator.geolocation.clearWatch(watchId);
        clearInterval(intervalId);
        window.removeEventListener("beforeunload", handleLogout);
      };
    } else {
      setLoading(false);
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  if (loading) {
    return <p>Loading current location...</p>;
  }

  // Filter out users with null or undefined locations or missing latitude/longitude
  const usersWithLocations = userLocationsState.filter(
    (user) =>
      user.location &&
      user.location.latitude !== undefined &&
      user.location.longitude !== undefined
  );
  

  return (
    <MapContainer
    center={
      focusedUser
        ? [focusedUser.location.latitude, focusedUser.location.longitude]
        : [currentLocation?.latitude || 0, currentLocation?.longitude || 0]
    }
    
    zoom={10}
    style={{ height: "600px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Marker for the current user's location */}
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
