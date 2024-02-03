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
  const [timerStart, setTimerStart] = useState(0);

  const fetchTime = () => {
    const currentDateObj = new Date();
    setCurrentDate(currentDateObj.toDateString());
    setCurrentTime(currentDateObj.toLocaleTimeString());
  };

  useEffect(() => {
    // Fetch time initially
    fetchTime();

    // Check local storage for saved timer value and start time
    const savedTimerValue = parseInt(localStorage.getItem('timerValue'), 10) || 0;
    const savedTimerStart = parseInt(localStorage.getItem('timerStart'), 10) || 0;

    setTimer(savedTimerValue);
    setTimerStart(savedTimerStart);

    // Set up interval to fetch time every second (adjust the interval as needed)
    const intervalId = setInterval(() => {
      fetchTime();

      if (timerStart > 0) {
        const elapsedSeconds = Math.floor((Date.now() - timerStart) / 1000);
        setTimer(savedTimerValue + elapsedSeconds);
      }
    }, 1000);

    // Clear the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, [timerStart]);

  const startTimer = () => {
    clearInterval(timerId);

    if (!navigator.geolocation.fetchedLocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          navigator.geolocation.fetchedLocation = true;
          saveTimer(timer + 1, { latitude, longitude });
        },
        (error) => {
          console.error('Error getting location:', error.message);
          saveTimer(timer + 1);
        }
      );
    } else {
      saveTimer(timer + 1);
    }
  };

  const clockIn = () => {
    if (!timerStart) {
      setTimerStart(Date.now());
      localStorage.setItem('timerStart', String(Date.now()));
    }

    startTimer();
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

    localStorage.setItem('timerValue', String(timerValue));
  };

  const resetTimer = () => {
    clearInterval(timerId);
    setTimer(0);
    setTimerStart(0);
    localStorage.removeItem('timerValue');
    localStorage.removeItem('timerStart');
  };

  return (
    <>
      <header>
        <nav>
          <p>Welcome, {username}!</p>
          <button onClick={() => { resetTimer(); navigate('/LogIn'); }}>Log Out</button>
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

          <button onClick={clockIn}>Clock In</button>
          <button onClick={clockOut}>Clock Out</button>
          <button style={{ background: 'red' }} onClick={resetTimer}>Reset</button>
        </div>
      </main>
    </>
  );
};

const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

export default Workers;
