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
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";
import Dropzone from "react-dropzone";
import HashtagsTextField from "./HashtagsTextField";
import { useNavigate } from "react-router-dom";

const PostWidget = ({
  postId,
  postUserId,
  sharedById,
  name,
  description,
  location,
  pictureId,
  userPictureId,
  hashtags,
  likes,
  dislikes,
}) => {
  console.log("pictureId", pictureId);
  console.log("userPictureId", userPictureId);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const loggedInUsername = useSelector((state) => state.user.username);

  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;
  const isDisLiked = Boolean(dislikes[loggedInUserId]);
  const disLikeCount = Object.keys(dislikes).length;

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const [isEditing, setIsEditing] = useState(false);
  const [editDescription, setEditDescription] = useState(description);
  const [editPictureId, setEditPictureId] = useState(pictureId);
  const [editHashtags, setEditHashtags] = useState(hashtags);
  const [editLocation, setEditLocation] = useState(location);
  const [selectedFile, setSelectedFile] = useState(null);
  useEffect(() => {
    const fetchPicture = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_URL_BACKEND}/picture/${pictureId}`, {
          method: "GET"
        });
        if (response.ok) {
          setEditPictureId(response.url);
        }
      } catch (error) {
        console.error("Error fetching user picture:", error);
      }
    };

    fetchPicture();
  }, [editPictureId]);
  console.log(` picture`, editPictureId);

  const [sharedByUsername, setSharedByUsername] = useState("");

  useEffect(() => {
    const fetchSharedByUsername = async () => {
      if (sharedById) {
        try {
          const response = await fetch(`${process.env.REACT_APP_URL_BACKEND}/users/${sharedById}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.ok) {
            const userData = await response.json();
            setSharedByUsername(userData.username);
          }
        } catch (error) {
          console.error("Failed to fetch username:", error);
        }
      }
    };
    fetchSharedByUsername();
  }, [sharedById, token]);

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

  const handleFileChange = (acceptedFiles) => {
    setSelectedFile(acceptedFiles[0]);
  };

  const uploadImage = async () => {
    if (!selectedFile) return null;

    const formData = new FormData();
    formData.append("picture", selectedFile);

    const response = await fetch(`${process.env.REACT_APP_URL_BACKEND}/picture/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      return data.fileId;
    } else {
      console.error("Failed to upload image:", response.statusText);
      return null;
    }
  };

  const editPost = async () => {
    let uploadedPictureId = editPictureId;

    if (selectedFile) {
      uploadedPictureId = await uploadImage();
    }

    const formData = {
      id: postId,
      userId: postUserId,
      description: editDescription,
      location: editLocation,
      hashtags: editHashtags,
      pictureId: uploadedPictureId ? uploadedPictureId : pictureId,
    };

    const response = await fetch(`${process.env.REACT_APP_URL_BACKEND}/posts/${postId}/edit`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const editedPost = await response.json();
    dispatch(setPost({ post: editedPost }));

    setIsEditing(false);
    setEditDescription(editDescription);
    setEditLocation(editLocation);
    setEditHashtags(editHashtags);
    alert("The post was edited successfully!");
  };

  const renderImagePreview = () => {
    if (isEditing) {
      if (!editPictureId && !selectedFile) {
        return <p>Add Image Here</p>;
      }

      const imageUrl = selectedFile ? URL.createObjectURL(selectedFile) : `${editPictureId}`;
      
      console.log("loading image url: " + imageUrl);
      return (
        <FlexBetween>
          <Typography>{selectedFile ? selectedFile.name : editPictureId}</Typography>
          <img src={imageUrl} alt="preview" style={{ width: "30%", height: "auto", borderRadius: "0.75rem", marginTop: "0.75rem" }} />
        </FlexBetween>
      );
    } else {
      if (!editPictureId) {
        return null;
      }

      const imageUrl = `${editPictureId}`;
      return (
        <FlexBetween>
          <img src={imageUrl} alt="preview" style={{ width: "40%", height: "auto", borderRadius: "0.75rem", display: "block", margin: "auto" }} />
        </FlexBetween>
      );
    }
  };

  const styles = {
    editBox: {
      width: "100%",
      backgroundColor: "white",
      borderRadius: "2rem",
      padding: "1rem 2rem",
      marginTop: "0.5rem",
      borderStyle: "dotted",
      borderWidth: "3px",
      transition: "all 0.2s ease-in-out",
    },
    editBoxChild: {
      margin: "15px",
    },
  };

  return (
    <WidgetWrapper m="2rem 0">
      {sharedById !== "" && sharedById !== undefined && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
            backgroundColor: palette.primary.main,
            color: "white",
            width: "fit-content",
            padding: "5px 10px",
            borderRadius: "2rem",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
            cursor: "pointer",
          }}
        >
          <span
            onClick={() => {
              navigate(`/profile/${sharedById}`);
              navigate(0);
            }}
          >
            Shared by {sharedByUsername}
          </span>
        </div>
      )}
      <Following userId={postUserId} name={name} subtitle={location} userPictureId={userPictureId} />
      {isEditing ? (
        <Box style={styles.editBox}>
          <div style={styles.editBoxChild}>
            <b>Description: </b>
            <InputBase
              placeholder="Edit description..."
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              sx={{ width: "100%", backgroundColor: palette.neutral.light, borderRadius: "2rem", padding: "1rem 2rem", marginTop: "0.5rem" }}
            />
          </div>
          <div style={styles.editBoxChild}>
            <b>Image:</b>
            <Dropzone acceptedFiles=".jpg,.jpeg,.png" multiple={false} onDrop={handleFileChange}>
              {({ getRootProps, getInputProps }) => (
                <FlexBetween>
                  <Box
                    {...getRootProps()}
                    backgroundColor={`${palette.neutral.light}`}
                    borderRadius={"50px"}
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
          <div style={styles.editBoxChild}>
            <b>Location:</b>
            <InputBase
              placeholder="Edit location..."
              value={editLocation}
              onChange={(e) => setEditLocation(e.target.value)}
              sx={{ width: "100%", backgroundColor: palette.neutral.light, borderRadius: "2rem", padding: "1rem 2rem", marginTop: "0.5rem" }}
            />
          </div>
          <div style={styles.editBoxChild}>
            <b>Hashtags:</b>
            <HashtagsTextField
              setHashtags={setEditHashtags}
              hashtags={editHashtags}
              onSavingHashtag={(hashtag) => {
                try {
                  const updatedList = editHashtags.length > 0 ? editHashtags : [];
                  updatedList.push(hashtag);
                  setEditHashtags(updatedList);
                } catch (error) {}
              }}
            />
          </div>
          <Button onClick={() => setIsEditing(false)} sx={{ marginTop: "1rem" }}>
            Cancel
          </Button>
          <Button onClick={editPost} sx={{ marginTop: "1rem", backgroundColor: palette.primary.main, color: palette.background.alt }}>
            Save Changes
          </Button>
        </Box>
      ) : (
        <Box>
          <Typography color={main} sx={{ mt: "1rem" }}>
            {description}
            <ul style={{ listStyleType: "none", display: "flex", flexDirection: "row", flexWrap: "wrap", padding: "0" }}>
              {hashtags.map((hashtag) => (
                <li key={hashtag} style={{ margin: "5px" }}>
                  <b style={{ color: main }}>#{hashtag}</b>
                </li>
              ))}
            </ul>
          </Typography>
          {renderImagePreview()}
          <FlexBetween mt="0.25rem">
            <FlexBetween gap="1rem">
              <IconButton onClick={patchLike}>
                {isLiked ? <FavoriteOutlined sx={{ color: primary }} /> : <FavoriteBorderOutlined />}
              </IconButton>
              <Typography>{likeCount}</Typography>

              <IconButton onClick={patchDisike}>
                {isDisLiked ? <ThumbDownOutlined sx={{ color: primary }} /> : <ThumbDownOutlined />}
              </IconButton>
              <Typography>{disLikeCount}</Typography>
            </FlexBetween>
            <FlexBetween gap="1rem">
              {(loggedInUserId === postUserId || loggedInUserId === sharedById) && (
                <IconButton onClick={deletePost}>
                  <DeleteOutline sx={{ color: primary }} />
                </IconButton>
              )}
            </FlexBetween>
            <FlexBetween gap="1rem">
              {loggedInUserId === postUserId && (
                <IconButton onClick={() => setIsEditing(true)}>
                  <EditOutlined sx={{ color: "black" }} />
                </IconButton>
              )}
            </FlexBetween>
            <IconButton
              onClick={() => {
                console.log("logged in user id:", loggedInUserId);
                console.log("LoggedInUsername:", loggedInUsername);
                sharePost(loggedInUserId, loggedInUsername);
              }}
            >
              <ShareOutlined />
            </IconButton>
          </FlexBetween>
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;
