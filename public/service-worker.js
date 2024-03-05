self.addEventListener('sync', function(event) {
  if (event.tag === 'syncLocationData') {
      event.waitUntil(syncLocationData());
  }
});

async function syncLocationData() {
  const locationData = await getStoredLocationData();
  await sendDataToServer(locationData);
}

async function getStoredLocationData() {
  const db = await idb.openDB('location-db', 1);
  const tx = db.transaction('locations', 'readonly');
  const store = tx.objectStore('locations');
  return store.getAll();
}

async function sendDataToServer(data) {
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
