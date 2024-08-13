import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import PostWidget from "./PostWidget";
import { ShowerOutlined } from "@mui/icons-material";

const PostsWidget = ({ userId, isProfile = false, onlySaved=false }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);
  const [savedPosts, setSavedPosts] = useState([]);

  const getUserAndFollowingPosts = async () => {
    const response = await fetch(`${process.env.REACT_APP_URL_BACKEND}/posts/userAndFollowing/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    dispatch(setPosts({ posts: data }));
  };


  const getUserPosts = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_URL_BACKEND}/posts/${userId}/posts`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    console.log("Posts: " + data);
    dispatch(setPosts({ posts: data }));
  };

  const initializeSavedPosts = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_URL_BACKEND}/save/${userId}/getSavedPosts`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    const savedPosts = data.savedPosts;
    setSavedPosts(savedPosts);
  };

  useEffect(() => {
    initializeSavedPosts();
    if (onlySaved) {
      dispatch(setPosts({ posts: savedPosts }));
    }
    else if (isProfile) {
      getUserPosts();
    } else {
      getUserAndFollowingPosts();
    }
  }, [userId, isProfile, onlySaved, dispatch, token]); // Add dispatch and token to dependency array
 

  const handleLikePost = async (postId) => {
    const response = await fetch(`${process.env.REACT_APP_URL_BACKEND}/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: userId }), 
    });
    const updatedPost = await response.json();
    dispatch(setPosts({ posts: posts.map(post => post._id === postId ? updatedPost : post) }));
  };

  const handleDislikePost = async (postId) => {
    const response = await fetch(`${process.env.REACT_APP_URL_BACKEND}/posts/${postId}/dislike`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: userId }), 
    });
    const updatedPost = await response.json();
    dispatch(setPosts({ posts: posts.map(post => post._id === postId ? updatedPost : post) }));
  };

  return (
    <div>
      <ul style={{ display: 'flex', flexDirection: isProfile ? 'column-reverse' : 'column' }}>
        {posts.map((post) => {
          const {
            _id,
            userId,
            sharedById,
            userName,
            description,
            location,
            picturePath,
            userPicturePath,
            hashtags,
            likes,
            dislikes,
          } = post;
  
          // Check if the post is saved by checking if the post ID exists in savedPosts
          const isSaved = savedPosts.some(savedPost => savedPost._id === _id);
  
          return (
            <PostWidget
              key={_id}
              postId={_id}
              postUserId={userId}
              sharedById={sharedById}
              name={userName}
              description={description}
              location={location}
              picturePath={picturePath}
              userPicturePath={userPicturePath}
              hashtags={hashtags}
              likes={likes}
              dislikes={dislikes}
              onLike={() => handleLikePost(_id)}
              onDislike={() => handleDislikePost(_id)}
              isSaved={isSaved}
            />
          );
        })}
      </ul>
    </div>
  );
  

};

export default PostsWidget;