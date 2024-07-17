import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import Navbar from "scenes/navbar";

const AboutPage = () => {
  const { palette } = useTheme();

  return (
    <Box>
    <Navbar />
    <Box sx={{ padding: '2rem', backgroundColor: palette.background.alt }}>
      <Typography variant="h2" sx={{ marginBottom: '1rem', color: palette.primary.main }}>
        About EliteNet
      </Typography>
      <Typography variant="h5" sx={{ marginBottom: '1rem' }}>
        Welcome to EliteNet, the premier social network for the top 10% wealthiest individuals. Our platform is designed to foster exclusive social and business connections, offering a range of unique features to enhance your networking experience.
      </Typography>
      <Typography variant="h6" sx={{ marginBottom: '0.5rem' }}>
        Key Features:
      </Typography>
      <ul>
        <li><Typography>Exclusive user profiles with personalized content.</Typography></li>
        <li><Typography>Private discussion groups and events.</Typography></li>
        <li><Typography>Personalized consulting services.</Typography></li>
        <li><Typography>Enhanced security and privacy measures.</Typography></li>
        <li><Typography>AI-powered services for better networking.</Typography></li>
        <li><Typography>Brand collaborations and partnerships.</Typography></li>
      </ul>
      <Typography variant="h6" sx={{ marginTop: '1.5rem', marginBottom: '0.5rem' }}>
        Server Capabilities:
      </Typography>
      <ul>
        <li><Typography>User registration and authentication.</Typography></li>
        <li><Typography>Profile management and updates.</Typography></li>
        <li><Typography>Secure messaging and notifications.</Typography></li>
        <li><Typography>Event creation and management.</Typography></li>
        <li><Typography>Advanced search and recommendation system.</Typography></li>
        <li><Typography>Integration with external services and APIs.</Typography></li>
        <li><Typography>Data analytics and reporting.</Typography></li>
      </ul>
    </Box>
    </Box>
  );
};

export default AboutPage;
