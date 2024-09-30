// TimerButton.js
import React, { useEffect } from 'react';

const TimerButton = ({ category, timer, latestElapsedTime, activeTimer, handleButtonPress, formatTime }) => {
  const isActive = activeTimer === category.name;

  const pulseAnimation = {
    animation: isActive ? 'pulse 1s infinite' : 'none',
  };

  useEffect(() => {
    const keyframeStyle = `
      @keyframes pulse {
        0% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4); }
        50% { box-shadow: 0 0 3px 5px rgba(255, 255, 255, .5); }
        100% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4); }
      }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerText = keyframeStyle;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  return (
    <button
      className="timer-button"
      style={{
        backgroundColor: category.color,
        color: 'white',
        padding: '10px',
        aspectRatio: '1 / 1',
        border: 'none',
        ...pulseAnimation, // Apply pulse animation dynamically
        fontSize: '1.2em',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        maxWidth: '150px',
        maxHeight: '150px',
        width: '100%',
        height: '100%',
        transition: 'all 0.3s ease-in-out',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '8px',
      }}
      onClick={() => handleButtonPress(category.name)}
    >
      <span style={{ fontSize: '2.5em' }}>{category.emoji}</span>
      <span>{category.name}</span>
      {/* Display latest elapsed time */}
      <span style={{ fontSize: '.9em' }}>{formatTime(latestElapsedTime || 0)}</span>
      {/* Display total elapsed time */}
      {/* <span style={{ fontSize: '.6em' }}>Total: {formatTime(timer || 0)}</span> */}
    </button>
  );
};

export default TimerButton;
