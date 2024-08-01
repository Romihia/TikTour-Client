import React, { useState, useEffect } from 'react';
import {
  EditOutlined,
  DeleteOutlined,
  AttachFileOutlined,
  GifBoxOutlined,
  ImageOutlined,
  MicOutlined,
  MoreHorizOutlined,
  LocationOnOutlined,
  TagOutlined,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  Typography,
  InputBase,
  useTheme,
  Button,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Dropzone from "react-dropzone";
import UserImage from "components/UserImage";
import WidgetWrapper from "components/WidgetWrapper";
import LocationAutocomplete from "./LocationAutocomplete";
import HashtagsTextField from "./HashtagsTextField";

import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";

const MyPostWidget = ({ picturePath }) => {
  const [hashtagsList, setHashtagsList] = useState([]);
  const dispatch = useDispatch();
  const [isImage, setIsImage] = useState(false);
  const [location, setLocation] = useState(""); // Location state
  const [addedLocation, setAddedLocation] = useState(false);
  const [image, setImage] = useState(null);
  const [post, setPost] = useState("");
  const [showLocationAutocomplete, setShowLocationAutocomplete] = useState(false); // To toggle autocomplete display
  const [showHashtagsTextField, setShowHashtagsTextField] = useState(false);

  const { palette } = useTheme();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const mediumMain = palette.neutral.mediumMain;
  const medium = palette.neutral.medium;

  const handlePost = async () => {
    const formData = new FormData();
    let hashtagsSuffix = " ";
    hashtagsList.forEach((hashtag) => { hashtagsSuffix += '#' + hashtag + ' '; });
    formData.append("userId", _id);
    formData.append("description", post + hashtagsSuffix);
    formData.append("location", location); // Add location to formData
    formData.append("hashtags", hashtagsList.join(',')); // Join hashtags with a delimiter
  
    if (image) {
      formData.append("picture", image);
      formData.append("picturePath", image.name);
    }
  
    const response = await fetch(`${process.env.REACT_APP_URL_BACKEND}/posts`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    let posts = await response.json();

    window.location.reload();

    // Sort posts by createdAt in descending order
    posts = posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
    dispatch(setPosts({ posts }));
    setImage(null);
    setPost("");
    setLocation(""); // Reset location after posting
    setAddedLocation(false);
    setHashtagsList([]); // Clear the hashtags list
    alert("The post was posted successfully!");

    window.location.reload();

    
  };

  return (
    <WidgetWrapper>
      <FlexBetween gap="1.5rem">
        <UserImage image={picturePath} />
        <FlexBetween
          sx={{
            flexDirection: 'column', // Arrange children in a column
            alignItems: 'flex-start', // Align children to start of the cross-axis (horizontal alignment)
            width: '100%' // Ensure the container takes full width
          }}
        >
          <b style={{ color: mediumMain }}>
            <span style={{ color: 'red' }}>* </span>
            Description
          </b>
          <InputBase
            placeholder="What's on your mind..."
            onChange={(e) => setPost(e.target.value)}
            value={post}
            sx={{
              width: "100%", // Full width of the container
              backgroundColor: palette.neutral.light,
              borderRadius: "2rem",
              padding: "1rem 2rem",
              marginTop: "0.5rem" // Add some spacing between the label and the input
            }}
          />
        </FlexBetween>
      </FlexBetween>
      {isImage && (
        <Box
          border={`1px solid ${medium}`}
          borderRadius="5px"
          mt="1rem"
          p="1rem"
        >
          <Dropzone
            acceptedFiles=".jpg,.jpeg,.png"
            multiple={false}
            onDrop={(acceptedFiles) => setImage(acceptedFiles[0])}
          >
            {({ getRootProps, getInputProps }) => (
              <FlexBetween>
                <Box
                  {...getRootProps()}
                  border={`2px dashed ${palette.primary.main}`}
                  p="1rem"
                  width="100%"
                  sx={{ "&:hover": { cursor: "pointer" } }}
                >
                  <input {...getInputProps()} />
                  {!image ? (
                    <p>Add Image Here</p>
                  ) : (
                    <FlexBetween>
                      <Typography>{image.name}</Typography>
                      <EditOutlined />
                    </FlexBetween>
                  )}
                </Box>
                {image && (
                  <IconButton
                    onClick={() => setImage(null)}
                    sx={{ width: "15%" }}
                  >
                    <DeleteOutlined />
                  </IconButton>
                )}
              </FlexBetween>
            )}
          </Dropzone>
        </Box>
      )}

      <Box>
        {addedLocation &&
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '0.5rem',
          borderRadius: '5px',
          fontWeight: 'bold',
          width: 'fit-content'
        }}>
          <LocationOnOutlined />
          <p style={{ color: 'red', marginRight: '5px' }}>Location: </p>
          <p>{location}</p>
        </div>
        }
        {showLocationAutocomplete && (
          <LocationAutocomplete
            onSelectLocation={(selectedLocation) => {
              setLocation(selectedLocation);
              setShowLocationAutocomplete(false); // Hide autocomplete after selection
              setAddedLocation(true);
            }}
          />
        )}
      </Box>

      <Box>
        {showHashtagsTextField && (
          <HashtagsTextField
            setHashtags={setHashtagsList}
            hashtags={hashtagsList}
            onSavingHashtag={(hashtag) => {
              const updatedList = [...hashtagsList];
              updatedList.push(hashtag);
              setHashtagsList(updatedList);
            }}
          />
        )}
      </Box>

      <Divider sx={{ margin: "1.25rem 0" }} />

      <FlexBetween>
        <FlexBetween gap="0.25rem" onClick={() => setIsImage(!isImage)}>
          <ImageOutlined sx={{ color: mediumMain }} />
          <Typography
            color={mediumMain}
            sx={{ "&:hover": { cursor: "pointer", color: medium } }}
          >
            Image
          </Typography>
        </FlexBetween>

        <FlexBetween gap="0.25rem" onClick={() => {
          setShowLocationAutocomplete(!showLocationAutocomplete);
        }}>
          <LocationOnOutlined sx={{ color: mediumMain }} />
          <Typography
            color={mediumMain}
            sx={{ "&:hover": { cursor: "pointer", color: medium } }}
          >
            <b>
              <span style={{ color: 'red' }}>* </span>
              Location
            </b>
          </Typography>
        </FlexBetween>

        <FlexBetween gap="0.25rem" onClick={() => {
          setShowHashtagsTextField(!showHashtagsTextField);
        }}>
          <TagOutlined sx={{ color: mediumMain }} />
          <Typography
            color={mediumMain}
            sx={{ "&:hover": { cursor: "pointer", color: medium } }}
          >
            <b>
              Hashtags
            </b>
          </Typography>
        </FlexBetween>

        <Button
          disabled={!post || !addedLocation}
          onClick={handlePost}
          sx={{
            color: palette.background.alt,
            backgroundColor: palette.primary.main,
            borderRadius: "3rem",
          }}
        >
          POST
        </Button>
      </FlexBetween>
    </WidgetWrapper>
  );
};

export default MyPostWidget;
