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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
});

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [showOtpField, setShowOtpField] = useState(false);
  const [otp, setOtp] = useState('');
  const [verificationError, setVerificationError] = useState('');
  const [email, setEmail] = useState('');
  const [showResendButton, setShowResendButton] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  React.useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleSendOtp = async (email) => {
    try {
      setVerificationError('');
      setShowResendButton(false);
      await axios.post('/api/send-reset-otp/', { email });
      setShowOtpField(true);
      setEmail(email);
      setResendTimer(30);
      alert('OTP sent to your email!');
    } catch (error) {
      setVerificationError(error.response?.data?.error || 'Failed to send OTP');
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setVerificationError('');
      await axios.post('/api/verify-reset-otp/', { 
        email, 
        otp 
      });
      navigate('/reset-password', { state: { email } });
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to verify OTP';
      setVerificationError(errorMessage);
      if (errorMessage.includes('expired')) {
        setShowResendButton(true);
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          Forgot Password
        </Typography>

        <Formik
          initialValues={{
            email: '',
          }}
          validationSchema={ForgotPasswordSchema}
          onSubmit={async (values, { setSubmitting }) => {
            handleSendOtp(values.email);
            setSubmitting(false);
          }}
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
                disabled={showOtpField}
              />
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={isSubmitting || showOtpField}
              >
                Send OTP
              </Button>
            </Form>
          )}
        </Formik>

        {showOtpField && (
          <Box sx={{ width: '100%', mt: 2 }}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
              <TextField
                fullWidth
                margin="normal"
                label="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <Button
                variant="contained"
                sx={{ mt: 2 }}
                onClick={handleVerifyOtp}
              >
                Verify OTP
              </Button>
            </Box>

            {showResendButton && (
              <Button
                variant="outlined"
                fullWidth
                onClick={() => handleSendOtp(email)}
                disabled={resendTimer > 0}
                sx={{ mt: 2 }}
              >
                {resendTimer > 0 
                  ? `Resend OTP in ${resendTimer}s` 
                  : 'Resend OTP'}
              </Button>
            )}

            {verificationError && (
              <Typography color="error" sx={{ mt: 1 }}>
                {verificationError}
              </Typography>
            )}
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default ForgotPassword; 