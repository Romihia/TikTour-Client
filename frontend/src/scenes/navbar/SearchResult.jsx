import { React, useState, useEffect} from 'react';
import PostWidget from "scenes/widgets/PostWidget";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  handleLikePost,
  handleDislikePost
} from "scenes/widgets/PostsWidget";

const widgetStyle = {
  padding: '10px',
  border: '1px solid #ccc',
  margin: '10px',
  borderRadius: '5px',
  backgroundColor: '#f9f9f9',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  color: '#000',
  cursor: 'pointer',
};

const userImageStyle = {
  width: '50px',
  height: '50px',
  borderRadius: '50%',
  marginRight: '10px',
};

const postImageStyle = {
  maxWidth: '100%',
  borderRadius: '5px',
  marginTop: '10px',
};

const hashtagsStyle = {
  color: '#007bff',
  fontWeight: 'bold',
};

// const handleLikePost = async (postId) => {
//   const response = await fetch(`${process.env.REACT_APP_URL_BACKEND}/posts/${postId}/like`, {
//     method: "PATCH",
//     headers: {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ userId: userId }), 
//   });
//   const updatedPost = await response.json();
//   dispatch(setPosts({ posts: posts.map(post => post._id === postId ? updatedPost : post) }));
// };

// const handleDislikePost = async (postId) => {
//   const response = await fetch(`${process.env.REACT_APP_URL_BACKEND}/posts/${postId}/dislike`, {
//     method: "PATCH",
//     headers: {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ userId: userId }), 
//   });
//   const updatedPost = await response.json();
//   dispatch(setPosts({ posts: posts.map(post => post._id === postId ? updatedPost : post) }));
// };
          



const SearchResult = ({ savedPosts, isPost = false, data }) => {
  const navigate = useNavigate();
  const loggedInUserId = useSelector((state) => state.user._id);
  const token = useSelector((state) => state.token);


  const onClickFunction = async () => {
    console.log("Clicked!");
    console.log(JSON.stringify(data));
    if (!isPost) { 
      navigate(`/profile/${data._id}`);
      navigate(0);
    }
    
  };

  const isSaved = savedPosts.some(savedPost => savedPost._id === data._id);

  

  return (
    (
    <li style={widgetStyle} onClick={onClickFunction}>
      {isPost ?
      (
        <PostWidget
            key={data._id}
            postId={data._id}
            postUserId={data.userId}
            sharedById={data.sharedById}
            name={data.userName}
            description={data.description}
            location={data.location}
            picturePath={data.picturePath}
            userPicturePath={data.userPicturePath}
            hashtags={data.hashtags}
            likes={data.likes}
            dislikes={data.dislikes}
            onLike={() => handleLikePost(data._id)}
            onDislike={() => handleDislikePost(data._id)}
            isSaved={isSaved}
          />
      ) 
      : 
      (
        <>
          {data.picturePath && (
            <img
              src={data.picturePath}
              alt="User"
              style={userImageStyle}
            />
          )}
          <span>{data.firstName} {data.lastName} - ({data.username})</span>
        </>
      )}
    </li>
    )
  );
};

export default SearchResult;
