import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import PostWidget from "./PostWidget";

const PostsWidget = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);

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

  useEffect(() => {
    if (isProfile) {
      getUserPosts();
    } else {
      getUserAndFollowingPosts();
    }
  }, [userId, isProfile, dispatch, token]); // Add dispatch and token to dependency array
 

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
        {posts.map(
          ({
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
          }) => (
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
            />
          )
        )}
      </ul>
    </div>
  );

};

export default PostsWidget;
