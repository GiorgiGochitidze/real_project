import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../CSS/workers.css";

const Workers = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(null);
  const [currentTime, setCurrentTime] = useState(null);
  const [timer, setTimer] = useState(0);
  const [timerId, setTimerId] = useState(null);
  const [ws, setWs] = useState(null); // WebSocket state
  const [currentLocation, setCurrentLocation] = useState(null);

  // Fetch time function remains the same

  useEffect(() => {
    // Establish WebSocket connection
    const socket = new WebSocket('wss://https://websocket-qyhb.onrender.com/');
    // Replace with your WebSocket server URL

    socket.onopen = () => {
      console.log("WebSocket connection opened");
      setWs(socket);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    // Listen for WebSocket messages
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      // Check the type of message (e.g., 'locationUpdate')
      if (data.type === "locationUpdate") {
        // Update the current location state
        setCurrentLocation(data.location);
      }
    };

    // Cleanup on component unmount
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []); // Empty dependency array means this useEffect runs once on mount

  useEffect(() => {
    // Fetch time initially
    fetchTime();

    // Check local storage for saved timer value
    const savedTimerValue =
      parseInt(localStorage.getItem("timerValue"), 10) || 0;
    setTimer(savedTimerValue);

    // Set up interval to fetch time every second (adjust the interval as needed)
    const intervalId = setInterval(fetchTime, 1000);

    // Clear the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []);

  // Add this function to your code
  const fetchTime = () => {
    // Implement the logic to fetch and update the current time
    // For example, you can use JavaScript Date object
    const currentDateObj = new Date();
    setCurrentDate(currentDateObj.toDateString());
    setCurrentTime(currentDateObj.toLocaleTimeString());
  };

  const startTimer = () => {
    // Clear the existing timer interval if it exists
    clearInterval(timerId);

    // Get the user's location only if not fetched already
    if (!navigator.geolocation.fetchedLocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // console.log(`User: ${username}, Location: ${latitude}, ${longitude}`);
          navigator.geolocation.fetchedLocation = true; // Set the flag to true
        },
        (error) => {
          console.error("Error getting location:", error.message);
        }
      );
    }

    // Start the timer
    const newTimerId = setInterval(() => {
      setTimer((prevTimer) => {
        // Save timer value to local storage
        localStorage.setItem("timerValue", String(prevTimer + 1));
        return prevTimer + 1;
      });
    }, 1000);

    setTimerId(newTimerId);
  };

  const clockIn = () => {
    // Get the user's location only if not fetched already
    if (!navigator.geolocation.fetchedLocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log(`User: ${username}, Location: ${latitude}, ${longitude}`);
          navigator.geolocation.fetchedLocation = false; // Set the flag to true

          // Send the user's location to the backend
          saveUserLocation({ username, location: { latitude, longitude } });

          // Use the correct timer value from state
          saveTimer(timer + 1, { latitude, longitude });
        },
        (error) => {
          console.error("Error getting location:", error.message);
          // Use the correct timer value from state
          saveTimer(timer + 1);
        }
      );
    } else {
      // Use the previously fetched location
      // Use the correct timer value from state
      saveTimer(timer + 1);
    }

    if (ws) {
      ws.send(JSON.stringify({ type: "clockIn", username }));
    }
  };

  const saveUserLocation = (data) => {
    // Fetch to your backend API (replace with your actual backend URL)
    fetch("https://tnapp.onrender.com/api/saveUserLocation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.message);
      })
      .catch((error) => {
        console.error("Error saving user location:", error.message);
      });
  };

  const clockOut = () => {
    // Call the backend API to save the last working time
    saveTimer(timer);

    // Stop the timer
    clearInterval(timerId);

    if (ws) {
      ws.send(JSON.stringify({ type: "clockOut", username }));
    }
  };

  const saveTimer = (timerValue, location) => {
    // Include location information in the request body if available
    const requestBody = {
      username,
      workingTime: timerValue,
      location: location || null,
    };

    // Fetch to your backend API (replace with your actual backend URL)
    fetch("https://tnapp.onrender.com/api/saveWorkingTime", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.message);
      })
      .catch((error) => {
        console.error("Error saving working time:", error.message);
      });
  };

  const resetTimer = () => {
    // Stop the timer
    clearInterval(timerId);

    // Reset the timer to 00:00:00
    setTimer(0);

    // Clear the saved timer value in local storage
    localStorage.removeItem("timerValue");
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
          <h3>{formatTime(timer)}</h3>
          <button
            onClick={() => {
              startTimer();
              clockIn();
            }}
          >
            Clock In
          </button>
          <button onClick={clockOut}>Clock Out</button>
          <button style={{ background: "red" }} onClick={resetTimer}>
            Reset
          </button>
        </div>

        {currentLocation && (
            <p>
              Current Location: {currentLocation.latitude},{" "}
              {currentLocation.longitude}
            </p>
          )}

      </main>
    </>
  );
};

// Helper function to format seconds into HH:MM:SS
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
