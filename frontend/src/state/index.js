import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light",
  user: null,
  token: null,
  posts: [],
  followers: [],  // Added for managing followers
  following: [],  // Added for managing following
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
    },
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },
    setPost: (state, action) => {
      const updatedPosts = state.posts.map((post) => {
        if (post._id === action.payload.post._id) return action.payload.post;
        return post;
      });
      state.posts = updatedPosts;
    },
    setFollowers: (state, action) => {
      if (action.payload.followers.length > 0) {
        state.followers = action.payload.followers;
      } else {
        console.error("Followers list is empty");
      }
    },
    setFollowing: (state, action) => {
      if (action.payload.following.length > 0) {
        state.following = action.payload.following;
      } else {
        console.error("Following list is empty");
      }
    },
  },
});

export const {
  setMode,
  setLogin,
  setLogout,
  setPosts,
  setPost,
  setFollowers,
  setFollowing
} = authSlice.actions;

export default authSlice.reducer;
