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

  return (
    <div>
      <input
        type="text"
        placeholder="Enter a location"
        value={selectedLocation} // Bind the input value to state
        onChange={handleChange} // Use handleChange to update state
        style={{ width: '80%', padding: '8px' }}
      />
      <button onClick={handleSave}
      >
        Save Location
      </button>
    </div>
  );
};

export default LocationAutocomplete;
