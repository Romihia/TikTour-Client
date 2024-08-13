import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "scenes/homePage";
import LoginPage from "scenes/loginPage";
import RegisterPage from "scenes/registerPage";
import ProfilePage from "scenes/profilePage";
import AboutPage from "scenes/about";
import ForgotPassword from "scenes/forgotPassword";
import ResetPassword from "scenes/resetPassword";
import VerifyEmail from './scenes/verifyUser/VerifyEmail';
import TermsAndConditions from './scenes/termsPage';
import { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode"; 
import { setLogout } from "./state";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const token = useSelector((state) => state.token);
  const dispatch = useDispatch();

  const checkTokenValidity = () => {
    const token = Cookies.get("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token); 
        const currentTime = Date.now() / 1000; 

        if (decodedToken.exp < currentTime) {
          Cookies.remove("token");
          dispatch(setLogout()); 
          console.log("Token expired. Logging out.");
        }
      } catch (error) {
        Cookies.remove("token");
        dispatch(setLogout());
        console.log("Token decoding failed. Logging out.");
      }
    }
  };

  useEffect(() => {
    checkTokenValidity();
  }, []);

  const isAuth = Boolean(token);

  const [showOnlySaved, setShowOnlySaved] = useState(false);

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/home" element={isAuth ? <HomePage /> : <Navigate to="/" />} />
            <Route path="/profile/:userId" element={isAuth ? <ProfilePage showOnlySaved={showOnlySaved} setShowOnlySaved={setShowOnlySaved} /> : <Navigate to="/" />} />
            <Route path="/about" element={isAuth ? <AboutPage /> : <Navigate to="/" />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
      <ToastContainer />
    </div>
  );
}

export default App;
