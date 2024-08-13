import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ChangePasswordDialog = ({ open, onClose, onChangePassword, oldPassword, setOldPassword,
newPassword, setNewPassword, confirmNewPassword, setConfirmNewPassword }) => {

  const handleChangePassword = () => {
    if (newPassword !== confirmNewPassword) {
      toast.error("New passwords don't match!", {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }
    onChangePassword(oldPassword, newPassword);
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
          sx={{ mb: '1rem' }}
        />
        <TextField
          margin="dense"
          label="New Password"
          type="password"
          fullWidth
          variant="outlined"
          value={newPassword}
          onChange={(password) => setNewPassword(password.target.value)}
          sx={{ mb: '1rem' }}
        />
        <TextField
          margin="dense"
          label="Confirm New Password"
          type="password"
          fullWidth
          variant="outlined"
          value={confirmNewPassword}
          onChange={(password) => setConfirmNewPassword(password.target.value)}
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
