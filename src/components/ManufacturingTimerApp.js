import React, { useState, useEffect, useCallback, useRef } from 'react';
import { uptimeCategories, unuptimeCategories } from './categories';
import TimerButton from './TimerButton';
import TimerEntries from './TimerEntries';
import ControlPanel from './ControlPanel';

const ManufacturingTimerApp = () => {
  const [timers, setTimers] = useState({});
  const [activeTimer, setActiveTimer] = useState(null);
  const [timeEntries, setTimeEntries] = useState([]);
  const [showSavePopup, setShowSavePopup] = useState(false);

  // Use refs to store the latest state values without causing effect re-runs
  const timersRef = useRef(timers);
  const activeTimerRef = useRef(activeTimer);

  // Update refs when state changes
  useEffect(() => {
    timersRef.current = timers;
    activeTimerRef.current = activeTimer;
  }, [timers, activeTimer]);

  // Function to save the current state to localStorage
  const saveStateToLocalStorage = useCallback(() => {
    console.log("Saving state to localStorage");
    localStorage.setItem('timers', JSON.stringify(timersRef.current));
    localStorage.setItem('activeTimer', activeTimerRef.current);
    localStorage.setItem('lastUpdateTime', Date.now().toString());

    // Show the "Timer state saved" popup
    //setShowSavePopup(true);
    setTimeout(() => {
      setShowSavePopup(false); // Hide after 2 seconds
    }, 500);
  }, []); // Empty dependency array as it now uses refs

  // Load saved state from localStorage when the app starts
  useEffect(() => {
    console.log("Loading saved state from localStorage");
    const savedTimers = JSON.parse(localStorage.getItem('timers')) || {};
    const savedActiveTimer = localStorage.getItem('activeTimer') || null;
    const savedLastUpdateTime = localStorage.getItem('lastUpdateTime') || null;

    if (savedTimers && savedActiveTimer && savedLastUpdateTime) {
      const timeSinceLastUpdate = (Date.now() - parseInt(savedLastUpdateTime)) / 1000; // in seconds
      console.log("Time since last update:", timeSinceLastUpdate);

      // Update the timer for the active timer to include the time passed while the app was closed
      if (savedActiveTimer && savedTimers[savedActiveTimer] != null) {
        savedTimers[savedActiveTimer] = (savedTimers[savedActiveTimer] || 0) + timeSinceLastUpdate;
      }

      setTimers(savedTimers);
      setActiveTimer(savedActiveTimer);
    }

    loadSavedData(); // Load the previous time entries
  }, []);

  // Save the current state of timers and active timer, regardless of active timer
  useEffect(() => {
    console.log("Setting up interval to save state");
    const saveInterval = setInterval(saveStateToLocalStorage, 2000); // Save every 5 seconds

    return () => clearInterval(saveInterval); // Clean up on unmount
  }, [saveStateToLocalStorage]); // Include saveStateToLocalStorage in the dependency array

  // Update the active timer every 100ms (tenths of a second)
  useEffect(() => {
    if (activeTimer) {
      const interval = setInterval(() => {
        setTimers(prevTimers => ({
          ...prevTimers,
          [activeTimer]: (prevTimers[activeTimer] || 0) + 0.1
        }));
      }, 100); // Update every 100ms

      return () => clearInterval(interval); // Clean up when the timer stops
    }
  }, [activeTimer]);

  const loadSavedData = () => {
    const savedEntries = localStorage.getItem('timeEntries');
    if (savedEntries) {
      setTimeEntries(JSON.parse(savedEntries));
    }
  };

  const saveTimeEntry = (entry) => {
    const updatedEntries = [...timeEntries, entry];
    localStorage.setItem('timeEntries', JSON.stringify(updatedEntries));
    setTimeEntries(updatedEntries);
  };

  const handleButtonPress = (category) => {
    setActiveTimer(activeTimer === category ? null : category);
  };

  const handleResetTimers = () => {
    const label = window.prompt("Please enter a label for this entry:");
    if (label) {
      const newEntry = {
        date: new Date().toLocaleString(),
        timers: { ...timers },
        label
      };
      saveTimeEntry(newEntry);
      setTimers({});
      setActiveTimer(null);
    } else {
      alert('Label is required to reset timers.');
    }
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const tenths = Math.floor((seconds % 1) * 10);
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${tenths}`;
  };

  const exportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,Date,Category,Time,Label\n";
    timeEntries.forEach(entry => {
      Object.entries(entry.timers).forEach(([category, time]) => {
        csvContent += `${entry.date},${category},${formatTime(time)},${entry.label}\n`;
      });
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "time_entries.csv");
    document.body.appendChild(link); // Required for FF
    link.click();
  };

  const deleteAllEntries = () => {
    localStorage.removeItem('timeEntries');
    setTimeEntries([]);
  };

  return (
    <div style={{
      paddingTop: '1px', // Reduced top padding
      paddingBottom: '30px', // Increased bottom padding
      paddingLeft: '20px',
      paddingRight: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#2c3e50',
      color: '#ecf0f1',
      minHeight: '100vh'
    }}>

    {/* Popup for timer state saved */}
    {showSavePopup && (
      <div style={{
        position: 'fixed',
        top: '10px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'grey',
        color: 'white',
        padding: '10px 20px',
        borderRadius: '5px',
        zIndex: 1000,
        fontSize: '1em',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        transition: 'opacity 0.5s ease-in-out'
      }}>
        Timer state saved
      </div>
    )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Titillium+Web:wght@400;600&display=swap');
      `}</style>

    <h2 style={{ 
        fontFamily: 'Titillium Web, sans-serif', 
        color: '#bdc3c7',
        marginBottom: '10px' // Add this line to reduce space below the heading
      }}>Uptime</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
        gap: '20px',
        marginBottom: '20px' // Add this line to create space between sections
      }}>
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

      <h2 style={{ 
        fontFamily: 'Titillium Web, sans-serif', 
        color: '#bdc3c7',
        marginBottom: '10px', // Add this line to reduce space below the heading
        marginTop: '30px' // Add this line to create space above the heading
      }}>Downtime</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
        gap: '20px'
      }}>
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
        handleRequestLabel={handleResetTimers}
        exportCSV={exportCSV}
        deleteAllEntries={deleteAllEntries}
      />

      <TimerEntries timeEntries={timeEntries} formatTime={formatTime} />
    </div>
  );
};

export default ManufacturingTimerApp;
