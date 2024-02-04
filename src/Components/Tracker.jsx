import React, { useState, useEffect } from 'react';
import UserLocationsMap from './UserLocationsMap'; // Adjust the path

const Tracker = () => {
  const [location, setLocation] = useState(null);
  const [userLocations, setUserLocations] = useState(null);

  useEffect(() => {
    const getLocation = () => {
      // Fetch the user's current location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setLocation({ latitude, longitude });
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

    // Fetch all user locations
    fetch('http://localhost:5000/api/getUserLocations')
      .then((response) => response.json())
      .then((data) => {
        setUserLocations(data);
      })
      .catch((error) => {
        console.error('Error fetching user locations:', error.message);
      });

    getLocation();
  }, []);

  return (
    <div>
      {location ? (
        <UserLocationsMap
          userLocations={userLocations}
          currentLocation={location}
        />
      ) : (
        <p>Fetching location...</p>
      )}
    </div>
  );
};

export default Tracker;
