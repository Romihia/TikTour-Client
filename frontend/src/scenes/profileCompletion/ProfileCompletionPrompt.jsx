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
  console.log(userCredntionals.dateOfBirth);
  const [showdateOfBirth, setShowdateOfBirth] = useState(userCredntionals.dateOfBirth);
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSave = async () => {
    try {
      if (selectedFile) {
        const formData = new FormData();
        formData.append("picture", selectedFile);

        const pictureResponse = await fetch(`${process.env.REACT_APP_URL_BACKEND}/users/${userCredntionals._id}/picture`, {
          method: "POST",
          headers: { 
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (!pictureResponse.ok) {
          throw new Error('Image upload failed');
        }

        const pictureData = await pictureResponse.json();
        profile.picturePath = pictureData.picturePath;  // Assuming the backend returns the new picture URL in `picturePath`
      }

      // Update the user profile information
      const response = await fetch(`${process.env.REACT_APP_URL_BACKEND}/users/prompt/${userCredntionals.username}`, {
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
    } catch (error) {
      console.error("Error saving profile:", error);
      setMessage("Failed to save profile. Please try again.");
    }
  };

  const handleSkip = () => {
    console.log('Profile completion skipped');
    onClose();
  };

  const renderProfilePicture = () => {
    if (profile.picturePath) {
      return (
        <img
          src={profile.picturePath}
          alt="Profile"
          style={{ width: '100%', height: '100%', borderRadius: '50%' }}
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
                  console.log("File selected:", acceptedFiles[0]);
                  setSelectedFile(acceptedFiles[0]);
                  setProfile({ ...profile, picturePath: URL.createObjectURL(acceptedFiles[0]) });
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
          {!showdateOfBirth&&(
          <TextField
            label="Date of Birth"  
            type="date"
            name="dateOfBirth"
            value={profile.dateOfBirth}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
            margin="normal"
          />
          )}
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
