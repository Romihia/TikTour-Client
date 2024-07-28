import { Box, Button, TextField, Typography, Checkbox, FormControlLabel, useTheme } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const registerSchema = yup.object().shape({
  firstName: yup.string(),
  lastName: yup.string(),
  email: yup.string().email("Invalid email").required("Required"),
  password: yup.string().min(8, "At least 8 characters are required").required("Required"),
  location: yup.string(),
  username: yup.string().required("Required"),
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

  const register = async (values, onSubmitProps) => {
    const formData = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: values.password,
      location: values.location,
      username: values.username,
      dateOfBirth: values.dateOfBirth,
    };

    try {
      const url = `${process.env.REACT_APP_URL_BACKEND}/auth/register`;
      console.log("Fetch URL:", url); // Log the URL to verify it
  
      const savedUserResponse = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      const savedUser = await savedUserResponse.json();
      onSubmitProps.resetForm();
  
      if (savedUserResponse.ok) {
        setMessage("Registration successful. Please check your email for verification.");
        navigate("/login");
      } else {
        setMessage(`Registration failed: ${savedUser.message}`);
      }
    } catch (error) {
      console.error("Registration error:", error);
      if (error.response) {
        setMessage(`Registration failed: ${error.response.data.message}`);
      } else if (error.request) {
        setMessage("Registration failed: No response from server. Please try again later.");
      } else {
        setMessage(`Registration failed: ${error.message}`);
      }
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    await register(values, onSubmitProps);
  };

  return (
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
              error={touched.firstName && errors.firstName}
              helperText={touched.firstName && errors.firstName}
              sx={{ gridColumn: "span 2" }}
            />
            <TextField
              label="Last Name"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.lastName}
              name="lastName"
              error={touched.lastName && errors.lastName}
              helperText={touched.lastName && errors.lastName}
              sx={{ gridColumn: "span 2" }}
            />
            <TextField
              label="Location"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.location}
              name="location"
              error={touched.location && errors.location}
              helperText={touched.location && errors.location}
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              label="Username *"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.username}
              name="username"
              error={touched.username && errors.username}
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
              error={touched.dateOfBirth && errors.dateOfBirth}
              helperText={touched.dateOfBirth && errors.dateOfBirth}
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              label="Email *"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.email}
              name="email"
              error={touched.email && errors.email}
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
              error={touched.password && errors.password}
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
              label="I agree to the terms and conditions"
              sx={{ gridColumn: "span 4" }}
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
  );
};

export default RegisterForm;
