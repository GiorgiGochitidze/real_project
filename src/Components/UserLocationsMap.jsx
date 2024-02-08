import React, { useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import customMarkerIcon from "/redDot.png"; // Import your custom marker icon

// Disable warning message about token
mapboxgl.accessToken = "pk.eyJ1IjoidG9rc29uY2hpazIiLCJhIjoiY2xzZDcxeXVuMDY1MTJqbzQ4Mm9vNjIxMSJ9.WCJ7vbbX-sTE1JTFLe9wdg";

const UserLocationsMap = ({ addUserLocation }) => {
  const [map, setMap] = useState(null);
  const [userLocations, setUserLocations] = useState([]);

  useEffect(() => {
    const initializeMap = () => {
      const mapInstance = new mapboxgl.Map({
        container: "map-container",
        style: "mapbox://styles/toksonchik2/clsd6hoso014401qq37gr613w",
        center: [0, 0],
        zoom: 1
      });

      mapInstance.on("load", () => {
        setMap(mapInstance);
      });

      // Add click event listener to the map
      mapInstance.on("click", "markers", (e) => {
        const coordinates = e.features[0].geometry.coordinates.slice();
        const username = e.features[0].properties.title;

        // Ensure that if the map is zoomed out such that multiple copies of the feature are visible,
        // the popup appears over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML(`<p>${username}</p>`)
          .addTo(mapInstance);
      });

      // Change the cursor to a pointer when the mouse is over the places layer.
      mapInstance.on("mouseenter", "markers", () => {
        mapInstance.getCanvas().style.cursor = "pointer";
      });

      // Change it back to a pointer when it leaves.
      mapInstance.on("mouseleave", "markers", () => {
        mapInstance.getCanvas().style.cursor = "";
      });
    };

    initializeMap();

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, []);

  useEffect(() => {
    // Fetch user locations from the backend when the component mounts
    fetchUserLocations();
  }, []);

  const fetchUserLocations = () => {
    fetch("https://tnapp.onrender.com/api/getAllUserLocations")
      .then((response) => response.json())
      .then((data) => {
        // Check if there are any new user locations
        const newLocations = data.filter(newUser => !userLocations.find(existingUser => existingUser.id === newUser.id));
        if (newLocations.length > 0) {
          setUserLocations(data);
        }
      })
      .catch((error) => {
        console.error("Error fetching user locations:", error);
      });
  };

  useEffect(() => {
    if (map && userLocations && userLocations.length > 0) {
      // Remove existing markers
      map.getSource("markers")?.setData({
        type: "FeatureCollection",
        features: []
      });

      // Add new markers
      const markers = userLocations.map(user => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [user.location.longitude, user.location.latitude]
        },
        properties: {
          title: user.username
        }
      }));

      map.addSource("markers", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: markers
        }
      });

      map.addLayer({
        id: "markers",
        type: "symbol",
        source: "markers",
        layout: {
          "icon-image": "custom-marker", // Use the custom marker icon
          "icon-size": 0.4,
          "icon-anchor": "bottom", // Adjust anchor position if needed
          "icon-allow-overlap": true // Allow markers to overlap if needed
        }
      });

      // Add the custom marker icon to the map
      map.loadImage(customMarkerIcon, (error, image) => {
        if (error) throw error;
        map.addImage("custom-marker", image);
      });
    }
  }, [map, userLocations]);

  return (
    <div id="map-container" style={{ height: "600px", width: "100%" }}></div>
  );
};

export default UserLocationsMap;
