self.addEventListener("message", (event) => {
    if (event.data && event.data.type === "location") {
      const { latitude, longitude } = event.data;
      console.log("Received location data:", latitude, longitude);
      // You can process the location data here or send it to the server if needed
    }
  });
  
  // To trigger background sync from your main app code
  navigator.serviceWorker.ready.then((registration) => {
    return registration.sync.register("sync-location");
  });
  