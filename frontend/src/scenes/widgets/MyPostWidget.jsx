import React, { useState, useRef, useEffect } from 'react';
import {
  EditOutlined,
  DeleteOutlined,
  ImageOutlined,
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
import UserImage from "components/UserImage";
import WidgetWrapper from "components/WidgetWrapper";
import LocationAutocomplete from "./LocationAutocomplete";
import HashtagsTextField from "./HashtagsTextField";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ImageDropzone from "components/ImageDropzone";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import LoadingPopup from'components/LoadingPopup';

const MyPostWidget = ({ picturePath }) => {
  const [loading, setLoading] = useState(false);
  const [hashtagsList, setHashtagsList] = useState([]);
  const [isImage, setIsImage] = useState(false);
  const [location, setLocation] = useState(""); // Location state
  const [addedLocation, setAddedLocation] = useState(false);
  const [postImagesList, setPostImagesList] = useState([]);
  const [post, setPost] = useState("");
  const [showLocationAutocomplete, setShowLocationAutocomplete] = useState(false); // To toggle autocomplete display
  const [showHashtagsTextField, setShowHashtagsTextField] = useState(false);

  const { palette } = useTheme();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const mediumMain = palette.neutral.mediumMain;
  const medium = palette.neutral.medium;

  const textAreaRef = useRef(null);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.scrollLeft = 10; // Move scroll pane 10 pixels to the right
    }
  }, [post]); // This effect runs whenever the post text changes

  const handlePost = async () => {
    setLoading(true);
    try {
      const formData = new FormData(); 
      formData.append("userId", _id);
      formData.append("sharedById", "");
      formData.append("description", post);
      formData.append("location", location);
      formData.append("hashtags", JSON.stringify(hashtagsList)); // Convert hashtags array to string
  
      if (postImagesList && postImagesList.length > 0) {
        postImagesList.forEach((img) => {
          formData.append("pictures", img); // Add images to the 'pictures' field
        });
      }
  
      const response = await fetch(`${process.env.REACT_APP_URL_BACKEND}/posts`, {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
  
      let posts = await response.json();
      toast.success("The post was posted successfully!", {
        position: 'top-center',
        autoClose: 700,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      setTimeout(() => {
        window.location.reload();
      }, 750);
    } catch (error) {
      console.error("Error uploading post:", error);
    }finally {
      setLoading(false); 
    }
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
          <textarea
            ref={textAreaRef} // Add ref to access the DOM element
            placeholder="What's on your mind..."
            onChange={(e) => setPost(e.target.value)}
            value={post}
            style={{
              width: '100%', // Full width of the container
              backgroundColor: palette.neutral.light,
              minHeight: '80px',
              borderRadius: '1rem', // Adjust the border radius
              padding: '1rem 1.5rem', // Adequate padding for text and scroll
              marginTop: '0.5rem', // Spacing between the label and the textarea
              border: 'none', // Removes the default border
              resize: 'vertical', // Allows the user to resize vertically
              overflow: 'auto', // Enables scrolling
              fontFamily: 'inherit', // Ensures consistent font styling with the rest of the UI
              boxSizing: 'border-box', // Ensures padding is included in the width and height
            }}
          />
        </FlexBetween>
      </FlexBetween>

      {isImage && (
        <Box>
          <h1>Upload Your Images</h1>
          <ImageDropzone images={postImagesList} setImages={setPostImagesList} maxImages={10} size="150px" />
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
              console.log("Printing updated list");
              hashtagsList.forEach((hashtag, index) => console.log(hashtag, index));
              console.log("HashtagsList: " , hashtagsList);
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
            <b>
              Image
            </b>
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
        <LoadingPopup open={loading} />
      </FlexBetween>
    </WidgetWrapper>
  );
};

export default MyPostWidget;
