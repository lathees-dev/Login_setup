import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  Button,
  TextField,
  Container,
  Typography,
  Box,
  Link as MuiLink,
  Tabs,
  Tab,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().required("Required"),
});

const Login = () => {
  const [userType, setUserType] = useState("user");
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleTabChange = (event, newValue) => {
    setUserType(newValue);
    setError("");
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Clear any existing data
      localStorage.removeItem("userInfo");

      const response = await fetch("http://localhost:8000/users/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        localStorage.setItem("userInfo", JSON.stringify(data));

        // Check if user is admin and redirect accordingly
        if (data.is_admin) {
          navigate("/admin/dashboard");
        } else {
          navigate("/user-home");
        }
      } else {
        setError(data.error || "Login failed");
      }
    } catch (error) {
      setError("An error occurred during login");
      console.error("Login error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Login
        </Typography>

        <Tabs value={userType} onChange={handleTabChange} sx={{ mb: 3 }}>
          <Tab label="User Login" value="user" />
          <Tab label="Admin Login" value="admin" />
        </Tabs>

        {error && (
          <Box sx={{ mb: 2, width: "100%" }}>
            <Typography color="error" align="center">
              {error}
            </Typography>
          </Box>
        )}

        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={LoginSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <Field
                as={TextField}
                fullWidth
                margin="normal"
                name="email"
                label="Email"
                error={touched.email && errors.email}
                helperText={touched.email && errors.email}
              />

              <Field
                as={TextField}
                fullWidth
                margin="normal"
                name="password"
                label="Password"
                type="password"
                error={touched.password && errors.password}
                helperText={touched.password && errors.password}
              />

              <Box sx={{ mt: 2, textAlign: "right" }}>
                <MuiLink
                  component={RouterLink}
                  to="/forgot-password"
                  variant="body2"
                >
                  Forgot password?
                </MuiLink>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={isSubmitting}
              >
                Login
              </Button>

              <Box sx={{ textAlign: "center" }}>
                <MuiLink component={RouterLink} to="/signup" variant="body2">
                  Don't have an account? Sign Up
                </MuiLink>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
};

export default Login;
