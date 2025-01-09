import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import axios from '../../config/axios';

const Section = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  backgroundColor: '#fff',
}));

const StoryTellingTest = () => {
  const navigate = useNavigate();
  const [situation, setSituation] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(null);
  const [transcription, setTranscription] = useState('');
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const [error, setError] = useState('');

  useEffect(() => {
    getSituation();
  }, []);

  const getSituation = async () => {
    try {
      const response = await axios.get('/storytelling/api/get-test-situation/');
      setSituation(response.data);
    } catch (error) {
      console.error('Error getting situation:', error);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm;codecs=opus' });
        await submitTest(audioBlob);
      };

      mediaRecorderRef.current.start(1000);
      setIsRecording(true);
      setError('');
    } catch (error) {
      console.error('Error starting recording:', error);
      setError('Error accessing microphone. Please ensure microphone permissions are granted.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const submitTest = async (audioBlob) => {
    setLoading(true);
    setError('');
    try {
      // Convert webm to wav format
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64Audio = reader.result;
        
        try {
          const response = await axios.post('/storytelling/api/submit-test/', {
            situationId: situation.id,
            audioData: base64Audio,
          });
          
          setScore(response.data.score);
          setTranscription(response.data.transcription);
        } catch (error) {
          console.error('Error submitting test:', error);
          if (error.response?.status === 401) {
            setError('Please log in to save your test results');
          } else if (error.response?.data?.error) {
            setError(error.response.data.error);
          } else {
            setError('Error submitting test. Please try again.');
          }
        }
      };
    } catch (error) {
      console.error('Error processing audio:', error);
      setError('Error processing audio. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
          <IconButton onClick={() => navigate('/story-telling')} color="primary">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4">
            Storytelling Test
          </Typography>
        </Box>

        {situation && (
          <Section elevation={3}>
            <Typography variant="h6" gutterBottom>
              Your Situation
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              {situation.description}
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
              <Button
                variant="contained"
                color={isRecording ? "error" : "primary"}
                startIcon={isRecording ? <StopIcon /> : <MicIcon />}
                onClick={isRecording ? stopRecording : startRecording}
                disabled={loading}
              >
                {isRecording ? "Stop Recording" : "Start Recording"}
              </Button>
            </Box>

            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <CircularProgress />
              </Box>
            )}

            {transcription && (
              <Section>
                <Typography variant="h6" gutterBottom>
                  Your Response
                </Typography>
                <Typography variant="body1">
                  {transcription}
                </Typography>
              </Section>
            )}

            {score !== null && (
              <Section>
                <Typography variant="h6" gutterBottom>
                  Your Score
                </Typography>
                <Typography variant="h3" color="primary" align="center">
                  {score}/100
                </Typography>
              </Section>
            )}
          </Section>
        )}

        {error && (
          <Box sx={{ 
            mt: 2, 
            p: 2, 
            bgcolor: 'error.light', 
            color: 'error.contrastText',
            borderRadius: 1
          }}>
            <Typography>{error}</Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default StoryTellingTest; 