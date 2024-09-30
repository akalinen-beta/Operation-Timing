import React, { useState, useEffect, useRef } from 'react';
import { uptimeCategories, unuptimeCategories } from './categories';
import TimerButton from './TimerButton';
import TimerEntries from './TimerEntries';
import ControlPanel from './ControlPanel';

// Global variable for minimum timer duration
const MINIMUM_TIMER_DURATION = 5; // seconds

const ManufacturingTimerApp = () => {
  const [timers, setTimers] = useState({});
  const [latestElapsedTime, setLatestElapsedTime] = useState({});
  const [activeTimer, setActiveTimer] = useState(null);
  const [timeEntries, setTimeEntries] = useState([]);
  const [lastPressTime, setLastPressTime] = useState(0); // To track the time the button was last pressed

  const timersRef = useRef(timers);
  const activeTimerRef = useRef(activeTimer);

  // Keep references to timers and activeTimer updated to avoid stale values
  useEffect(() => {
    timersRef.current = timers;
    activeTimerRef.current = activeTimer;
  }, [timers, activeTimer]);

  // Start an interval to update both total and latest elapsed times every 100ms (0.1 seconds)
  useEffect(() => {
    let interval;
    if (activeTimer) {
      interval = setInterval(() => {
        const now = Date.now();
        const timeElapsed = (now - lastPressTime) / 1000;

        setTimers(prevTimers => ({
          ...prevTimers,
          [activeTimer]: (prevTimers[activeTimer] || 0) + 0.1, // Increment total elapsed time
        }));

        setLatestElapsedTime(prevTimes => ({
          ...prevTimes,
          [activeTimer]: timeElapsed, // Update latest elapsed time
        }));
      }, 100);
    }

    return () => {
      clearInterval(interval); // Clean up the interval when the activeTimer changes or component unmounts
    };
  }, [activeTimer, lastPressTime]);

  // Save timers to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('timers', JSON.stringify(timers));
  }, [timers]);

  // Load saved data on component mount
  useEffect(() => {
    loadSavedData();
    loadSavedTimers(); // Load timers when the app loads
  }, []);

  const loadSavedData = () => {
    const savedEntries = localStorage.getItem('timeEntries');
    if (savedEntries) {
      setTimeEntries(JSON.parse(savedEntries));
    }
  };

  const loadSavedTimers = () => {
    const savedTimers = localStorage.getItem('timers');
    if (savedTimers) {
      setTimers(JSON.parse(savedTimers));
    }
  };

  const saveTimeEntry = (category, duration, label) => {
    const newEntry = {
      date: new Date().toLocaleString(),
      category,
      duration: roundToTenth(latestElapsedTime[category]), // Save latest elapsed time, not total time
      label: label || '', // Save empty label if "cancel" is pressed
    };
    const updatedEntries = [...timeEntries, newEntry];
    localStorage.setItem('timeEntries', JSON.stringify(updatedEntries));
    setTimeEntries(updatedEntries);
};

const exportCSV = () => {
  const fileName = window.prompt('Enter a name for the CSV file:', 'time_entries');
  if (!fileName) return; // If the user cancels, do nothing

  let csvContent = "data:text/csv;charset=utf-8,Date,Time, Category,Timer (s),Label\n"; // Added "Time Logged" header
  timeEntries.forEach(entry => {
    csvContent += `${entry.date},${entry.category},${entry.duration},${entry.label}\n`;
  });
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `${fileName}.csv`); // Use the user's input as the file name
  document.body.appendChild(link);
  link.click();
};



  const deleteAllEntries = () => {
    localStorage.removeItem('timeEntries');
    localStorage.removeItem('timers'); // Clear timers from local storage
    setTimers({});
    setTimeEntries([]);
  };

  const roundToTenth = (num) => {
    return Math.round(num * 10) / 10;
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const tenths = Math.floor((seconds % 1) * 10);
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${tenths}`;
  };

  const handleButtonPress = (category) => {
    const now = Date.now();
    const timeElapsed = (now - lastPressTime) / 1000; // Time since the last button press in seconds
  
    // If there is an active timer and more than 5 seconds have passed, save the entry
    if (activeTimer && timeElapsed >= MINIMUM_TIMER_DURATION) {
      const label = window.prompt('Enter label for the previous timer:');
      // Save the entry even if the label is blank (when user presses "Cancel")
      saveTimeEntry(activeTimer, timers[activeTimer], label);
    } 
    // If less than 5 seconds have passed, reset the active timer to zero immediately
    else if (activeTimer && timeElapsed < MINIMUM_TIMER_DURATION) {
      setTimers(prevTimers => ({
        ...prevTimers,
        [activeTimer]: 0, // Reset the timer to zero
      }));
      setLatestElapsedTime(prevTimes => ({
        ...prevTimes,
        [activeTimer]: 0, // Reset the latest elapsed time to zero
      }));
    }
  
    // Start the new timer or stop the active one
    if (activeTimer !== category) {
      setActiveTimer(category); // Start the new timer
      setLatestElapsedTime(prevTimes => ({
        ...prevTimes,
        [category]: 0, // Reset the latest elapsed time for the new category
      }));
    } else {
      setActiveTimer(null); // Stop the active timer
    }
  
    // Update the last press time after label input
    setLastPressTime(now);
  };  
  

  const handleResetTimers = () => {
    const confirmReset = window.confirm('Are you sure you want to reset all timers? This action cannot be undone.');
    if (!confirmReset) return; // If the user cancels, do nothing
  
    setTimers({});
    setLatestElapsedTime({}); // Reset latest elapsed time
    setActiveTimer(null);
  };
  

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#2c3e50', color: '#ecf0f1', minHeight: '100vh' }}>
      <h2 style={{ fontFamily: 'Titillium Web, sans-serif', color: '#bdc3c7' }}>Uptime</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '20px' }}>
        {uptimeCategories.map((cat) => (
          <TimerButton
            key={cat.name}
            category={cat}
            timer={timers[cat.name]}
            latestElapsedTime={latestElapsedTime[cat.name]}
            activeTimer={activeTimer}
            handleButtonPress={handleButtonPress}
            formatTime={formatTime}
          />
        ))}
      </div>

      <h2 style={{ fontFamily: 'Titillium Web, sans-serif', color: '#bdc3c7', marginTop: '30px' }}>Downtime</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '20px' }}>
        {unuptimeCategories.map((cat) => (
          <TimerButton
            key={cat.name}
            category={cat}
            timer={timers[cat.name]}
            latestElapsedTime={latestElapsedTime[cat.name]}
            activeTimer={activeTimer}
            handleButtonPress={handleButtonPress}
            formatTime={formatTime}
          />
        ))}
      </div>
      <h5>(Times less than {MINIMUM_TIMER_DURATION} seconds will not be saved)</h5>
      <ControlPanel
        handleResetTimers={handleResetTimers}
        exportCSV={exportCSV} // Pass the exportCSV function here
        deleteAllEntries={deleteAllEntries} // Pass the deleteAllEntries function here
      />

      <TimerEntries timeEntries={timeEntries} formatTime={formatTime} />
    </div>
  );
};

export default ManufacturingTimerApp;
