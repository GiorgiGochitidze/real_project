import React, { useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import locationData from "../../Back-End/all_users_data.json";

const UserLocationsMap = () => {
  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoidG9rc29uY2hpazIiLCJhIjoiY2xzZXZkNWhzMTY1NDJqbDVlNHZ0YWUzdyJ9.SYLqFmo8rDUbbMyO3N8FmA";

    const map = new mapboxgl.Map({
      container: "map", // Pass the ID of the div here
      style: "mapbox://styles/toksonchik2/clsd6hoso014401qq37gr613w",
      zoom: 1,
      center: [0, 0],
    });

    Object.keys(locationData).forEach((username) => {
      const user = locationData[username];
      const location = user.location;
      // Check if location is available and has latitude and longitude
      if (location && location.latitude && location.longitude) {
        // Create a marker for the location
        const marker = new mapboxgl.Marker().setLngLat([location.longitude, location.latitude]);
        // Create a popup for the marker
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
          `<h3>${username}</h3><p>Latitude: ${location.latitude}<br>Longitude: ${location.longitude}</p>`
        );
        // Add popup to the marker
        marker.setPopup(popup);
        // Add marker to the map
        marker.addTo(map);
      }
    });

    // Clean up resources when component unmounts
    return () => map.remove();
  }, []);

  return <div id="map" style={{ width: "100%", height: "600px" }}></div>;
};

export default UserLocationsMap;
