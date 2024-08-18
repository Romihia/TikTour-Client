import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Typography, Box } from "@mui/material";
import Dropzone from "react-dropzone";
import { useSelector, useDispatch } from "react-redux";
import { updateUserPicturePath } from "state/index.js";
import { toast, ToastContainer } from 'react-toastify';

const ProfileEditPrompt = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const { _id, firstName, lastName, location, email, picturePath } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const [profile, setProfile] = useState({
    firstName: firstName,
    lastName: lastName,
    location: location,
    email: email,
    picturePath: picturePath || null,
  });
  const [selectedFile, setSelectedFile] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSave = async () => {
    try {
      const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!validEmail.test(profile.email)){
        toast.error("Invalid email", {
            position: 'top-center',
            autoClose: 5000, // Toast duration set to 1 second
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
        throw new Error('Invalid Email');
      }
      if (selectedFile) {
        const formData = new FormData();
        formData.append("picture", selectedFile);

        const pictureResponse = await fetch(`${process.env.REACT_APP_URL_BACKEND}/users/${_id}/picture`, {
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
        profile.picturePath = pictureData.picturePath; // Assuming the backend returns the new picture URL in `picturePath`
        dispatch(updateUserPicturePath({ picturePath: pictureData.picturePath }));
      }
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
        toast.success("Profile updated successfully!", {
          position: 'top-center',
          autoClose: 700, // Toast duration set to 1 second
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setTimeout(() => {
          window.location.reload();
        }, 750);
        onClose();
      } else {
        console.log('Profile update failed');
        toast.error("Email address already in use, profile update failed", {
            position: 'top-center',
            autoClose: 1500, // Toast duration set to 1 second
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
      }
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  const handleSkip = () => {
    console.log('Profile completion skipped');
    onClose();
  };

  const renderProfilePicture = () => {
    if (profile.picturePath) {
      const imageUrl = typeof profile.picturePath === "string"
        ? profile.picturePath
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

export default ProfileEditPrompt;
