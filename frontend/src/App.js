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
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";

function App() {
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuth = Boolean(useSelector((state) => state.token));

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route 
              path="/" 
              element={<LoginPage />} 
              />
            <Route 
              path="/login"  
              element={<LoginPage />} 
              />
            <Route 
              path="/register" 
              element={<RegisterPage />} 
              />
            <Route 
              path="/home" 
              element={isAuth ? <HomePage /> : <Navigate to="/" />} 
              />
            <Route 
              path="/profile/:userId" 
              element={isAuth ? <ProfilePage /> : <Navigate to="/" />} 
            />
            <Route 
              path="/about"
              element={isAuth ? <AboutPage />: <Navigate to="/" />} 
            />
            <Route 
              path="/forgot-password" 
              element={<ForgotPassword />} 
              />
            <Route 
              path="/reset-password" 
              element={<ResetPassword />} 
              />
            <Route 
              path="/verify-email" 
              element={<VerifyEmail  />} 
              />
            <Route 
              path="/terms-and-conditions" 
              element={<TermsAndConditions  />} 
              />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
