import { useState, useEffect } from "react";
import { Box, Button, TextField, Typography, Checkbox, FormControlLabel, useTheme } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLogin } from "state";
import Cookies from "js-cookie";

const loginSchema = yup.object().shape({
  identifier: yup.string().required("Required"),
  password: yup.string().min(8, "At least 8 characters are required").required("Required"),
});

const initialValuesLogin = {
  identifier: "",
  password: "",
  rememberMe: false,
};

const LoginForm = () => {
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const token = useSelector((state) => state.token);

  useEffect(() => {
    if (token) {
      // Redirect to home page if token exists
      navigate("/home");
    }
  }, [token, navigate]);

  const login = async (values, onSubmitProps) => {
    const { identifier, password, rememberMe } = values;

    try {
      console.log("POST /auth/login", { identifier, password });

      const response = await fetch(`${process.env.REACT_APP_URL_BACKEND}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password, rememberMe }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Login failed");
      }

      const loggedIn = await response.json();
      onSubmitProps.resetForm();

      if (loggedIn) {
        const options = rememberMe ? { expires: 7 } : {};
        Cookies.set("token", loggedIn.token, options);
        dispatch(setLogin({ user: loggedIn.user, token: loggedIn.token, rememberMe }));
        navigate("/home");
      } else {
        throw new Error("Login failed");
      }
    } catch (error) {
      console.error("Login error:", error.message);
      setMessage(error.message);
    }
  };

  return (
    <Formik
      onSubmit={login}
      initialValues={initialValuesLogin}
      validationSchema={loginSchema}
    >
      {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <Box display="grid" gap="30px" gridTemplateColumns="repeat(4, minmax(0, 1fr))">
            <TextField
              label="Email or Username"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.identifier}
              name="identifier"
              error={touched.identifier && Boolean(errors.identifier)}
              helperText={touched.identifier && errors.identifier}
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              label="Password"
              type="password"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.password}
              name="password"
              error={touched.password && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              sx={{ gridColumn: "span 4" }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={values.rememberMe}
                  onChange={handleChange}
                  name="rememberMe"
                  color="primary"
                />
              }
              label="Remember Me"
              sx={{ gridColumn: "span 4", textAlign: "left", mt: "1rem" }}
            />
            <Typography
              onClick={() => navigate("/forgot-password")}
              sx={{
                textDecoration: "underline",
                color: palette.primary.main,
                "&:hover": {
                  cursor: "pointer",
                  color: palette.primary.light,
                },
                gridColumn: "span 4",
                textAlign: "right",
                mt: "0.5rem",
              }}
            >
              Forgot Password?
            </Typography>
          </Box>

          {message && (
            <Typography color="primary" sx={{ mt: "1rem", textAlign: "center" }}>
              {message}
            </Typography>
          )}

          <Box>
            <Button
              fullWidth
              type="submit"
              sx={{
                m: "2rem 0",
                p: "1rem",
                backgroundColor: palette.primary.main,
                color: palette.background.alt,
                "&:hover": { color: palette.primary.main },
              }}
            >
              LOGIN
            </Button>
            <Typography
              onClick={() => navigate("/register")}
              sx={{
                textDecoration: "underline",
                color: palette.primary.main,
                "&:hover": {
                  cursor: "pointer",
                  color: palette.primary.light,
                },
              }}
            >
              Don't have an account? Sign Up here.
            </Typography>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default LoginForm;
