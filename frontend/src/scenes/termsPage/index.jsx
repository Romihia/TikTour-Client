import React, { useEffect, useState } from 'react';
import { Box, Typography, useTheme } from '@mui/material';

const AboutPage = () => {
  const { palette } = useTheme();
  const [termsHtml, setTermsHtml] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchtermsData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_URL_BACKEND}/terms`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const termsHtml = await response.text(); 
        setTermsHtml(termsHtml);
      } catch (error) {
        setError('Network error: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchtermsData();
  }, []);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error: {error}</Typography>;

  return (
    <Box>
      <Box sx={{ padding: '2rem', backgroundColor: palette.background.alt }}>
        <Typography variant="h2" sx={{ marginBottom: '1rem', color: palette.primary.main }}>
          Terms and Conditions
        </Typography>
        <Box
          component="div"
          sx={{ marginTop: '1rem' }}
          dangerouslySetInnerHTML={{ __html: termsHtml }} // הצג את ה-HTML
        />
      </Box>
    </Box>
  );
};

export default AboutPage;
