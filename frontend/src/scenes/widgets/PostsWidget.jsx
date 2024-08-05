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
  }, [userId, isProfile, dispatch, token]);

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
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      overflow: 'hidden', // changed to hidden to prevent scrollbars in the main div
      height: '90vh',
    }}>
      <h2 style={{ 
        textAlign: 'center',
        padding: '10px',
        textDecoration: 'underline',
        fontSize: '40px',
        color: 'black',
        marginTop: '20px',
        marginBottom: '20px',
        margin: '0'
      }}>{isProfile ? 'Your Posts' : 'News Feed'}</h2>
      <ul style={{ 
        display: 'flex',
        flexDirection: isProfile ? 'column-reverse' : 'column',
        padding: '0',
        margin: '0',
        overflowY: 'auto', // allow vertical scrolling
        width: '100%', // ensure the ul takes full width of the parent div
        flexGrow: '1', // make the ul take remaining space
        alignItems: 'center',

       }}>
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
