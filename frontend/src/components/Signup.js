import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from '../config/axios';
import {
  Button,
  TextField,
  Container,
  Typography,
  Box,
  Link as MuiLink,
  Tabs,
  Tab,
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

const SignupSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  mobile_number: Yup.string()
    .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
    .required('Required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[^A-Za-z0-9]/, 'Password must contain at least one special character')
    .required('Required'),
  confirm_password: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Required'),
});

const Signup = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [userType, setUserType] = useState('user');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [showOtpField, setShowOtpField] = useState(false);
  const [otp, setOtp] = useState('');
  const [verificationError, setVerificationError] = useState('');
  const [isMobileVerified, setIsMobileVerified] = useState(false);
  const [showMobileOtpField, setShowMobileOtpField] = useState(false);
  const [mobileOtp, setMobileOtp] = useState('');
  const [mobileVerificationError, setMobileVerificationError] = useState('');

  const handleTabChange = (event, newValue) => {
    setUserType(newValue);
    setError('');
  };

  const handleSendOtp = async (email) => {
    try {
      setVerificationError('');
      await axios.post('/api/send-signup-otp/', { email });
      setShowOtpField(true);
      alert('OTP sent to your email!');
    } catch (error) {
      setVerificationError(error.response?.data?.error || 'Failed to send OTP');
    }
  };

  const handleVerifyOtp = async (email) => {
    try {
      setVerificationError('');
      await axios.post('/api/verify-signup-otp/', { 
        email, 
        otp 
      });
      setIsEmailVerified(true);
      setShowOtpField(false);
      alert('Email verified successfully!');
    } catch (error) {
      setVerificationError(error.response?.data?.error || 'Failed to verify OTP');
    }
  };

  const handleSendMobileOtp = async (mobile_number, email) => {
    try {
      setMobileVerificationError('');
      await axios.post('/api/send-mobile-otp/', { 
        mobile_number,
        email // Include email for testing purposes
      });
      setShowMobileOtpField(true);
      alert('OTP sent to your mobile number!');
    } catch (error) {
      setMobileVerificationError(error.response?.data?.error || 'Failed to send OTP');
    }
  };

  const handleVerifyMobileOtp = async (mobile_number) => {
    try {
      setMobileVerificationError('');
      await axios.post('/api/verify-mobile-otp/', { 
        mobile_number, 
        otp: mobileOtp 
      });
      setIsMobileVerified(true);
      setShowMobileOtpField(false);
      alert('Mobile number verified successfully!');
    } catch (error) {
      setMobileVerificationError(error.response?.data?.error || 'Failed to verify OTP');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>

        <Tabs value={userType} onChange={handleTabChange} sx={{ mb: 3 }}>
          <Tab label="User Signup" value="user" />
          <Tab label="Admin Signup" value="admin" />
        </Tabs>

        {error && (
          <Box sx={{ mb: 2, width: '100%' }}>
            <Typography color="error" align="center">
              {error}
            </Typography>
          </Box>
        )}

        <Formik
          initialValues={{
            name: '',
            email: '',
            mobile_number: '',
            password: '',
            confirm_password: '',
          }}
          validationSchema={SignupSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              if (!isEmailVerified) {
                alert('Please verify your email first');
                return;
              }
              if (!isMobileVerified) {
                alert('Please verify your mobile number first');
                return;
              }
              setError('');
              await axios.post('/api/register/', {
                ...values,
                user_type: userType
              });
              alert(`${userType === 'admin' ? 'Admin' : 'User'} registered successfully!`);
              navigate('/login');
            } catch (error) {
              setError(error.response?.data?.error || 'Registration failed');
            }
            setSubmitting(false);
          }}
        >
          {({ errors, touched, isSubmitting, values }) => (
            <Form>
              <Field
                as={TextField}
                fullWidth
                margin="normal"
                name="name"
                label="Name"
                error={touched.name && errors.name}
                helperText={touched.name && errors.name}
              />
              
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                <Field
                  as={TextField}
                  fullWidth
                  margin="normal"
                  name="email"
                  label="Email"
                  error={touched.email && errors.email}
                  helperText={touched.email && errors.email}
                  disabled={isEmailVerified}
                />
                {!isEmailVerified && (
                  <Button
                    variant="contained"
                    sx={{ mt: 2 }}
                    onClick={() => handleSendOtp(values.email)}
                    disabled={!values.email || errors.email}
                  >
                    Verify Email
                  </Button>
                )}
              </Box>

              {showOtpField && (
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Enter Email OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                  <Button
                    variant="contained"
                    sx={{ mt: 2 }}
                    onClick={() => handleVerifyOtp(values.email)}
                  >
                    Submit OTP
                  </Button>
                </Box>
              )}

              <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                <Field
                  as={TextField}
                  fullWidth
                  margin="normal"
                  name="mobile_number"
                  label="Mobile Number"
                  error={touched.mobile_number && errors.mobile_number}
                  helperText={touched.mobile_number && errors.mobile_number}
                  disabled={isMobileVerified}
                />
                {!isMobileVerified && (
                  <Button
                    variant="contained"
                    sx={{ mt: 2 }}
                    onClick={() => handleSendMobileOtp(values.mobile_number, values.email)}
                    disabled={!values.mobile_number || errors.mobile_number || !isEmailVerified}
                  >
                    Verify Mobile
                  </Button>
                )}
              </Box>

              {showMobileOtpField && (
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Enter Mobile OTP"
                    value={mobileOtp}
                    onChange={(e) => setMobileOtp(e.target.value)}
                  />
                  <Button
                    variant="contained"
                    sx={{ mt: 2 }}
                    onClick={() => handleVerifyMobileOtp(values.mobile_number)}
                  >
                    Submit OTP
                  </Button>
                </Box>
              )}

              {verificationError && (
                <Typography color="error" sx={{ mt: 1 }}>
                  {verificationError}
                </Typography>
              )}
              {mobileVerificationError && (
                <Typography color="error" sx={{ mt: 1 }}>
                  {mobileVerificationError}
                </Typography>
              )}
              
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
              
              <Field
                as={TextField}
                fullWidth
                margin="normal"
                name="confirm_password"
                label="Confirm Password"
                type="password"
                error={touched.confirm_password && errors.confirm_password}
                helperText={touched.confirm_password && errors.confirm_password}
              />
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={isSubmitting || !isEmailVerified || !isMobileVerified}
              >
                {`Sign Up as ${userType === 'admin' ? 'Admin' : 'User'}`}
              </Button>

              <Box sx={{ textAlign: 'center' }}>
                <MuiLink component={RouterLink} to="/login" variant="body2">
                  Already have an account? Login
                </MuiLink>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
};

export default Signup;