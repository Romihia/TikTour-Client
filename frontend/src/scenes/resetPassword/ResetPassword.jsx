import React, { useState } from 'react';
import { Box, Button, TextField, Typography, useTheme } from "@mui/material";
import { useSearchParams, useNavigate } from "react-router-dom";
import * as yup from 'yup';

const invalidChars = /[^A-Za-z\d!@#$%^&*]/g;

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [searchParams] = useSearchParams();
  const { palette } = useTheme();
  const navigate = useNavigate();

  const token = searchParams.get('token');

  const passwordSchema = yup.string()
    .matches(/[A-Z]/, "At least one uppercase letter is required")
    .matches(/[a-z]/, "At least one lowercase letter is required")
    .matches(/\d/, "At least one number is required")
    .min(8, "At least 8 characters are required")
    .max(50, "Maximum 50 characters are allowed")
    .test(
      "invalid-characters",
      "Password must meet the requirements and cannot contain invalid characters: ${invalidChars}",
      function(value) {
        if (!value) return true; // Skip validation if value is undefined
        const invalidCharsFound = value.match(invalidChars);
        if (invalidCharsFound) {
          return this.createError({ message: `Password contains invalid characters: ${invalidCharsFound.join('')}` });
        }
        return true;
      }
    )
    .required("Password is required");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await passwordSchema.validate(newPassword);
      setErrors({});
      
      const response = await fetch(`${process.env.REACT_APP_URL_BACKEND}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();
      setMessage(data.message);
    } catch (err) {
      setErrors({ newPassword: err.message });
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
          error={!!errors.newPassword}
          helperText={errors.newPassword}
          required
          fullWidth
        />
        {message && <Typography>{message}</Typography>}
        <Button
          fullWidth
          type="submit"
          sx={{
            m: "2rem 0",
            p: "1rem",
            backgroundColor: palette.primary.main,
            color: palette.background.alt,
            "&:hover": { color: palette.primary.main },
          }}
        >
          Reset Password
        </Button>
        <Typography
          onClick={() => navigate("/login")}
          sx={{
            textDecoration: "underline",
            color: palette.primary.main,
            "&:hover": {
              cursor: "pointer",
              color: palette.primary.light,
            },
          }}
        >
          Login here.
        </Typography>
      </form>
    </Box>
  );
};

export default ResetPassword;
