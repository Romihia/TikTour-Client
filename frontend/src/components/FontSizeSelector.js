import React, { useState, useEffect } from 'react';
import { Box, Button } from '@mui/material';

const FontSizeSelector = () => {
  const [fontSize, setFontSize] = useState('medium');

  useEffect(() => {
    // Load font size from localStorage
    const storedFontSize = localStorage.getItem('fontSize');
    if (storedFontSize) {
      setFontSize(storedFontSize);
      document.documentElement.style.fontSize = getFontSizeValue(storedFontSize); // Apply the saved font size
    }
  }, []);

  const handleFontSizeChange = (size) => {
    setFontSize(size);
    localStorage.setItem('fontSize', size); // Save the font size to localStorage
    document.documentElement.style.fontSize = getFontSizeValue(size); // Apply the new font size
  };

  const getFontSizeValue = (size) => {
    switch (size) {
      case 'small':
        return '12px';
      case 'medium':
        return '16px';
      case 'large':
        return '20px';
      default:
        return '16px';
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
      <Button
        variant={fontSize === 'small' ? 'contained' : 'outlined'}
        onClick={() => handleFontSizeChange('small')}
      >
        Small
      </Button>
      <Button
        variant={fontSize === 'medium' ? 'contained' : 'outlined'}
        onClick={() => handleFontSizeChange('medium')}
      >
        Medium
      </Button>
      <Button
        variant={fontSize === 'large' ? 'contained' : 'outlined'}
        onClick={() => handleFontSizeChange('large')}
      >
        Large
      </Button>
    </Box>
  );
};

export default FontSizeSelector;
