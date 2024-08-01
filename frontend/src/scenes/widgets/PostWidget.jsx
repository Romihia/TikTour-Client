import {
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
  ThumbDownOutlined,
  DeleteOutline,
  EditOutlined,
} from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme, InputBase, Button } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Following from "components/Following";
import WidgetWrapper from "components/WidgetWrapper";
import { useState, useTransition } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";
import Dropzone from "react-dropzone";
import HashtagsTextField from "./HashtagsTextField";

import { getPosts } from "state";

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  hashtags,
  likes,
  dislikes,
}) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;
  const isDisLiked = Boolean(dislikes[loggedInUserId]);
  const disLikeCount = Object.keys(dislikes).length;

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const [isEditing, setIsEditing] = useState(false);
  const [editDescription, setEditDescription] = useState(description);
  const [editImage, setEditImage] = useState(picturePath);
  const [editHashtags, setEditHashtags] = useState(hashtags); // Add this line if hashtags are stored
  const [editLocation, setEditLocation] = useState(location);

  const patchLike = async () => {
    const response = await fetch(`${process.env.REACT_APP_URL_BACKEND}/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };

  const patchDisike = async () => {
    const response = await fetch(`${process.env.REACT_APP_URL_BACKEND}/posts/${postId}/dislike`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };

  const deletePost = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      const response = await fetch(`${process.env.REACT_APP_URL_BACKEND}/posts/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        dispatch(setPost({ post: await response.json() }));
        window.location.reload();
        alert("Post deleted successfully");
      } else {
        alert("Failed to delete post");
      }
    }
  };

  const editPost = async () => {
    const formData = {
      "id": postId,
      "userId": postUserId,
      "description": editDescription,
      "location": editLocation,
      "hashtags": editHashtags,
      "picturePath": editImage ? editImage : picturePath, // If no new image is provided, use the original picturePath
    };

    console.log("Edit Description: ", editDescription);
    console.log("Edit Location: ", editLocation);
    console.log("Edit Hashtags: ", editHashtags);
    console.log("Edit Image: ", editImage);

    console.log(JSON.stringify(formData));

    const response = await fetch(`${process.env.REACT_APP_URL_BACKEND}/posts/${postId}/edit`, {
      method: "PATCH",
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
     },
      body: JSON.stringify(formData),
    }
    );

    const editedPost = await response.json();
    
    console.log("Edited post description: " + editedPost);
    
    let newPostList = getPosts();
    console.log("newPostList: ", newPostList);
    
    dispatch(setPost({ post: editedPost }));

    setIsEditing(false);
    setEditImage(editImage);
    setEditDescription(editDescription);
    setEditLocation(editLocation); // Reset location after posting
    setEditHashtags(editHashtags); // Clear the hashtags list
    alert("The post was edited successfully!");
  };


  const renderImagePreview = () => {
    if (isEditing) {
      if (!editImage) {
        return <p>Add Image Here</p>;
      }

      const imageUrl = typeof editImage === "string" ? `${process.env.REACT_APP_URL_BACKEND}/assets/${editImage}` : URL.createObjectURL(editImage);

      return (
        <FlexBetween>
          <Typography>{editImage.name || editImage}</Typography>
          <img src={imageUrl} alt="preview" style={{ width: "30%", height: "auto", borderRadius: "0.75rem", marginTop: "0.75rem" }} />
        </FlexBetween>
      );
  } else {
    if (!editImage) {
      return;
    }

    const imageUrl = typeof editImage === "string" ? `${process.env.REACT_APP_URL_BACKEND}/assets/${editImage}` : URL.createObjectURL(editImage);

    return (
      <FlexBetween>
        <img src={imageUrl} alt="preview" style={{ 
          width: "40%",
           height: "auto",
           borderRadius: "0.75rem",
           display: "block",
           margin: "auto"
          }} />
      </FlexBetween>
    );
    return;
  }
  };

  const styles = {
    editBox: {
      width: "100%",
      backgroundColor: 'white',
      borderRadius: "2rem",
      padding: "1rem 2rem",
      marginTop: "0.5rem",
      borderStyle: "dotted",
      borderWidth: "3px",
      transition: 'all 0.2s ease-in-out', // Added transition property
    },
    editBoxChild: {
      margin: '15px'
    }

  };
  return (
    <WidgetWrapper m="2rem 0">
      <Following
        userId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
      />
            {isEditing ? (

        <Box style={styles.editBox}>

          <div style={styles.editBoxChild}><b>Description: </b>
          <InputBase
            placeholder="Edit description..."
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            sx={{ width: "100%", backgroundColor: palette.neutral.light, borderRadius: "2rem", padding: "1rem 2rem", marginTop: "0.5rem" }}
          />
          </div>
          <div style={styles.editBoxChild}><b>Image:</b>
          <Dropzone
            acceptedFiles=".jpg,.jpeg,.png"
            multiple={false}
            onDrop={(acceptedFiles) => setEditImage(acceptedFiles[0].path)}
          >
            {({ getRootProps, getInputProps }) => (
              <FlexBetween>
                <Box
                  {...getRootProps()}
                  backgroundColor={`${palette.neutral.light}`}
                  borderRadius={'50px'}
                  p="1rem"
                  width="100%"
                  sx={{ "&:hover": { cursor: "pointer" } }}
                >
                  <input {...getInputProps()} />
                  {renderImagePreview()}                  
                </Box>
              </FlexBetween>
            )}
          </Dropzone>
          </div>

          <div style={styles.editBoxChild}><b>Location:</b>
          <InputBase
            placeholder="Edit location..."
            value={editLocation}
            onChange={(e) => setEditLocation(e.target.value)}
            sx={{ width: "100%", backgroundColor: palette.neutral.light, borderRadius: "2rem", padding: "1rem 2rem", marginTop: "0.5rem" }}
          />
          </div>

          <div style={styles.editBoxChild}><b>Hashtags:</b>
          <HashtagsTextField
            setHashtags={setEditHashtags}
            hashtags={editHashtags}
            onSavingHashtag={(hashtag) => {
              try {
              const updatedList = editHashtags.length > 0 ? editHashtags : [];
              updatedList.push(hashtag);
              setEditHashtags(updatedList);
              }
              catch (error) {
              }
            }}
          />
          </div>
          <Button onClick={() => setIsEditing(false)} sx={{ marginTop: "1rem" }}>Cancel</Button>
          <Button onClick={editPost} sx={{ marginTop: "1rem", backgroundColor: palette.primary.main, color: palette.background.alt }}>Save Changes</Button>
        </Box>

      ) : (
        <Box>
          <Typography color={main} sx={{ mt: "1rem" }}>
            {description}
            <ul style={{
              listStyleType: "none",
              display: 'flex',
              flexDirection: "row",
              flexWrap: "wrap",
              padding: '0'
            }}>
            {hashtags.map((hashtag) => {
              return (
                <li key={hashtag} style={{ margin: '5px'}}>
                  <b style={{ color: main }}>
                    #{hashtag}
                  </b>
                </li>
              );
            })}
            </ul>
          </Typography>
          {renderImagePreview()}                  
          <FlexBetween mt="0.25rem">
            <FlexBetween gap="1rem">
              <IconButton onClick={patchLike}>
                {isLiked ? (
                  <FavoriteOutlined sx={{ color: primary }} />
                ) : (
                  <FavoriteBorderOutlined />
                )}
              </IconButton>
              <Typography>{likeCount}</Typography>

              <IconButton onClick={patchDisike}>
                {isDisLiked ? (
                  <ThumbDownOutlined sx={{ color: primary }} />
                ) : (
                  <ThumbDownOutlined />
                )}
              </IconButton>
              <Typography>{disLikeCount}</Typography>
            </FlexBetween>
            <FlexBetween gap="1rem">
              {loggedInUserId === postUserId && (
                <IconButton onClick={deletePost}>
                  <DeleteOutline sx={{ color: primary }} />
                </IconButton>
              )}
            </FlexBetween>
            <FlexBetween gap="1rem">
              {loggedInUserId === postUserId && (
                <IconButton onClick={() => setIsEditing(true)}>
                  <EditOutlined sx={{ color: 'black' }} />
                </IconButton>
              )}
            </FlexBetween>
            <IconButton>
              <ShareOutlined />
            </IconButton>
          </FlexBetween>
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;
