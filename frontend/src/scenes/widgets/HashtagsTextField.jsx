import React, { useState } from 'react';

const HashtagsTextField = ({ onSavingHashtag }) => {
  const [selectedHashtag, setSelectedHashtag] = useState("#");

  const handleChange = (event) => {
    const inputValue = event.target.value;
    setSelectedHashtag(inputValue);
  };

  const handleSave = () => {
    onSavingHashtag(selectedHashtag); // Pass the selectedHashtag to the parent component
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
        placeholder="Enter a Hashtag"
        value={selectedHashtag} // Bind the input value to state
        onChange={handleChange} // Use handleChange to update state
        style={inputStyle}
      />
      <button style={ buttonStyle }
        onClick={handleSave}
      >
        Save Hashtag
      </button>
    </div>
  );
};

export default HashtagsTextField;
