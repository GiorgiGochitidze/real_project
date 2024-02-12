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
  }, [])

  useEffect(() => {
    fetchTime();
    const intervalId = setInterval(fetchTime, 1000);
    window.addEventListener("beforeunload", handlePageUnload); // Add event listener for page unload
    return () => {
      clearInterval(intervalId);
      window.removeEventListener("beforeunload", handlePageUnload); // Remove event listener on cleanup
    };
  }, []);

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
  
    // Function to continuously watch user's location
    const watchUserLocation = () => {
      const options = {
        enableHighAccuracy: true,
        maximumAge: 0, // Do not use a cached position
        timeout: 5000, // Timeout in milliseconds (e.g., 5 seconds)
      };

      return navigator.geolocation.watchPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          if (onClockIn) {
            onClockIn({
              username,
              workingTime: null,
              location: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              },
            });
            
            // Send data to backend
            saveWorkingTime({
              username,
              workingTime: null,
              location: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              },
            });
          }
        },
        (error) => {
          console.error("Error getting user's location:", error.message);
        },
        options
      );
    };
  
    // Get user's location
    if (navigator.geolocation) {
      const id = watchUserLocation(); // Start watching user's location
      setWatchId(id); // Set the watchId
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };
  
  const clockOut = () => {
    try {
      const currentDateTime = new Date();
      setClockOutTime(currentDateTime);
      setLatitude(null); // Set latitude to null
      setLongitude(null); // Set longitude to null
  
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
