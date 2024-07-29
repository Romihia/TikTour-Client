import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, CircularProgress, useTheme } from "@mui/material";
import { useSearchParams, useNavigate } from "react-router-dom";
import LoginImage from "../../TiktourLogo.png";

const VerifyEmail = () => {
  const [message, setMessage] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_URL_BACKEND}/auth/verify-email?token=${token}`);
        const data = await response.json();
        setMessage(data.message);
      } catch (error) {
        setMessage('Email verification failed.');
      }
    };
    verifyEmail();
  }, [token]);

  return (
    <Box>
      <Typography variant="h4">Email Verification</Typography>
      {message ? (
        <Typography>{message}</Typography>
      ) : (
        <CircularProgress />
      )}
      <Typography
        onClick={() => navigate("/login")}
        sx={{
          textDecoration: "underline",
          color: "primary.main",
          "&:hover": {
            cursor: "pointer",
            color: "primary.light",
          },
        }}
      >
        Go to Login
      </Typography>
    </Box>
  );
};

const VerifyEmailPage = () => {
  const theme = useTheme();
  return (
    <Box>
      <Box
        width="100%"
        backgroundColor={theme.palette.background.alt}
        p="1rem 6%"
        textAlign="center"
      >
        <Typography fontWeight="bold" fontSize="32px" color="primary">
          TikTour
        </Typography>
      </Box>

      <Grid container style={{ height: 'calc(100vh - 64px)' }}>
        <Grid 
          item 
          xs={12} 
          md={8} 
          style={{ 
            backgroundImage: `url(${LoginImage})`, 
            backgroundSize: 'cover', 
            backgroundPosition: 'center', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
          }}
        >
        </Grid>
        <Grid item xs={12} md={4}>
          <Box
            width="100%"
            p="2rem"
            m="2rem auto"
            borderRadius="1.5rem"
            backgroundColor={theme.palette.background.alt}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            style={{ height: '100%' }}
          >
            <Typography fontWeight="500" variant="h5" sx={{ mb: "1.5rem" }}>
              Welcome to TikTour, the social media for tours and travel!
            </Typography>
            <VerifyEmail />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default VerifyEmailPage;
