import React from 'react';

const ControlPanel = ({ handleResetTimers, exportCSV, deleteAllEntries }) => {
  // Handles the click of "Delete All Entries" button
  const handleDeleteClick = () => {
    const confirmation = window.confirm("Are you sure you want to delete all entries?");
    if (confirmation) {
      const password = window.prompt("Please enter password to delete all entries:", "1234");
      if (password === '1234') {
        deleteAllEntries(); // Call delete function if correct password is entered
        alert('All entries deleted.');
      } else {
        alert('Incorrect password.');
      }
    }
  };

  return (
    <div style={{ marginTop: '30px', textAlign: 'center' }}>
      {/* Reset Timers Button */}
      <button 
        onClick={handleResetTimers} 
        style={{
          padding: '10px 10px',
          fontSize: '1.2em',
          backgroundColor: 'yellow',
          color: 'black',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer'
        }}
      >
        Reset Timers
      </button>

      {/* Download CSV and Delete All Entries Buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
        <button 
          onClick={exportCSV} 
          style={{
            padding: '10px 20px',
            fontSize: '1.2em',
            backgroundColor: 'black',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Download CSV
        </button>

        <button 
          onClick={handleDeleteClick} 
          style={{
            padding: '10px 20px',
            fontSize: '1.2em',
            backgroundColor: 'black',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Delete All Entries
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;