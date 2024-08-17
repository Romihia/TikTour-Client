import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';

const PostImagesDisplay = ({ images }) => {
  // Return nothing if there are no images
  if (!images || images.length === 0) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {images.map((image, index) => (
        <Box key={index} sx={{ margin: '5px auto', width: '80%' }}>
          <img
            src={typeof image === 'string' ? image : URL.createObjectURL(image)} // Handle both URLs and File objects
            alt={`Post image ${index + 1}`}
            style={{
              width: '100%',
              height: 'auto', // Keep the aspect ratio
              objectFit: 'cover',
              //borderRadius: '8px', // Optional: adds rounded corners
            }}
          />
        </Box>
      ))}
    </Box>
  );
};

PostImagesDisplay.propTypes = {
  images: PropTypes.array.isRequired, // Array of image paths or File objects
};

export default PostImagesDisplay;
