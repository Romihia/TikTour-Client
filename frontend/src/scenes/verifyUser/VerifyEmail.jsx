import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography } from '@mui/material';

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get('token');

    const verifyEmail = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_URL_BACKEND}/auth/verify-email`, {
          params: { token },
        });
        setMessage(response.data.message);
        setTimeout(() => navigate('/login'), 3000);
      } catch (error) {
        setMessage(error.response.data.message);
      }
    };

    if (token) {
      verifyEmail();
    }
  }, [location, navigate]);

  return (
    <Box>
      <Typography variant="h2">Email Verification</Typography>
      <Typography>{message}</Typography>
    </Box>
  );
};

export default VerifyEmail;
