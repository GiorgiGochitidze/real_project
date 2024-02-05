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

  useEffect(() => {
    fetchTime();

    const savedTimerValue = parseInt(localStorage.getItem("timerValue"), 10) || 0;
    setTimer(savedTimerValue);

    const intervalId = setInterval(fetchTime, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const fetchTime = () => {
    const currentDateObj = new Date();
    setCurrentDate(currentDateObj.toDateString());
    setCurrentTime(currentDateObj.toLocaleTimeString());
  };

  const startTimer = () => {
    clearInterval(timerId);
  
    const getLocation = () => {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            navigator.geolocation.fetchedLocation = true;
            resolve({ latitude, longitude });
          },
          (error) => {
            console.error("Error getting location:", error.message);
            resolve(null); // Resolve with null if location fetching fails
          }
        );
      });
    };
  
    getLocation().then((location) => {
      clockIn(location);
  
      const newTimerId = setInterval(() => {
        setTimer((prevTimer) => {
          sessionStorage.setItem("timerValue", String(prevTimer + 1));
          return prevTimer + 1;
        });
      }, 1000);
  
      setTimerId(newTimerId);
    });
  };
  
  const clockIn = (location) => {
    const newTimerValue = timer + 1;
  
    if (location) {
      saveUserLocation({ username, workingTime: newTimerValue, location });
      saveTimer(newTimerValue, location);
    
      // Console log the user location
      console.log(`${username}:`, location);
    } else {
      saveTimer(newTimerValue);
    }
  };
  
  

  const saveUserLocation = (data) => {
    fetch("http://localhost:5000/api/saveWorkingTime", {
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
    saveTimer(timer);
    clearInterval(timerId);
  };

  const saveTimer = (timerValue, location) => {
    const requestBody = {
      username,
      workingTime: timerValue,
      location: location || null,
    };

    fetch("http://localhost:5000/api/saveWorkingTime", {
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
    clearInterval(timerId);
    setTimer(0);
    sessionStorage.removeItem("timerValue"); // Change localStorage to sessionStorage
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
            }}
          >
            Clock In
          </button>
          <button onClick={clockOut}>Clock Out</button>
          <button style={{ background: "red" }} onClick={resetTimer}>
            Reset
          </button>
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
