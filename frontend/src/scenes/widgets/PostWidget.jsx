import {
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
  ThumbDownOutlined,
  DeleteOutline,
  EditOutlined,
  BookmarkBorder,
  Bookmark
} from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme, InputBase, Button } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Following from "components/Following";
import WidgetWrapper from "components/WidgetWrapper";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";
import HashtagsTextField from "./HashtagsTextField";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DeleteModal from "components/DeleteConfirmation";
import PostImagesDisplay from "components/PostImagesDisplay";
import { AddPhotoAlternateOutlined } from "@mui/icons-material";
import ImageDropzone from "components/ImageDropzone";
import LoadingPopup from'components/LoadingPopup';

import { getPosts, setPosts } from "state";

const PostWidget = ({
  postId,
  postUserId,
  sharedById,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  hashtags,
  likes,
  dislikes,
  isSaved,
}) => {
  //console.log("+++++++++++++++++++++++++++===========================",initialIsSaved,postId);
  const [loading, setLoading] = useState(false);
  //const [isSaved, setIsSaved] = useState(initialIsSaved);
  const sharePost = async (sharedById="") => {
    setLoading(true);
    const formData = {
      userId: postUserId,
      sharedById: sharedById,
      description: description,
      location: location,
      hashtags: hashtags,
      picturePath: picturePath,
    };
  
    console.log(formData);
  
    // Create the post
    const response = await fetch(`${process.env.REACT_APP_URL_BACKEND}/posts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
  
    let posts = await response.json();
    console.log("posts: ", posts);
  
    // Sort posts by createdAt in descending order
    posts = posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    dispatch(setPosts({ posts }));
  
    toast.success("The post was shared successfully!", {
      position: "top-center",
      autoClose: 700,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  
    // Delay the reload until after the toast has been shown for 0.75 seconds
    setTimeout(() => {
      window.location.reload();
    }, 750);
  
    setLoading(false);
  };


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
  const [editImage, setEditImage] = useState(picturePath);
  const [editHashtags, setEditHashtags] = useState(hashtags); // Add this line if hashtags are stored
  const [editLocation, setEditLocation] = useState(location);

  const [sharedByUsername, setSharedByUsername] = useState("");
  
  useEffect(() => {
    const fetchSharedByUsername = async () => {
      if (sharedById) {
        try {
          const response = await fetch(`${process.env.REACT_APP_URL_BACKEND}/users/${sharedById}`, {
            headers: { 
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const userData = await response.json();
            setSharedByUsername(userData.username); // Assume the API returns the user object with a username field
          }
        } catch (error) {
          console.error("Failed to fetch username:", error);
        }
      }
    };
    fetchSharedByUsername();
    //setIsSaved(initialIsSaved);
  }, [sharedById, token]);


  const patchLike = async () => {
    // If the post is not saved and not liked by the user, call saveUnsavePost
    if (!isSaved && !isLiked) {
      await saveUnsavePost();
    }
  
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
  
  const saveUnsavePost = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_URL_BACKEND}/save/${loggedInUserId}/${postId}/saveUnsavePost`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      console.log("Response Status: " + response.status);
  
      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("Failed to save post. Server response:", errorResponse);
        toast.error("Failed to save post!", {
          position: 'top-center',
          autoClose: 1000, // Toast duration set to 1 second
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return; // Exit the function if the request failed
      }
  
      const data = await response.json();
      //setIsSaved(data.isSaved);
  
      
      toast.success(data.message, {
        position: 'top-center',
        autoClose: 700, // Toast duration set to 1 second
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      setTimeout(() => {
        window.location.reload();
      }, 750); // 0.5 second delay
  
    } catch (e) {
      console.error("Failed to save post:", e);
      toast.error("An error occurred!", {
        position: 'top-center',
        autoClose: 1000, // Toast duration set to 1 second
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }finally {
      setLoading(false); 
    }
  };  
  
  const [showModal, setShowModal] = useState(false);

  const handleDeletePost = () => {
    setShowModal(true);
  };
  
  const handleCloseModal = () => {
    setShowModal(false);
  };
  
  const deletePost = async () => {
    setLoading(true); 
    const response = await fetch(`${process.env.REACT_APP_URL_BACKEND}/posts/${postId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      dispatch(setPost({ post: await response.json() }));
      toast.success("Post deleted successfully!", {
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
      

    } else {
      toast.error("Failed to delete post!", {
        position: 'top-center',
        autoClose: 1000, 
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
    handleCloseModal();
    setLoading(false);
  };

  const editPost = async () => {
    setLoading(true);
    const formData = new FormData(); // Use FormData to handle file uploads and JSON data together
    formData.append("id", postId);
    formData.append("userId", postUserId);
    formData.append("description", editDescription);
    formData.append("location", editLocation);
    formData.append("hashtags", JSON.stringify(editHashtags)); // Convert hashtags array to string
    // Initialize arrays to store new images to upload and images to remove
    const imagesToRemove = [];
    const newImages = [];
    console.log("click editPost");
    // Compare `editImage` and `picturePath`
    const editImageSet = new Set(editImage.map(img => (typeof img === "string" ? img : img.name))); // Store image URLs or names of the images in `editImage`
    const picturePathSet = new Set(picturePath.map(img => img)); // Store image URLs from `picturePath`

    // Find images to remove
    picturePath.forEach((existingImage) => {
      if (!editImageSet.has(existingImage)) {
        imagesToRemove.push(existingImage);
      }
    });

    // Find new images to upload
    editImage.forEach((image) => {
      if (typeof image !== "string" && !picturePathSet.has(image.name)) {
        newImages.push(image);
      }
    });

    // Add images to remove to the formData
    imagesToRemove.forEach((imageUrl) => formData.append("imagesToRemove", imageUrl));

    // Add new images to the formData
    if (newImages && newImages.length > 0) {
      newImages.forEach((file) => formData.append("pictures", file));
    }
    console.log(newImages);
    console.log(imagesToRemove);
    if (editLocation.trim() === "") {
      toast.error("Location can't be empty!", {
        position: 'top-center',
        autoClose: 800, 
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }
    // Perform the request
    const response = await fetch(`${process.env.REACT_APP_URL_BACKEND}/posts/${postId}/edit`, {
      method: "PATCH",
      headers: { 
        Authorization: `Bearer ${token}`, // Do not set Content-Type, let the browser handle it
      },
      body: formData,
    });
  
    const editedPost = await response.json();
    
    console.log("Edited post description: ", editedPost);
    
    let newPostList = getPosts();
    console.log("newPostList: ", newPostList);
    
    dispatch(setPost({ post: editedPost }));
  
    setIsEditing(false);
    setEditImage(editImage); // Reset image state
    setEditDescription(editDescription);
    setEditLocation(editLocation); // Reset location after posting
    setEditHashtags(editHashtags); // Clear the hashtags list
    toast.success("The post was edited successfully!", {
      position: 'top-center',
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    setLoading(false); 
  };
  
  // const renderImagePreview = () => {
  //   return (
  //     <Box>
  //       {/* Existing Images */}
  //       {picturePath && picturePath.map((image, index) => (
  //         <Box key={index} sx={{ position: 'relative', marginBottom: '10px' }}>
  //           <img
  //             src={image}
  //             alt={`Existing post image ${index + 1}`}
  //             style={{
  //               width: "100%",
  //               height: "auto",
  //               borderRadius: "0.75rem",
  //             }}
  //           />
  //           <Button
  //             onClick={() => handleRemoveExistingImage(image)}
  //             sx={{
  //               position: 'absolute',
  //               top: '10px',
  //               right: '10px',
  //               backgroundColor: 'red',
  //               color: 'white',
  //             }}
  //           >
  //             Remove
  //           </Button>
  //         </Box>
  //       ))}
  
  //       {/* New Images */}
  //       {newImages && newImages.map((image, index) => (
  //         <Box key={index} sx={{ position: 'relative', marginBottom: '10px' }}>
  //           <img
  //             src={URL.createObjectURL(image)}
  //             alt={`New post image ${index + 1}`}
  //             style={{
  //               width: "100%",
  //               height: "auto",
  //               borderRadius: "0.75rem",
  //             }}
  //           />
  //           <Button
  //             onClick={() => handleRemoveNewImage(image)}
  //             sx={{
  //               position: 'absolute',
  //               top: '10px',
  //               right: '10px',
  //               backgroundColor: 'red',
  //               color: 'white',
  //             }}
  //           >
  //             Remove
  //           </Button>
  //         </Box>
  //       ))}
  
  //       {/* Add Image Icon */}
  //       <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
  //         <IconButton onClick={handleAddNewImages} sx={{ fontSize: '2rem' }}>
  //           <AddPhotoAlternateOutlined />
  //         </IconButton>
  //       </Box>
  //     </Box>
  //   );
  // };
  

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
        {
        <div
        style={{
          display: "flex",
          justifyContent: (sharedById !== ""  && sharedById !== undefined) ? "space-between" : "right",
          alignItems: "center",
          marginBottom: "1rem",
        }}>
        <span 
        onClick={ () => {
          navigate(`/profile/${sharedById}`);
          navigate(0);
        }}
        style={{
          display: (sharedById !== ""  && sharedById !== undefined) ? "flex" : "none",
          backgroundColor: palette.primary.main,
          color: 'white',
          width: 'fit-content',
          padding: '5px 10px',
          borderRadius: "2rem",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          cursor: "pointer",
        }}
        >Shared by {sharedByUsername}
        </span>
        <IconButton onClick={
          async () => {
            console.log("\nClicked saveUnsavePost button\n");
          
            await saveUnsavePost();
          }
        }>
          {
          isSaved ?
          <Bookmark style={{color: palette.primary.main}}/>
          :
          <BookmarkBorder/>
          }
        </IconButton>
      </div>
      } 
      <Following
        userId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
      />
        {isEditing ? (// the post in edit mode
        <Box style={styles.editBox}>

          <div style={styles.editBoxChild}>
            <b>Description: </b>
            <textarea
              placeholder="Edit description..."
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              style={{
                width: "100%",
                backgroundColor: palette.neutral.light,
                borderRadius: "2rem",
                padding: "1rem 2rem",
                marginTop: "0.5rem",
                border: "none",
                fontSize: "16px",
                color: palette.text.primary,
                outline: "none",
                resize: "none"
            }}
          />
          </div>
          <div style={styles.editBoxChild}><b>Image:</b>
            <ImageDropzone images={editImage} setImages={setEditImage} maxImages={10} size="150px" />
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

      ) : (// the post 
        <Box>
          
          <Typography color={main} sx={{ mt: "1rem", whiteSpace: 'pre-wrap' }}>
            {description}
          </Typography>
          <ul style={{
            listStyleType: "none",
            display: 'flex',
            flexDirection: "row",
            flexWrap: "wrap",
            padding: '0'
          }}>
            {hashtags.map((hashtag) => {
              return (
                <li key={hashtag} style={{ margin: '5px' }}>
                  <b style={{ color: main }}>
                    #{hashtag}
                  </b>
                </li>
              );
            })}
          </ul>


          
        {/* Use the PostImagesDisplay Component Here */}
        <PostImagesDisplay images={picturePath} />
          
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
            {((loggedInUserId === postUserId && !sharedById) || loggedInUserId === sharedById) && (
              <IconButton onClick={handleDeletePost}>
                <DeleteOutline sx={{ color: primary }} />
              </IconButton>
            )}
          </FlexBetween>
          <DeleteModal 
            show={showModal} 
            handleClose={handleCloseModal} 
            handleConfirm={deletePost} 
          />            
          <FlexBetween gap="1rem">
            {((loggedInUserId === postUserId && !sharedById)|| loggedInUserId === sharedById) && (
              <IconButton onClick={() => setIsEditing(true)}>
                <EditOutlined sx={{ color: 'black' }} />
              </IconButton>
            )}
          </FlexBetween>
          
          <IconButton onClick={() => {
            sharePost(loggedInUserId, loggedInUsername);
          }}>
            <ShareOutlined />
          </IconButton>
        </FlexBetween>
      </Box>
      )}
      <LoadingPopup open={loading} />
    </WidgetWrapper>
  );
};

export default PostWidget;