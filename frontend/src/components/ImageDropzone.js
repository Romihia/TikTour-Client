import React, { useState } from 'react';
import { Box, IconButton, Typography, useTheme } from '@mui/material';
import { DeleteOutlined } from '@mui/icons-material';
import Dropzone from 'react-dropzone';

const ImageDropzone = ({ images=[], setImages, maxImages = 10, size = "100px" }) => {
  const { palette } = useTheme();

  const handleDrop = (acceptedFiles) => {
    if (images.length + acceptedFiles.length > maxImages) {
      return alert(`You can only upload up to ${maxImages} images.`);
    }
    setImages((prevImages) => [...prevImages, ...acceptedFiles]);
  };

  const handleRemoveImage = (indexToRemove) => {
    setImages(images.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <Box>
      <Dropzone
        acceptedFiles=".jpg,.jpeg,.png"
        multiple={true}
        onDrop={handleDrop}
      >
        {({ getRootProps, getInputProps }) => (
          <Box
            {...getRootProps()}
            border={`2px dashed ${palette.primary.main}`}
            p="1rem"
            width="100%"
            sx={{ "&:hover": { cursor: "pointer" } }}
          >
            <input {...getInputProps()} />
            <Typography>Add Images Here</Typography>
          </Box>
        )}
      </Dropzone>

      <Box sx={{ marginTop: "1rem" }}>
        {images && images.length > 0 ? (
          images.map((img, idx) => (
            <Box
              key={idx}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "10px",
                border: "1px solid lightgray",
                padding: "10px",
                borderRadius: "8px",
              }}
            >
              <img
                src={URL.createObjectURL(img)}
                alt={`preview-${idx}`}
                style={{ width: size, height: size, borderRadius: "8px" }}
              />
              <IconButton
                onClick={() => handleRemoveImage(idx)}
              >
                <DeleteOutlined />
              </IconButton>
            </Box>
          ))
        ) : (
          <Typography>No Images Added</Typography>
        )}
      </Box>
    </Box>
  );
};

export default ImageDropzone;
