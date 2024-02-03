import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../CSS/workers.css';

const Workers = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(null);
  const [currentTime, setCurrentTime] = useState(null);
  const [timer, setTimer] = useState(0);
  const [timerId, setTimerId] = useState(null);

  const fetchTime = () => {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const now = new Date();
    const formattedDate = now.toLocaleDateString(undefined, {
      timeZone: userTimeZone,
    });
    const formattedTime = now.toLocaleTimeString(undefined, {
      timeZone: userTimeZone,
    });
    setCurrentDate(formattedDate);
    setCurrentTime(formattedTime);
  };

  useEffect(() => {
    // Fetch time initially
    fetchTime();

    // Set up interval to fetch time every second (adjust the interval as needed)
    const intervalId = setInterval(fetchTime, 1000); // 1000 milliseconds = 1 second

    // Clear the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array means this effect runs once when the component mounts

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
          console.error('Error getting location:', error.message);
        }
      );
    }
  
    // Start the timer
    const newTimerId = setInterval(() => {
      setTimer((prevTimer) => prevTimer + 1);
    }, 1000); // 1000 milliseconds = 1 second
  
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
          saveTimer(timer, { latitude, longitude });
        },
        (error) => {
          console.error('Error getting location:', error.message);
          saveTimer(timer);
        }
      );
    } else {
      // Use the previously fetched location
      saveTimer(timer);
    }
  };
  

  const clockOut = () => {
    // Call the backend API to save the last working time
    saveTimer(timer);

    // Stop the timer
    clearInterval(timerId);
  };

  const saveTimer = (timerValue, location) => {
    // Include location information in the request body if available
    const requestBody = {
      username,
      workingTime: timerValue,
      location: location || null,
    };
  
    fetch('https://tnapp.onrender.com/api/saveWorkingTime', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.message);
      })
      .catch((error) => {
        console.error('Error saving working time:', error.message);
      });
  };

  const resetTimer = () => {
    // Stop the timer
    clearInterval(timerId);

    // Reset the timer to 00:00:00
    setTimer(0);
  };

  return (
    <>
      <header>
        <nav>
          <p>Welcome, {username}!</p>
          <button onClick={() => navigate('/LogIn')}>Log Out</button>
        </nav>
      </header>
      <main className='mains'>
        <h1>
          <p>Current Date: {currentDate}</p>
          <p>Current Time: {currentTime}</p>
        </h1>

        <h2>Your Current Working Time:</h2>

        <div className="time-container">
          <h3>{formatTime(timer)}</h3>

          <button onClick={() => { startTimer(); clockIn(); }}>Clock In</button>
          <button onClick={clockOut}>Clock Out</button>
          <button style={{background: 'red'}} onClick={resetTimer}>Reset</button>
        </div>
      </main>
    </>
  );
};

// Helper function to format seconds into HH:MM:SS
const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

export default Workers;
