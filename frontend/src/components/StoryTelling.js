import React, { useState, useEffect } from 'react';
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
import axios from '../config/axios';
import VoiceInput from './VoiceInput';

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

const StoryTelling = () => {
  const navigate = useNavigate();
  const [scenario, setScenario] = useState('');
  const [userStory, setUserStory] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  // Get initial scenario when component mounts
  useEffect(() => {
    const getScenario = async () => {
      setLoading(true);
      try {
        const response = await axios.post('/storytelling/api/chat-with-assistant/', {
          message: 'Hi, I want to practice storytelling. Please provide a scenario.'
        });
        setScenario(response.data.response);
      } catch (error) {
        setScenario('I apologize, but I had trouble generating a scenario. Please try refreshing the page.');
      } finally {
        setLoading(false);
      }
    };
    getScenario();
  }, []);

  const handleSubmitStory = async () => {
    if (!userStory.trim()) return;
    
    setLoading(true);
    try {
      const response = await axios.post('/storytelling/api/chat-with-assistant/', {
        message: `Original Scenario: "${scenario}"\n\nUser's Story: ${userStory}\n\nPlease analyze this story in relation to the given scenario.`
      });
      setFeedback(response.data.response);
    } catch (error) {
      setFeedback('I apologize, but I had trouble analyzing your story. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNewScenario = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/storytelling/api/chat-with-assistant/', {
        message: 'Please provide a new scenario for storytelling practice.'
      });
      setScenario(response.data.response);
      setUserStory('');
      setFeedback('');
    } catch (error) {
      setScenario('I apologize, but I had trouble generating a new scenario. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceInput = (transcript) => {
    setUserStory(transcript);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
          <IconButton onClick={() => navigate('/user-home')} color="primary">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4">
            Story Telling Practice
          </Typography>
        </Box>

        {/* Scenario Section */}
        <Section elevation={3}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Scenario
            </Typography>
            <Button 
              variant="outlined" 
              onClick={handleNewScenario}
              disabled={loading}
            >
              Get New Scenario
            </Button>
          </Box>
          <Typography variant="body1" sx={{ minHeight: '80px' }}>
            {loading ? <CircularProgress size={24} /> : scenario}
          </Typography>
        </Section>

        {/* Story Input Section */}
        <Section elevation={3}>
          <Typography variant="h6" gutterBottom>
            Your Story
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={6}
            variant="outlined"
            value={userStory}
            onChange={(e) => setUserStory(e.target.value)}
            placeholder="Write or speak your story here based on the scenario above..."
            disabled={loading}
          />
          <Box sx={{ 
            mt: 2, 
            display: 'flex', 
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: 2 
          }}>
            <VoiceInput 
              onTranscript={handleVoiceInput}
              disabled={loading}
            />
            <Button
              variant="contained"
              endIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
              onClick={handleSubmitStory}
              disabled={loading || !userStory.trim()}
            >
              Submit Story
            </Button>
          </Box>
        </Section>

        {/* Feedback Section */}
        {feedback && (
          <Section elevation={3}>
            <Typography variant="h6" gutterBottom>
              Feedback & Suggestions
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

export default StoryTelling; 