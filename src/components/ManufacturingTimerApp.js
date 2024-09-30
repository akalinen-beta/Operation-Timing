import React, { useState, useEffect, useRef } from 'react';
import { uptimeCategories, unuptimeCategories } from './categories';
import TimerButton from './TimerButton';
import TimerEntries from './TimerEntries';
import ControlPanel from './ControlPanel';

// Global variable for minimum timer duration
const MINIMUM_TIMER_DURATION = 5; // seconds

const ManufacturingTimerApp = () => {
  const [timers, setTimers] = useState({});
  const [activeTimer, setActiveTimer] = useState(null);
  const [timeEntries, setTimeEntries] = useState([]);
  const [lastPressTime, setLastPressTime] = useState(0); // To track the time the button was last pressed
  const [previousTimerValue, setPreviousTimerValue] = useState(null); // Store the previous timer value before the button press

  const timersRef = useRef(timers);
  const activeTimerRef = useRef(activeTimer);

  // Keep references to timers and activeTimer updated to avoid stale values
  useEffect(() => {
    timersRef.current = timers;
    activeTimerRef.current = activeTimer;
  }, [timers, activeTimer]);

  // Start an interval to update the active timer every 100ms (0.1 seconds)
  useEffect(() => {
    let interval;
    if (activeTimer) {
      interval = setInterval(() => {
        setTimers(prevTimers => ({
          ...prevTimers,
          [activeTimer]: (prevTimers[activeTimer] || 0) + 0.1, // Increment by tenths of a second
        }));
      }, 100);
    }

    return () => {
      clearInterval(interval); // Clean up the interval when the activeTimer changes or component unmounts
    };
  }, [activeTimer]);

  // Load saved data on component mount
  useEffect(() => {
    loadSavedData();
  }, []);

  const loadSavedData = () => {
    const savedEntries = localStorage.getItem('timeEntries');
    if (savedEntries) {
      setTimeEntries(JSON.parse(savedEntries));
    }
  };

  const saveTimeEntry = (category, duration, label) => {
    const newEntry = {
      date: new Date().toLocaleString(),
      category,
      duration: roundToTenth(duration), // Round the duration to the nearest tenth of a second
      label: label || '', // Save empty label if "cancel" is pressed
    };
    const updatedEntries = [...timeEntries, newEntry];
    localStorage.setItem('timeEntries', JSON.stringify(updatedEntries));
    setTimeEntries(updatedEntries);
  };

  const exportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,Date,Time,Category,Timer,Label\n";
    timeEntries.forEach(entry => {
      csvContent += `${entry.date},${formatTime(entry.duration)},${entry.category},${entry.duration},${entry.label}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "time_entries.csv");
    document.body.appendChild(link);
    link.click();
  };

  const deleteAllEntries = () => {
    localStorage.removeItem('timeEntries');
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
    } else if (activeTimer && timeElapsed < MINIMUM_TIMER_DURATION) {
      // If less than 5 seconds, revert the timer to the previous value
      setTimers(prevTimers => ({
        ...prevTimers,
        [activeTimer]: previousTimerValue, // Revert to the previous value
      }));
    }

    // Start the new timer or stop the active one
    if (activeTimer !== category) {
      setPreviousTimerValue(timers[category] || 0); // Store the previous value before resetting
      setActiveTimer(category);
    } else {
      setActiveTimer(null);
    }

    // Update the last press time
    setLastPressTime(now);
  };

  const handleResetTimers = () => {
    setTimers({});
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
            activeTimer={activeTimer}
            handleButtonPress={handleButtonPress}
            formatTime={formatTime}
          />
        ))}
      </div>

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
