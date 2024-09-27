import React, { useState } from 'react';

const TimerEntries = ({ timeEntries, formatTime }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <h2 
        style={{ 
          fontFamily: 'Titillium Web, sans-serif', 
          color: '#bdc3c7',
          cursor: 'pointer',
          userSelect: 'none'
        }}
        onClick={toggleCollapse}
      >
        Time Entries ({timeEntries.length}) {isCollapsed ? '▲' : '▼'}
      </h2>
      {!isCollapsed && (
        <ul style={{ padding: '0', listStyle: 'none', maxHeight: '300px', overflowY: 'auto' }}>
          {timeEntries.map((entry, index) => (
            <li key={index} style={{
              backgroundColor: '#34495e',
              padding: '15px',
              marginBottom: '10px',
              borderRadius: '5px',
              color: '#ecf0f1',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{entry.label}</div>
              <div style={{ fontSize: '0.9em', color: '#bdc3c7', marginBottom: '10px' }}>{entry.date}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {Object.entries(entry.timers).map(([category, time]) => (
                  <span key={category} style={{ 
                    backgroundColor: '#2c3e50', 
                    padding: '5px 10px', 
                    borderRadius: '3px',
                    fontSize: '0.9em'
                  }}>
                    {category}: {formatTime(time)}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TimerEntries;