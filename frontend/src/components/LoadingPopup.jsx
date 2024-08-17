import React from 'react';
import { CircularProgress, Box, Modal, Typography } from'@mui/material';

const LoadingPopup = ({ open }) => {
  return (
    <Modal open={open} aria-labelledby = "loading-title" aria-describedby = "loading-description">
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 300,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderRadius: 2
        }}
      >
      <CircularProgress />
        <Typography id="loading-title" sx={{ mt: 2 }}>
          Loading...
        </Typography>
      </Box>
    </Modal>
  );
};

export default LoadingPopup;
