import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Typography, Box } from "@mui/material";
import Dropzone from "react-dropzone";

const ProfileCompletionPrompt = ({ open, onClose, userCredntionals, token }) => {
  const [profile, setProfile] = useState({
    firstName: userCredntionals.firstName,
    lastName: userCredntionals.lastName,
    location: userCredntionals.location,
    dateOfBirth: userCredntionals.dateOfBirth,
    picturePath: userCredntionals.picturePath || null,
  });

  const [message, setMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSave = async () => {
    console.log('********************************************');
    console.log(profile);
    console.log(`${process.env.REACT_APP_URL_BACKEND}/users/prompt/${userCredntionals.username }`);
    const response = await fetch(`${process.env.REACT_APP_URL_BACKEND}/users/prompt/${userCredntionals.username }`, {
      method: "POST",
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profile),
    });
    const data = await response.json();
    if (response.ok) {
      console.log('Profile updated');
      setMessage(data.message);
      onClose();
    } else {
      console.log('Profile update failed');
      setMessage(data.message);
    }
  };

  const handleSkip = () => {
    console.log('Profile completion skipped');
    onClose();
  };

  const renderProfilePicture = () => {
    if (profile.profilePicture) {
      const imageUrl = typeof profile.profilePicture === "string"
        ? `${process.env.REACT_APP_URL_BACKEND}/assets/${profile.profilePicture}`
        : URL.createObjectURL(profile.profilePicture);

      return (
        <img
          src={imageUrl}
          alt="Profile"
          style={{ width: '100%', height: '100%', borderRadius: '50%' }}
          onLoad={() => URL.revokeObjectURL(profile.profilePicture)}
        />
      );
    }
    return <Typography color="primary">Upload</Typography>;
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Complete Your Profile</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Box mb={2}>
            <Dropzone 
              onDrop={(acceptedFiles) => {
                if (acceptedFiles && acceptedFiles[0]) {
                  setProfile({ ...profile, profilePicture: acceptedFiles[0] });
                }
              }}
            >
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
                  {renderProfilePicture()}
                </Box>
              )}
            </Dropzone>
          </Box>
          <TextField
            label="First Name"
            name="firstName"
            value={profile.firstName}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Last Name"
            name="lastName"
            value={profile.lastName}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Location"
            name="location"
            value={profile.location}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
        </Box>
      </DialogContent>
      {message && (
        <Typography color="primary" sx={{ mt: "1rem", textAlign: "center" }}>
          {message}
        </Typography>
      )}
      <DialogActions>
        <Button onClick={handleSkip}>Skip</Button>
        <Button onClick={handleSave} color="primary">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProfileCompletionPrompt;
