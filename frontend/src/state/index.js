import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
  mode: "light",
  user: null,
  token: Cookies.get("token") || null,
  posts: [],
  followers: [],
  following: [],
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

      const options = action.payload.rememberMe ? { expires: 1 } : { expires: 0.5 };
      Cookies.set("token", action.payload.token, options);
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
      Cookies.remove("token");
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
        state.followers= [];
        console.error("Followers list is empty");
      }
    },
    setFollowing: (state, action) => {
      if (state.user) {
        state.user.following = action.payload.following;
      } else {
        console.error("Following list is empty");
      }
    },
    updateUserPicturePath: (state, action) => {
      if (state.user) {
        state.user.picturePath = action.payload.picturePath;
      } else {
        console.error("User is not logged in");
      }
    },
    getPosts: (state) => { return state.posts; },
  },
});

export const {
  setMode,
  setLogin,
  setLogout,
  setPosts,
  setPost,
  setFollowers,
  setFollowing,
  getPosts,
  updateUserPicturePath,
} = authSlice.actions;

export default authSlice.reducer;
