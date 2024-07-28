import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from "@mui/material";
import { useSearchParams } from "react-router-dom";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [searchParams] = useSearchParams();

  const token = searchParams.get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_URL_BACKEND}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      setMessage('Error resetting password');
    }
  };

  return (
    <Box>
      <Typography variant="h4">Reset Password</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="New Password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <Button type="submit" variant="contained" color="primary">Reset Password</Button>
      </form>
      {message && <Typography>{message}</Typography>}
    </Box>
  );
};

export default ResetPassword;
