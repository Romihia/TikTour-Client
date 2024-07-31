import React, { useEffect, useState } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import Navbar from 'scenes/navbar';

const AboutPage = () => {
  const { palette } = useTheme();
  const [aboutHtml, setAboutHtml] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_URL_BACKEND}/about`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const htmlData = await response.text(); 
        setAboutHtml(htmlData);
      } catch (error) {
        setError('Network error: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error: {error}</Typography>;

  return (
    <Box>
      <Navbar />
      <Box sx={{ padding: '2rem', backgroundColor: palette.background.alt }}>
        <Typography variant="h2" sx={{ marginBottom: '1rem', color: palette.primary.main }}>
          About Us
        </Typography>
        <Box
          component="div"
          sx={{ marginTop: '1rem' }}
          dangerouslySetInnerHTML={{ __html: aboutHtml }} // הצג את ה-HTML
        />
      </Box>
    </Box>
  );
};

export default AboutPage;
