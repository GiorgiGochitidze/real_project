import React, { useEffect, useState } from 'react';

const TimeDisplay = () => {
  const [currentTime, setCurrentTime] = useState(null);

  useEffect(() => {
    const fetchTime = async () => {
      try {
        // Fetch current time from the server or use a third-party API
        const response = await fetch('https://worldtimeapi.org/api/ip');
        const data = await response.json();

        // Get the user's timezone
        const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        // Format the time according to the user's locale and timezone
        const formattedTime = new Date(data.utc_datetime).toLocaleString(undefined, {
          timeZone: userTimeZone,
        });

        setCurrentTime(formattedTime);
      } catch (error) {
        console.error('Error fetching time:', error.message);
      }
    };

    fetchTime();
  }, []);

  return (
    <div>
      <p>Current Time: {currentTime}</p>
    </div>
  );
};

export default TimeDisplay;
