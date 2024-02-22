self.addEventListener('sync', function(event) {
    if (event.tag === 'syncLocationData') {
      event.waitUntil(syncLocationData());
    }
  });
  
  async function syncLocationData() {
    // Retrieve location data from local storage
    const locationData = await getStoredLocationData();
    // Send location data to the server
    await sendDataToServer(locationData);
  }
  
  async function getStoredLocationData() {
    // Retrieve location data from IndexedDB or other local storage
    // Example code to retrieve data from IndexedDB
    const db = await idb.openDB('location-db', 1);
    const tx = db.transaction('locations', 'readonly');
    const store = tx.objectStore('locations');
    return store.getAll();
  }
  
  async function sendDataToServer(data) {
    // Send data to the server using fetch or WebSocket
    // Example:
    const response = await fetch('https://tnapp.onrender.com/api/saveWorkingTime', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      throw new Error('Failed to send data to server');
    }
  }
  