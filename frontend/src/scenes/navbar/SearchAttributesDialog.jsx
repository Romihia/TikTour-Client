import React, { useState, useEffect } from 'react';

const widgetStyle = {
  padding: '20px',
  border: '1px solid black',
  margin: '10px',
  borderRadius: '5px',
  backgroundColor: '#f3f3f3',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  transition: 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out',

};

const itemStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '10px',
  transition: 'opacity 0.3s ease-in-out',

};

const allUserAttributes = ["firstName", "lastName", "username", "location"];
const postAttributes = ["userName", "location", "description", "hashtags"];

const buttonStyle = {
  padding: '10px',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '16px',
  margin: '0 5px',
  transition: 'background-color 0.3s ease, transform 0.3s ease',

};

const activeButtonStyle = {
  backgroundColor: 'lightpink',
  transform: 'scale(1.2)',
  transition: 'background-color 0.3s ease',
  outline: 'none',
  transition: 'background-color 0.3s ease, transform 0.3s ease',

};

const SearchAttributesDialog = ({ chosenAttributes, setChosenAttributes }) => {
  const [searchType, setSearchType] = useState('users');

  useEffect(() => {
    console.log("chosen attributes: " + JSON.stringify(chosenAttributes));
  }, [chosenAttributes]);

  useEffect(() => {
    setChosenAttributes({"searchType": searchType});
  }, [searchType]);


  const handleInputChange = (attribute, value) => {
    setChosenAttributes(prevAttributes => {
      if (value === "") {
        const { [attribute]: _, ...rest } = prevAttributes; // Remove the key
        return rest;
      } else {
        return {
          ...prevAttributes,
          [attribute]: value
        };
      }
    });
  };

  const handleSearchTypeChange = (type) => {
    setSearchType(type);
    // Clear attributes when switching search types
    setChosenAttributes({'searchType':type});
  };

  const attributesToShow = searchType === 'users' ? allUserAttributes : postAttributes;

  return (
    <div style={widgetStyle}>
      <div style={{ 
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '10px',
      }}>
        <button 
          style={{
            ...buttonStyle,
            ...(searchType === 'users' ? activeButtonStyle : {})
          }}
          onClick={() => handleSearchTypeChange('users')}
        >
          Search Users
        </button>
        <button 
          style={{
            ...buttonStyle,
            ...(searchType === 'posts' ? activeButtonStyle : {})
          }}
          onClick={() => handleSearchTypeChange('posts')}
        >
          Search Posts
        </button>
      </div>
      {attributesToShow.map((attribute) => (
        <div key={attribute} style={itemStyle}>
          <label>{attribute}</label>
          <input
            type="text"
            value={chosenAttributes[attribute] || ''}
            style={{
                borderRadius: '10px',
                borderWidth: '0.5px',
            }}
            onChange={(e) => handleInputChange(attribute, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
};

export default SearchAttributesDialog;
