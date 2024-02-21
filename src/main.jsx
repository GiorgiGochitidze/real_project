import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
        if (registration.active && registration.active.state === 'activated') {
          // Service worker is ready
          console.log('Service Worker is ready');
          // Proceed with any additional setup (e.g., background sync registration)
          registration.sync.register("sync-location");
        } else {
          registration.addEventListener('statechange', () => {
            if (registration.active && registration.active.state === 'activated') {
              // Service worker is ready
              console.log('Service Worker is ready');
              // Proceed with any additional setup (e.g., background sync registration)
              registration.sync.register("sync-location");
            }
          });
        }
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
  });
}