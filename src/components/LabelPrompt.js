import React from 'react';

const LabelPrompt = ({ label, setLabel, handleResetTimers }) => {
  return (
    <div style={{
      position: 'fixed', 
      top: '50%', 
      left: '50%', 
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      zIndex: 1000 // Ensures it appears on top
    }}>
      <h3>Please enter a label for this entry:</h3>
      <input
        type="text"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        style={{
          padding: '10px',
          width: '100%',
          marginBottom: '20px',
          fontSize: '1em',
          border: '1px solid #bdc3c7',
          borderRadius: '4px'
        }}
      />
      <button 
        onClick={handleResetTimers} 
        style={{
          padding: '10px 20px',
          backgroundColor: '#3498db',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '1.2em'
        }}
      >
        Submit Label & Reset
      </button>
    </div>
  );
};

export default LabelPrompt;
