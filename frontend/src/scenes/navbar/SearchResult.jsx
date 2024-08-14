import React from 'react';
import PostWidget from "scenes/widgets/PostWidget";
import { useNavigate } from "react-router-dom";

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
          



const SearchResult = ({ isPost = false, data }) => {
  const navigate = useNavigate();

  const onClickFunction = () => {
    console.log("Clicked!");
    console.log(JSON.stringify(data));
    if (!isPost) { 
      navigate(`/profile/${data._id}`);
      navigate(0);
    }
  };

  return (
    <li style={widgetStyle} onClick={onClickFunction}>
      {isPost ?
      (
        <PostWidget
            key={data.id}
            postId={data.id}
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
            onLike={() => handleLikePost(_id)}
            onDislike={() => handleDislikePost(_id)}
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
  );
};

export default SearchResult;
