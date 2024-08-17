import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as yup from 'yup';

const invalidChars = /[^A-Za-z\d!@#$%^&*]/g;

const ChangePasswordDialog = ({ open, onClose, onChangePassword, oldPassword, setOldPassword,
newPassword, setNewPassword, confirmNewPassword, setConfirmNewPassword }) => {

  const [errors, setErrors] = useState({});

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
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,50}$/, "Password must meet the requirements:\nAt least one uppercase letter (A-Z).\nAt least one lowercase letter (a-z).\nAt least one number (0-9).\ncan have a special character !@#$%^&*")
    .required("Password is required");

  const handleChangePassword = async () => {
    try {
      await passwordSchema.validate(newPassword);
      setErrors({});

      if (newPassword === oldPassword) {
        toast.error("The new password is already in use, please choose a different password!", {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return;
      }

      if (newPassword !== confirmNewPassword) {
        toast.error("New passwords don't match!", {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return;
      }

      onChangePassword(oldPassword, newPassword);
    } catch (err) {
      setErrors({ newPassword: err.message });
      toast.error(err.message, {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Change Password</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Old Password"
          type="password"
          fullWidth
          variant="outlined"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          error={!!errors.oldPassword}
          helperText={errors.oldPassword}
          sx={{ mb: '1rem' }}
        />
        <TextField
          margin="dense"
          label="New Password"
          type="password"
          fullWidth
          variant="outlined"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          error={!!errors.newPassword}
          helperText={errors.newPassword}
          sx={{ mb: '1rem' }}
        />
        <TextField
          margin="dense"
          label="Confirm New Password"
          type="password"
          fullWidth
          variant="outlined"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          error={!!errors.confirmNewPassword}
          helperText={errors.confirmNewPassword}
          sx={{ mb: '1rem' }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleChangePassword}>Change Password</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChangePasswordDialog;
