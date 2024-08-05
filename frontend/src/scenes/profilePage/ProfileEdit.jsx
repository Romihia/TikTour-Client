import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Typography, Box } from "@mui/material";
import Dropzone from "react-dropzone";
import { useSelector, useDispatch } from "react-redux";
import { updateUserPicturePath } from "state/index.js"; 

const ProfileCompletionPrompt = ({ open, onClose}) => {
  const dispatch = useDispatch();
  const { _id,firstName,lastName,location,email,picturePath } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const [profile, setProfile] = useState({
    firstName: firstName,
    lastName: lastName,
    location: location,
    email: email,
    picturePath: picturePath || null,
  });


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSave = async () => {
    const response = await fetch(`${process.env.REACT_APP_URL_BACKEND}/users/${_id}`, {
        method: "POST",
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profile),
    });
    if (response.ok) {
      console.log('Profile updated');
      dispatch(updateUserPicturePath({ picturePath: profile.picturePath }));
      onClose();
    } else {
      console.log('Profile update failed');
    }
  };

  const handleSkip = () => {
    console.log('Profile completion skipped');
    onClose();
  };

  const renderProfilePicture = () => {
    if (profile.picturePath) {
      const imageUrl = typeof profile.picturePath === "string"
        ? `${process.env.REACT_APP_URL_BACKEND}/assets/${profile.picturePath}`
        : URL.createObjectURL(profile.picturePath);

      return (
        <img
          src={imageUrl}
          alt="Profile"
          style={{ width: '100%', height: '100%', borderRadius: '50%' }}
          onLoad={() => URL.revokeObjectURL(profile.picturePath)}
        />
      );
    }
    return <Typography color="primary">Upload</Typography>;
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Your Profile</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Box mb={2}>
            <Dropzone 
              onDrop={(acceptedFiles) => {
                if (acceptedFiles && acceptedFiles[0]) {
                  console.log("File uploaded:", acceptedFiles[0].path );
                  setProfile({ ...profile, picturePath: acceptedFiles[0].path });
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
          <TextField
            label="Email"
            name="email"
            value={profile.email}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSkip}>Close</Button>
        <Button onClick={handleSave} color="primary">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProfileCompletionPrompt;
