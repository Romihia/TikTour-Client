import React, { useState, useEffect } from 'react';
import { Button, useTheme } from "@mui/material";
import { 
  PeopleAltOutlined,
  SignpostOutlined,
  Search
 } from "@mui/icons-material";

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
  color: 'white',
  backgroundColor: 'lightpink',
  transform: 'scale(1.2)',
  transition: 'background-color 0.3s ease',
  outline: 'none',
  transition: 'background-color 0.3s ease, transform 0.3s ease',

};

const SearchAttributesDialog = ({ chosenAttributes, setChosenAttributes, advancedSearchOnClick }) => {
  const [searchType, setSearchType] = useState('users');
  const { palette } = useTheme();

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
  const [hover, setHover] = useState(false);

  return (
    <div style={widgetStyle}>
      <div style={{ 
        display: 'flex',
        justifyContent: 'space-evenly',
        marginBottom: '10px',
      }}>
        <button 
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            ...buttonStyle,
            ...(searchType === 'users' ? activeButtonStyle : {})
          }}
          onClick={() => handleSearchTypeChange('users')}
        >
          {searchType === 'users' && <PeopleAltOutlined style={{margin: '5px'}}/>}

          Users
        </button>
        <button 
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            ...buttonStyle,
            ...(searchType === 'posts' ? activeButtonStyle : {})
          }}
          onClick={() => handleSearchTypeChange('posts')}
        >
          {searchType === 'posts' && <SignpostOutlined style={{margin: '5px'}}/>}

          Posts
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
      <Button
        onClick={advancedSearchOnClick}
        variant='contained'
        color= 'primary'
        sx={{
          width: '150px',
          margin: 'auto',
          backgroundColor: 'lightpink',
          borderRadius: '50px',
          transition: 'all 0.5s ease-in-out', // Adds transition effect
          '&:hover': {
            backgroundColor: palette.primary.main, // Change to desired hover background color
            scale: '1.1',
          },
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {hover ? <Search /> : 'Search by Query'}
      </Button>
    </div>
  );
};

export default SearchAttributesDialog;
