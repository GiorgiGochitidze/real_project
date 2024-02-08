import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../CSS/workers.css";

const Workers = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(null);
  const [currentTime, setCurrentTime] = useState(null);
  const [clockInTime, setClockInTime] = useState(null);
  const [clockOutTime, setClockOutTime] = useState(null);
  const [workingTime, setWorkingTime] = useState(null);
  const [timerStarted, setTimerStarted] = useState(false); // Track if timer has started
  const [location, setLocation] = useState(null); // State to hold the location

  useEffect(() => {
    fetchTime();

    const intervalId = setInterval(fetchTime, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const fetchTime = () => {
    const currentDateObj = new Date();
    setCurrentDate(currentDateObj.toDateString());
    setCurrentTime(currentDateObj.toLocaleTimeString());
  };

  const addUserLocation = (locationData) => {
    // Your code to add user location to the map
    // This function should interact with the UserLocationsMap component
    // to add the user's location marker on the map
    console.log("Adding user location to the map:", locationData);
  };

  const clockIn = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentDateTime = new Date();
          const loc = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          setClockInTime(currentDateTime);
          setLocation(loc); // Set the location
          setTimerStarted(true); // Set timer started flag to true

          // Save working time and location to the backend
          saveWorkingTime({ username, workingTime: null, location: loc });
        },
        (error) => {
          console.error("Error getting location:", error.message);
          // If location access is denied or not available, proceed without location
          const currentDateTime = new Date();
          setClockInTime(currentDateTime);
          setLocation(null); // Set location to null
          setTimerStarted(true); // Set timer started flag to true
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      // Proceed without location
      const currentDateTime = new Date();
      setClockInTime(currentDateTime);
      setLocation(null); // Set location to null
      setTimerStarted(true); // Set timer started flag to true
    }
  };

  const clockOut = () => {
    const currentDateTime = new Date();
    setClockOutTime(currentDateTime);
    setLocation(null); // Set location to null

    // Calculate working time only if it's not already set
    if (!workingTime && clockInTime) {
      const diffMilliseconds = currentDateTime - clockInTime;
      const seconds = Math.floor(diffMilliseconds / 1000);
      setWorkingTime(seconds);
      saveWorkingTime({ username, workingTime: seconds, location: null }); // Pass null as location when clocking out
    }
  };

  const resetTimer = () => {
    setClockInTime(null);
    setClockOutTime(null);
    setWorkingTime(null);
    setTimerStarted(false); // Reset timer started flag
    setLocation(null); // Reset location to null
  };

  const saveWorkingTime = (data) => {
    fetch("https://tnapp.onrender.com/api/saveWorkingTime", {
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
              ? `Worked from ${formatTime(clockInTime)} to ${formatTime(clockOutTime)}`
              : timerStarted
              ? "Timer started"
              : "Not yet Started Work"}
          </h3>

          {!clockOutTime && !timerStarted && (
            <>
              <button onClick={clockIn}>Clock In</button>
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

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
};

export default Workers;
