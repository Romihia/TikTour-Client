import { light } from '@mui/material/styles/createPalette';
import React, { useState } from 'react';

const LocationAutocomplete = ({ onSelectLocation }) => {
  const [selectedLocation, setSelectedLocation] = useState("");

  const handleChange = (event) => {
    const inputValue = event.target.value;
    setSelectedLocation(inputValue);
  };

  const handleSave = () => {
    onSelectLocation(selectedLocation); // Pass the selectedLocation to the parent component
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
    <div style= {{
      margin: '5px',
      borderRadius: '1px',
      }}>
      <input
        type="text"
        placeholder="Enter a location"
        value={selectedLocation} // Bind the input value to state
        onChange={handleChange} // Use handleChange to update state
        style={ inputStyle }
      />
      <button  
      style={buttonStyle}
      onClick={handleSave}
      >
        Save Location
      </button>
    </div>
  );
};

export default LocationAutocomplete;
