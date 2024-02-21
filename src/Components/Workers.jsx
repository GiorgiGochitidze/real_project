import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../CSS/workers.css";

const Workers = ({ onClockIn }) => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(null);
  const [currentTime, setCurrentTime] = useState(null);
  const [clockInTime, setClockInTime] = useState(null);
  const [clockOutTime, setClockOutTime] = useState(null);
  const [workingTime, setWorkingTime] = useState(null);
  const [timerStarted, setTimerStarted] = useState(false); // Track if timer has started
  const [latitude, setLatitude] = useState(null); // User's latitude
  const [longitude, setLongitude] = useState(null); // User's longitude
  const [ws, setWs] = useState(null); // WebSocket instance
  const [watchId, setWatchId] = useState(null); // ID of the watchPosition callback

  useEffect(() => {
    const initializeWebSocket = () => {
      const socket = new WebSocket("wss://tnapp.onrender.com/");

      socket.onopen = () => {
        console.log("Connected to WebSocket server");
        setWs(socket);
      };

      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      socket.onclose = (event) => {
        if (!event.wasClean) {
          console.error(
            `WebSocket connection closed unexpectedly: code=${event.code}, reason=${event.reason}`
          );
        }
      };
    };

    initializeWebSocket();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  useEffect(() => {
    fetchTime();
    const intervalId = setInterval(fetchTime, 1000);
    window.addEventListener("beforeunload", handlePageUnload); // Add event listener for page unload
    return () => {
      clearInterval(intervalId);
      window.removeEventListener("beforeunload", handlePageUnload); // Remove event listener on cleanup
    };
  }, []);

  useEffect(() => {
    // Function to handle controller change
    const handleControllerChange = () => {
      if (navigator.serviceWorker.controller) {
        // Controller is available, send message to service worker
        sendMessageToServiceWorker();
      }
    };
  
    // Listen for controller change event
    navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);
  
    // Cleanup function
    return () => {
      navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
    };
  }, []);

  // Function to send message to service worker
const sendMessageToServiceWorker = () => {
  if (navigator.serviceWorker.controller) {
    const { latitude, longitude } = position.coords;
    navigator.serviceWorker.controller.postMessage({ type: 'location', latitude, longitude });
  }
};

// Function to handle geolocation success
const handleGeolocationSuccess = (position) => {
  const { latitude, longitude } = position.coords;
  setLatitude(latitude);
  setLongitude(longitude);
  
  // Check if service worker controller is available
  if (navigator.serviceWorker.controller) {
    sendMessageToServiceWorker();
  } else {
    console.warn('Service worker controller not available yet.');
  }

  // Save working time here
  saveWorkingTime({ username, workingTime: null, location: { latitude, longitude } });
};

// Function to handle geolocation error
const handleGeolocationError = (error) => {
  console.error('Error getting user location:', error.message);
};

  const fetchTime = () => {
    try {
      const currentDateObj = new Date();
      setCurrentDate(currentDateObj.toDateString());
      setCurrentTime(currentDateObj.toLocaleTimeString());
    } catch (error) {
      console.error("Error fetching time:", error.message);
    }
  };


  const clockIn = (event) => {
    event.preventDefault();
    const currentDateTime = new Date();
    setClockInTime(currentDateTime);
    setTimerStarted(true);
  
    // Fetch the user's location using the Geolocation API
    navigator.geolocation.getCurrentPosition(handleGeolocationSuccess, handleGeolocationError);
  };

  
  const clockOut = () => {
    try {
      const currentDateTime = new Date();
      setClockOutTime(currentDateTime);
      
      // Clear the watchPosition callback to stop tracking the user's location
      if (navigator.geolocation && watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
      
      // Calculate working time only if it's not already set
      if (clockInTime) {
        const diffMilliseconds = currentDateTime - clockInTime;
        const seconds = Math.floor(diffMilliseconds / 1000);
        setWorkingTime(seconds);
        // Save working time here
        saveWorkingTime({ username, workingTime: seconds, location: null }); // Send location as null
      }
    } catch (error) {
      console.error("Error clocking out:", error.message);
    }
  };
  
  const handlePageUnload = (event) => {
    if (timerStarted) {
      event.preventDefault();
      event.returnValue = ""; // For Chrome
    }
  };

  const resetTimer = () => {
    try {
      setClockInTime(null);
      setClockOutTime(null);
      setWorkingTime(null);
      setTimerStarted(false); // Reset timer started flag
    } catch (error) {
      console.error("Error resetting timer:", error.message);
    }
  };
  
  const saveWorkingTime = (data) => {
    fetch("https://tnapp.onrender.com/api/saveWorkingTime", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log(data.message);
      })
      .catch((error) => {
        console.error("Error saving working time:", error.message);
      });
  };
  
  return (
    <>
      <header>
        <nav>
          <p>Welcome, {username}!</p>
          <button onClick={() => navigate("/LogIn")}>Log Out</button>
        </nav>
      </header>
      <main className="mains">
        <h1>
          <p>Current Date: {currentDate}</p>
          <p>Current Time: {currentTime}</p>
        </h1>

        <h2>Your Current Working Time:</h2>

        <div className="time-container">
          <h3>
            {workingTime !== null
              ? `Worked for ${formatTime(workingTime)}`
              : clockOutTime
              ? `Worked from ${formatTime(clockInTime)} to ${formatTime(
                  clockOutTime
                )}`
              : timerStarted
              ? "Timer started"
              : "Not yet Started Work"}
          </h3>

          {!clockOutTime && !timerStarted && (
            <>
              <button onClick={(event) => clockIn(event)}>Clock In</button>
            </>
          )}
          {!clockOutTime && timerStarted && (
            <>
              <button onClick={clockOut}>Clock Out</button>
            </>
          )}
          {clockOutTime && <button onClick={resetTimer}>Reset</button>}
        </div>
      </main>
    </>
  );
};

const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(remainingSeconds).padStart(2, "0")}`;
};

export default Workers;
