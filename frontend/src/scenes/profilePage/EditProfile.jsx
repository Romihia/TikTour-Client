import React, { useState } from 'react';
import {
  Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, Button, Typography, Switch, Box
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import Dropzone from "react-dropzone";

const ProfileCompletionDialog = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user._id);
  const token = useSelector((state) => state.token);

  // State variables for profile fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [darkTheme, setDarkTheme] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);

  const handleSave = async () => {
    // Prepare JSON payload
    const payload = {
      firstName: firstName || undefined,
      lastName: lastName || undefined,
      email: email || undefined,
      location: location || undefined,
      darkTheme: darkTheme !== undefined ? darkTheme : undefined,
    };

    // Handle profilePicture upload separately if needed
    let pictureUrl = null;
    if (profilePicture) {
      // Assuming there's an endpoint to upload the picture
      const pictureFormData = new FormData();
      pictureFormData.append("profilePicture", profilePicture);

      try {
        const pictureResponse = await fetch(`${process.env.REACT_APP_URL_BACKEND}/${userId}/picture`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: pictureFormData,
        });

        if (!pictureResponse.ok) {
          throw new Error('Picture upload failed');
        }

        const pictureData = await pictureResponse.json();
        pictureUrl = pictureData.url; // Adjust based on your API response
      } catch (error) {
        console.error("Failed to upload profile picture:", error);
      }
    }

    if (pictureUrl) {
      payload.profilePicture = pictureUrl;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_URL_BACKEND}/users/${userId}`, {
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const updatedUser = await response.json();
      window.location.reload();
      onClose();
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Complete Your Profile</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Box mb={2}>
            <Dropzone onDrop={(acceptedFiles) => setProfilePicture(acceptedFiles[0])}>
              {({ getRootProps, getInputProps }) => (
                <Box
                  {...getRootProps()}
                  border="2px dashed #ccc"
                  borderRadius="50%"
                  width={100}
                  height={100}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  sx={{ cursor: 'pointer' }}
                >
                  <input {...getInputProps()} />
                  {profilePicture ? (
                    <img
                      src={URL.createObjectURL(profilePicture)}
                      alt="Profile"
                      style={{ width: '100%', height: '100%', borderRadius: '50%' }}
                    />
                  ) : (
                    <Typography color="primary">Upload</Typography>
                  )}
                </Box>
              )}
            </Dropzone>
          </Box>
          <TextField
            label="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Box display="flex" alignItems="center" mt={2}>
            <Typography>Dark Theme</Typography>
            <Switch
              checked={darkTheme}
              onChange={(e) => setDarkTheme(e.target.checked)}
              color="primary"
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} color="primary">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProfileCompletionDialog;
