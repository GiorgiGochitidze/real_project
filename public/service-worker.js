self.addEventListener("sync", (event) => {
    if (event.tag === "sync-location") {
      event.waitUntil(syncLocation());
    }
  });
  
  self.addEventListener("message", (event) => {
    if (event.data && event.data.type === "location") {
      const { latitude, longitude } = event.data;
  
      // Synchronize the location data with the server
      syncLocation(latitude, longitude);
    }
  });
  
  function syncLocation(latitude, longitude) {
    // Send location data to the server
    fetch("https://tnapp.onrender.com/api/saveLocation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ latitude, longitude }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        console.log("Location data synced successfully");
      })
      .catch((error) => {
        console.error("Error syncing location data:", error.message);
      });
  }
  
  // To trigger background sync from your main app code
  navigator.serviceWorker.ready.then((registration) => {
    return registration.sync.register("sync-location");
  });
  