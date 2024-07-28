import React from "react";
import { Box, Grid, Typography, useTheme } from "@mui/material";
import ForgotPassword from "./ForgotPassword";
import LoginImage from "../../TiktourLogo.png";

const ForgotPasswordPage = () => {
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
            <ForgotPassword />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ForgotPasswordPage;
