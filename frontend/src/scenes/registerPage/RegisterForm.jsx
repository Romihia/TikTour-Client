import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Checkbox, FormControlLabel, Snackbar, Alert,CircularProgress, useTheme } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import ProfileCompletionPrompt from "../profileCompletion/ProfileCompletionPrompt";

const invalidChars = /[^A-Za-z\d!@#$%^&*]/g;

const registerSchema = yup.object().shape({
  firstName: yup
    .string()
    .matches(/^[A-Za-z]+$/, "First name must contain only English letters")
    .min(1, "First name must be at least 1 character")
    .max(50, "First name must be at most 50 characters"),
  lastName: yup
    .string()
    .matches(/^[A-Za-z]+$/, "Last name must contain only English letters")
    .min(1, "Last name must be at least 1 character")
    .max(50, "Last name must be at most 50 characters"),
  email: yup
    .string()
    .email("Invalid email")
    .max(150, "Email must be at most 150 characters")
    .required("Required"),
  password: yup
    .string()
    .matches(/[A-Z]/, "At least one uppercase letter is required")
    .matches(/[a-z]/, "At least one lowercase letter is required")
    .matches(/\d/, "At least one number is required")
    .min(8, "At least 8 characters are required")
    .max(50, "Maximum 50 characters are allowed")
    .test(
      "invalid-characters",
      "Password must meet the requirements and cannot contain invalid characters: ${invalidChars}",
      function(value) {
        if (!value) return true; // Skip validation if value is undefined
        const invalidCharsFound = value.match(invalidChars);
        if (invalidCharsFound) {
          return this.createError({ message: `Password contains invalid characters: ${invalidCharsFound.join('')}` });
        }
        return true;
      }
    )
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,50}$/, "Password must meet the requirements:\nAt least one uppercase letter (A-Z).\nAt least one lowercase letter (a-z).\nAt least one number (0-9).\ncan have a special character !@#$%^&*")
    .required("Required"),
  location: yup
    .string()
    .matches(/^[A-Za-z\s]+$/, "Location must contain only English letters")
    .min(1, "Location must be at least 1 character")
    .max(50, "Location must be at most 50 characters"),
  username: yup
    .string()
    .matches(/^[A-Za-z\d]+$/, "Username must contain only English letters or digits")
    .min(1, "Username must be at least 1 character")
    .max(50, "Username must be at most 50 characters")
    .required("Required"),
  dateOfBirth: yup.date(),
  terms: yup.bool().oneOf([true], "You must accept the terms and conditions").required("Required"),
});

const initialValuesRegister = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  location: "",
  username: "",
  dateOfBirth: "",
  terms: false,
};

const RegisterForm = () => {
  const { palette } = useTheme();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // Updated state
  const [loading, setLoading] = useState(false); // Loading state
  const [openProfileCompletion, setOpenProfileCompletion] = useState(false);
  const [userCredentials, setUserCredentials] = useState(null);
  const [token, setToken] = useState(null);

  const register = async (values, onSubmitProps) => {
    const formData = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: values.password,
      location: values.location,
      username: values.username,
      dateOfBirth: values.dateOfBirth
    };

    try {
      
      setLoading(true); // Start loading
      const url = `${process.env.REACT_APP_URL_BACKEND}/auth/register`;
      console.log("POST ", url, formData);// Log the URL to verify it

      const savedUserResponse = await fetch(
        url,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const savedUser = await savedUserResponse.json();
      console.log(`${savedUser}`);
      onSubmitProps.resetForm();

      if (savedUserResponse.ok) {
        setMessage("Registration successful. Please check your email for verification.");
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
        console.log(savedUser.user);
        setUserCredentials(savedUser.user);
        console.log(savedUser.token);
        setToken(savedUser.token);
        setOpenProfileCompletion(true);
      }else {
        setMessage(savedUser.error || "Registration failed. Please try again.");
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error("Registration error:", error);
      setMessage("Registration failed. Please try again.");
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    await register(values, onSubmitProps);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <>
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValuesRegister}
        validationSchema={registerSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue,
          resetForm,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            >
              <TextField
                label="First Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.firstName}
                name="firstName"
                error={touched.firstName && Boolean(errors.firstName)}
                helperText={touched.firstName && errors.firstName}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                label="Last Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.lastName}
                name="lastName"
                error={touched.lastName && Boolean(errors.lastName)}
                helperText={touched.lastName && errors.lastName}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                label="Location"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.location}
                name="location"
                error={touched.location && Boolean(errors.location)}
                helperText={touched.location && errors.location}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                label="Username *"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.username}
                name="username"
                error={touched.username && Boolean(errors.username)}
                helperText={touched.username && errors.username}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                label="Date of Birth"
                type="date"
                InputLabelProps={{ shrink: true }}
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.dateOfBirth}
                name="dateOfBirth"
                error={touched.dateOfBirth && Boolean(errors.dateOfBirth)}
                helperText={touched.dateOfBirth && errors.dateOfBirth}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                label="Email *"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                label="Password *"
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
                    checked={values.terms}
                    onChange={(e) => setFieldValue("terms", e.target.checked)}
                    name="terms"
                    color="primary"
                  />
                }
                label={
                  <span>
                    I agree to the{" "}
                    <a href="/terms-and-conditions" target="_blank" rel="noopener noreferrer">
                      terms and conditions
                    </a>
                  </span>
                }
                sx={{ gridColumn: "span 4", textAlign: "left" }}
              />
              {touched.terms && errors.terms && (
                <Typography color="error" sx={{ gridColumn: "span 4" }}>
                  {errors.terms}
                </Typography>
              )}
            </Box>
            {message && (
              <Typography color="primary" sx={{ mt: "1rem", textAlign: "center" }}>
                {message}
              </Typography>
            )}
            {loading && (
              <Box display="flex" justifyContent="center" sx={{ mt: "1rem" }}>
                <CircularProgress />
              </Box>
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
                REGISTER
              </Button>
              <Typography
                onClick={() => {
                  navigate("/login");
                  resetForm();
                  setMessage("");
                }}
                sx={{
                  textDecoration: "underline",
                  color: palette.primary.main,
                  "&:hover": {
                    cursor: "pointer",
                    color: palette.primary.light,
                  },
                }}
              >
                Already have an account? Login here.
              </Typography>
            </Box>
          </form>
        )}
      </Formik>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={10000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
      {openProfileCompletion && (
        <ProfileCompletionPrompt
          open={openProfileCompletion}
          onClose={() => setOpenProfileCompletion(false)}
          userCredntionals={userCredentials}
          token={token}
        />
      )}
    </>
  );
};

export default RegisterForm;
