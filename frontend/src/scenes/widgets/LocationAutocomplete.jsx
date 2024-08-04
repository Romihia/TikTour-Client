import React, { useState } from 'react';

const LocationAutocomplete = ({ onSelectLocation }) => {
  const [selectedLocation, setSelectedLocation] = useState("");
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const inputValue = event.target.value;
    // Regular expression to allow only letters (both lowercase and uppercase) and spaces
    const valid = /^[a-zA-Z0-9\s]*$/.test(inputValue);

    if (valid) {
      setSelectedLocation(inputValue);
      setError(""); // Clear any previous error
    } else {
      setError("Location can only contain letters and spaces.");
    }
  };

  const handleSave = () => {
    if (selectedLocation.trim() === "") {
      setError("Location cannot be empty.");
    } else {
      onSelectLocation(selectedLocation); // Pass the selectedLocation to the parent component
    }
  };

  const buttonStyle = {
    cursor: 'pointer',
    borderRadius: '10px',
    backgroundColor: 'lightblue',
    borderWidth: '1px',
    margin: '3px',
    transition: 'background-color 0.3s ease',
  };

  const inputStyle = { 
    width: '80%',
    padding: '8px',
    backgroundColor: '#eeeeee',
    borderRadius: '10px',
    borderWidth: '0.5px'
  };

  return (
    <div style={{ margin: '5px', borderRadius: '1px' }}>
      <input
        type="text"
        placeholder="Enter a location"
        value={selectedLocation} // Bind the input value to state
        onChange={handleChange} // Use handleChange to update state
        style={inputStyle}
      />
      <button  
        style={buttonStyle}
        onClick={handleSave}
      >
        Save Location
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message if any */}
    </div>
  );
};

export default LocationAutocomplete;
