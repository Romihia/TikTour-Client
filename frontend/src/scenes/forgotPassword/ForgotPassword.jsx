import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from "@mui/material";

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_URL_BACKEND}/auth/request-password-reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      setMessage('Error sending reset email');
    }
  };

  return (
    <Box>
      <Typography variant="h4">Forgot Password</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button type="submit" variant="contained" color="primary">Send Reset Link</Button>
      </form>
      {message && <Typography>{message}</Typography>}
    </Box>
  );
};

export default ForgotPassword;
