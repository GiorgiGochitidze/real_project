import React, { useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoidG9rc29uY2hpazIiLCJhIjoiY2xzZXZkNWhzMTY1NDJqbDVlNHZ0YWUzdyJ9.SYLqFmo8rDUbbMyO3N8FmA";

const UserLocationsMap = ({ longitude, latitude, zoomLvl, setShouldZoomToLocation, shouldZoomToLocation }) => {
  const [userLocations, setUserLocations] = useState({});
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    const initializeMap = () => {
      const mapInstance = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/toksonchik2/clsd6hoso014401qq37gr613w",
        center: [0, 0], // Use provided longitude and latitude
        zoom: 1, // Adjust zoom level as needed
      });

      mapInstance.addControl(new mapboxgl.NavigationControl());
      setMap(mapInstance);
    };

    initializeMap();

    let ws;

    const connectWebSocket = () => {
      ws = new WebSocket("wss://tnapp.onrender.com/");

      ws.onopen = () => {
        console.log("Connected to WebSocket server");
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setUserLocations(data);
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      ws.onclose = (event) => {
        if (!event.wasClean) {
          console.error(`WebSocket connection closed unexpectedly: code=${event.code}, reason=${event.reason}`);
          // Attempt to reconnect after a delay
          setTimeout(connectWebSocket, 3000); // Retry after 3 seconds
        }
      };
    };

    connectWebSocket();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []); // Empty dependency array ensures this effect runs only once on mount

  useEffect(() => {
    if (map && Object.keys(userLocations).length > 0) {
      // Clear existing markers
      markers.forEach(marker => marker.remove());
      // Add new markers
      const newMarkers = Object.entries(userLocations)
        .filter(([_, userLocation]) => userLocation.location !== null) // Filter out users with null location
        .map(([username, userLocation]) => {
          const popup = new mapboxgl.Popup({ closeButton: false }).setHTML(username);
          const marker = new mapboxgl.Marker()
            .setLngLat([userLocation.location.longitude, userLocation.location.latitude])
            .setPopup(popup)
            .addTo(map);
          return marker;
        });
      setMarkers(newMarkers);
    }
  }, [map, userLocations]);

  useEffect(() => {
    if (shouldZoomToLocation && map) { // Check if shouldZoomToLocation is true
      // Fly to the provided longitude and latitude
      map.flyTo({
        center: [longitude, latitude],
        zoom: zoomLvl, // You can adjust the zoom level as needed
        essential: true // This animation is considered essential with respect to prefers-reduced-motion
      });
      setShouldZoomToLocation(false);
    }
  }, [shouldZoomToLocation, map, longitude, latitude]);
  
  
  

  return <div id="map" style={{ height: "100%", width: "100%" }} />;
};

export default UserLocationsMap;
