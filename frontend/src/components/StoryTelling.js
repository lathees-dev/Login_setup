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
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import { useNavigate } from 'react-router-dom';
import axios from '../config/axios';
import VoiceInput from './VoiceInput';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { v4 as uuidv4 } from 'uuid';

const ChatContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  backgroundColor: '#fff',
  height: '60vh',
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
}));

const InputContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(1),
  backgroundColor: '#f0f0f0',
}));

const UserMessage = styled(ListItem)(({ theme }) => ({
  justifyContent: 'flex-end',
  textAlign: 'right',
  paddingRight: theme.spacing(2),
}));

const BotMessage = styled(ListItem)(({ theme }) => ({
  justifyContent: 'flex-start',
  textAlign: 'left',
  paddingLeft: theme.spacing(2),
}));

const StoryTelling = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef(null);
  const [conversationId, setConversationId] = useState(localStorage.getItem('conversationId') || uuidv4());
  const [conversationHistory, setConversationHistory] = useState([]);

  useEffect(() => {
    // Initial bot message
    addBotMessage("Hi, I'm your storytelling guide! I'm here to help you improve your skills. Let's start with a scenario or any questions you have about storytelling.");
    localStorage.setItem('conversationId', conversationId);
  }, [conversationId]);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const addBotMessage = (text) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { text, sender: 'bot' },
    ]);
    setConversationHistory((prevHistory) => [
      ...prevHistory,
      { text, sender: 'bot' },
    ]);
  };

  const addUserMessage = (text) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { text, sender: 'user' },
    ]);
    setConversationHistory((prevHistory) => [
      ...prevHistory,
      { text, sender: 'user' },
    ]);
  };

  const handleSendMessage = async () => {
    if (!userMessage.trim()) return;
    
    addUserMessage(userMessage);
    setUserMessage('');
    setLoading(true);

    try {
      const response = await axios.post('/storytelling/api/chat-with-assistant/', {
        message: userMessage,
        conversationHistory: conversationHistory,
      });
      addBotMessage(response.data.response);
    } catch (error) {
      addBotMessage('I apologize, but I had trouble processing your request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceInput = (transcript) => {
    setUserMessage(transcript);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
          <IconButton onClick={() => navigate('/story-telling')} color="primary">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4">
            Story Telling Practice
          </Typography>
        </Box>

        <ChatContainer ref={chatContainerRef}>
          <List>
            {messages.map((message, index) => (
              <ListItem key={index} sx={{ p: 1 }}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: message.sender === 'user' ? 'primary.main' : 'secondary.main' }}>
                    {message.sender === 'user' ? <AccountCircleIcon /> : <SmartToyIcon />}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography
                      variant="body1"
                      sx={{
                        whiteSpace: 'pre-line',
                        textAlign: message.sender === 'user' ? 'right' : 'left',
                      }}
                    >
                      {message.text}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
            {loading && (
              <ListItem sx={{ justifyContent: 'flex-start', p: 1 }}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'secondary.main' }}>
                    <SmartToyIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="body1">
                      <CircularProgress size={20} />
                    </Typography>
                  }
                />
              </ListItem>
            )}
          </List>
        </ChatContainer>

        <InputContainer>
          <TextField
            fullWidth
            variant="outlined"
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            placeholder="Type your message here..."
            disabled={loading}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
          />
          <VoiceInput 
            onTranscript={handleVoiceInput}
            disabled={loading}
          />
          <Button
            variant="contained"
            endIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
            onClick={handleSendMessage}
            disabled={loading || !userMessage.trim()}
          >
            Send
          </Button>
        </InputContainer>
      </Box>
    </Container>
  );
};

export default StoryTelling; 