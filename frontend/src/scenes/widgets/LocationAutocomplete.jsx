import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LocationAutocomplete = ({ onSelectLocation }) => {
  const [selectedLocation, setSelectedLocation] = useState("");

  const handleChange = (event) => {
    const inputValue = event.target.value;
    setSelectedLocation(inputValue);
  };

  const handleSave = () => {
    if (selectedLocation.trim() !== "")
      onSelectLocation(selectedLocation); // Pass the selectedLocation to the parent component
    else {
      toast.error("Location can't be empty!", {
        position: 'top-center',
        autoClose: 1000, // Toast duration set to 1 second
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
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
