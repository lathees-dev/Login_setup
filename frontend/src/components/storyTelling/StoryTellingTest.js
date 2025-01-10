import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  CircularProgress,
  IconButton,
  Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import { useNavigate } from 'react-router-dom';
import axios from '../../config/axios';
import VoiceInput from '../VoiceInput';

const Section = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  backgroundColor: '#fff',
  '& .MuiTypography-body1': {
    lineHeight: 1.6,
    '& ul': {
      paddingLeft: theme.spacing(2),
      marginTop: 0,
      marginBottom: 0,
    }
  }
}));

const StoryTellingTest = () => {
  const navigate = useNavigate();
  const [situation, setSituation] = useState('');
  const [userStory, setUserStory] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(null);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds
  const [isRecording, setIsRecording] = useState(false);
  const timerRef = useRef(null);

  // Get initial test situation when component mounts
  useEffect(() => {
    const getSituation = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/storytelling/api/get-test-situation/');
        setSituation(response.data.description);
      } catch (error) {
        console.error('Error:', error);
        setSituation('Failed to load test situation. Please try refreshing the page.');
      } finally {
        setLoading(false);
      }
    };
    getSituation();
  }, []);

  const startTimer = () => {
    setTimeLeft(120);
    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          stopTimer();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVoiceStart = () => {
    setIsRecording(true);
    startTimer();
  };

  const handleVoiceEnd = () => {
    setIsRecording(false);
    stopTimer();
  };

  const handleSubmitStory = async () => {
    if (!userStory.trim()) return;
    
    setLoading(true);
    try {
      const response = await axios.post('/storytelling/api/chat-with-assistant/', {
        message: `Test Situation: "${situation}"\n\nUser's Story: ${userStory}\n\nPlease analyze this test response and provide detailed feedback with a score out of 10.`
      });
      
      // Extract score from feedback if present
      const feedbackText = response.data.response;
      const scoreMatch = feedbackText.match(/(\d{1,2})\/10/);
      if (scoreMatch) {
        setScore(parseInt(scoreMatch[1]));
      }
      
      setFeedback(feedbackText);
    } catch (error) {
      setFeedback('I apologize, but I had trouble analyzing your story. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNewSituation = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/storytelling/api/get-test-situation/');
      setSituation(response.data.description);
      setUserStory('');
      setFeedback('');
      setScore(null);
    } catch (error) {
      setSituation('Failed to load new test situation. Please try again.');
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
            Story Telling Test
          </Typography>
        </Box>

        {/* Test Situation Section */}
        <Section elevation={3}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Test Situation
            </Typography>
            <Button 
              variant="outlined" 
              onClick={handleNewSituation}
              disabled={loading}
            >
              Get New Situation
            </Button>
          </Box>
          <Typography variant="body1" sx={{ minHeight: '80px' }}>
            {loading ? <CircularProgress size={24} /> : situation}
          </Typography>
        </Section>

        {/* Story Input Section */}
        <Section elevation={3}>
          <Typography variant="h6" gutterBottom>
            Your Response
          </Typography>
          
          <TextField
            fullWidth
            multiline
            rows={6}
            variant="outlined"
            value={userStory}
            InputProps={{
              readOnly: true,
            }}
            placeholder="Your spoken response will appear here..."
            disabled={loading}
          />
          
          <Box sx={{ 
            mt: 2, 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            {isRecording && (
              <Typography variant="h6" color="error">
                Time Remaining: {formatTime(timeLeft)}
              </Typography>
            )}
            
            <Box sx={{ 
              display: 'flex',
              alignItems: 'center',
              gap: 2 
            }}>
              <VoiceInput 
                onTranscript={setUserStory}
                disabled={loading}
                onStart={handleVoiceStart}
                onEnd={handleVoiceEnd}
              />
              <Button
                variant="contained"
                endIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
                onClick={handleSubmitStory}
                disabled={loading || !userStory.trim() || isRecording}
              >
                Submit Response
              </Button>
            </Box>
          </Box>
        </Section>

        {/* Feedback and Score Section */}
        {(feedback || score !== null) && (
          <Section elevation={3}>
            {score !== null && (
              <>
                <Typography variant="h6" gutterBottom>
                  Your Score
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  my: 3 
                }}>
                  <Typography variant="h2" color="primary">
                    {score}/10
                  </Typography>
                </Box>
                <Divider sx={{ my: 3 }} />
              </>
            )}
            
            <Typography variant="h6" gutterBottom>
              Feedback & Analysis
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                whiteSpace: 'pre-line',
                '& ul': { 
                  listStyle: 'none',
                  padding: 0,
                  '& li': {
                    marginBottom: 1
                  }
                }
              }}
            >
              {feedback}
            </Typography>
          </Section>
        )}
      </Box>
    </Container>
  );
};

export default StoryTellingTest; 