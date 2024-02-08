import { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const UserLocationsMap = () => {
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    // Retrieve marker data from local storage
    const storedMarkers = JSON.parse(localStorage.getItem('markers'));
    if (storedMarkers) {
      setMarkers(storedMarkers);
    }

    // Initialize map
    mapboxgl.accessToken = 'pk.eyJ1IjoidG9rc29uY2hpazIiLCJhIjoiY2xzZDcxeXVuMDY1MTJqbzQ4Mm9vNjIxMSJ9.WCJ7vbbX-sTE1JTFLe9wdg';
    const mapInstance = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/toksonchik2/clsd6hoso014401qq37gr613w',
      center: [0, 0],
      zoom: 2
    });
    setMap(mapInstance);

    // Cleanup function
    return () => {
      // Save marker data to local storage before unmounting
      localStorage.setItem('markers', JSON.stringify(markers));
      // Remove map instance
      mapInstance.remove();
      setMap(null);
    };
  }, []);

  useEffect(() => {
    // WebSocket connection and marker update logic
    const ws = new WebSocket('wss://tnapp.onrender.com/');

    ws.onmessage = (event) => {
      const userData = JSON.parse(event.data);
      // Clear existing markers
      markers.forEach(marker => marker.remove());
      // Add new markers
      const newMarkers = userData.map(user => {
        const marker = new mapboxgl.Marker()
          .setLngLat(user.location)
          .addTo(map);
        new mapboxgl.Popup().setHTML(`<p>${user.username}</p>`).addTo(map);
        return marker;
      });
      setMarkers(newMarkers);
    };

    // WebSocket cleanup
    return () => {
      ws.close();
    };
  }, [map, markers]);

  return <div id="map" style={{ width: '100%', height: '600px' }}></div>;
};

export default UserLocationsMap;
