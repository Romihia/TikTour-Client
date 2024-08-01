import React, { useState } from 'react';
import { PlayLessonOutlined, TagOutlined } from '@mui/icons-material';
import Hashtag from "./Hashtag";


const HashtagsTextField = ({ setHashtags, hashtags, onSavingHashtag }) => {
  const [selectedHashtag, setSelectedHashtag] = useState("");

  const handleChange = (event) => {
    setSelectedHashtag(event.target.value);
  };

  const handleSave = () => {
    const trimmedHashtag = selectedHashtag.trim();
    if (trimmedHashtag && !hashtags.includes(trimmedHashtag)) {
      setHashtags([...hashtags, trimmedHashtag]);
      setSelectedHashtag("");
      onSavingHashtag(trimmedHashtag);
    }
  };

  const handleDelete = (hashtagToDelete) => {
    setHashtags(hashtags.filter(hashtag => hashtag !== hashtagToDelete));
  };

  const buttonStyle = {
    cursor: 'pointer',
    borderRadius: '10px',
    backgroundColor: 'black',
    borderWidth: '0',
    margin: '3px',
    transition: 'background-color 0.3s ease',
    color: 'white',
    height: '30px', 
  };

  const inputStyle = {
    backgroundColor: '#eeeeee',
    borderRadius: '50px',
    padding: '1rem', // Corrected from `p`
    width: '60%',
    borderWidth: '0',
    height: '60px',
    textAlign: 'center',
    lineHeight: '60px' // Match this to the height of the input for vertical centering
  };
  


  const hashtagsContainerStyle = {
    marginTop: '10px',
    display: 'flex',
    flexWrap: 'wrap', // Allow hashtags to wrap to the next line
  };

  const hashtagStyle = {
    color: 'red',
    marginBottom: '5px',
    display: 'flex',
    alignItems: 'center',
    marginRight: '10px', // Space between hashtags
    backgroundColor: '#f5f5f5', // Optional: background color to highlight the hashtag
    padding: '5px',
    borderRadius: '5px',
  };

  const deleteButtonStyle = {
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    color: 'red',
    marginLeft: '10px',
    fontSize: '16px',
  };

  return (
    <div style={{ margin: '5px', borderRadius: '1px' }}>
      <input
        type="text"
        placeholder="Enter a Hashtag"
        value={selectedHashtag}
        onChange={handleChange}
        style={inputStyle}
      />
      <button style={buttonStyle} onClick={handleSave}>
        Save Hashtag
      </button>

      {hashtags.length > 0 &&
        <>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: '0.5rem',
            borderRadius: '5px',
            fontWeight: 'bold',
            width: 'fit-content',
            lineBreak: 'normal'
          }}>
            <TagOutlined style={{ color: 'red'}}/>
            <p style={{ color: 'red', marginRight: '5px', fontWeight: 'bold' }}>Hashtags: </p>
          </div>
          <div>
            <ul style={{
              display: 'flex',
              listStyleType: "none",
              gap: "0.5rem",
              width: "fit-content",
              padding: '1px',
              flexWrap: 'wrap',
            }}>
              {hashtags.map((hashtag, index) => (
                <Hashtag
                  key={index}
                  place={index}
                  hashtag={hashtag}
                  onDelete={() => {
                    // Remove the hashtag from the list according to the key index
                    const updatedList = [...hashtags];
                    updatedList.splice(index, 1);
                    setHashtags(updatedList);
                  }}
                />
              ))}
            </ul>
          </div>
        </>
      }
    </div>
  );
};

export default HashtagsTextField;
