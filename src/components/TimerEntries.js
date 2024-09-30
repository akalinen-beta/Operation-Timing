import React, { useState } from 'react';

const TimerEntries = ({ timeEntries, formatTime }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div style={{ padding: '10px', backgroundColor: '#34495e', borderRadius: '10px', marginTop: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ color: '#ecf0f1', fontSize: '18px' }}>Time Entries</h3>
        <button
          onClick={toggleCollapse}
          style={{
            padding: '5px 10px',
            backgroundColor: '#1abc9c',
            border: 'none',
            borderRadius: '5px',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          {isCollapsed ? 'Show' : 'Hide'}
        </button>
      </div>
      {!isCollapsed && (
        <ul style={{ listStyleType: 'none', padding: 0, marginTop: '10px' }}>
        {timeEntries
          .slice() // Create a copy of the array
          .reverse() // Reverse the array to show the latest first
          .map((entry, index) => (
            <li
              key={index}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center', // Ensure content is aligned vertically
                padding: '6px 8px', // Smaller padding for compactness
                marginBottom: '4px',
                backgroundColor: '#2c3e50',
                borderRadius: '6px',
                fontSize: '12px', // Smaller font size for compactness
                color: '#ecf0f1',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                whiteSpace: 'nowrap', // Prevent text from wrapping
              }}
            >
              <span style={{ flex: '1 0 15%', textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {new Date(entry.date).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' })}
              </span>
              <span style={{ flex: '1 0 10%', textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {formatTime(entry.duration)}
              </span>
              <span style={{ flex: '1 0 10%', textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {entry.category}
              </span>
              <span style={{ flex: '1 0 20%', textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {entry.label || 'No Label'}
              </span>
            </li>
          ))}
      </ul>      
      )}
    </div>
  );
};

export default TimerEntries;
