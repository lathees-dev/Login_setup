import React, { useState } from 'react';
import { IconButton, CircularProgress, Box, Typography } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';

const VoiceInput = ({ onTranscript, disabled }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);

  const startRecording = () => {
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        
        onTranscript(transcript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        stopRecording();
      };

      recognition.start();
      setRecognition(recognition);
      setIsRecording(true);
    } catch (error) {
      console.error('Speech recognition not supported:', error);
      alert('Speech recognition is not supported in your browser. Please use Chrome or Edge.');
    }
  };

  const stopRecording = () => {
    if (recognition) {
      recognition.stop();
      setRecognition(null);
    }
    setIsRecording(false);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <IconButton
        color={isRecording ? 'error' : 'primary'}
        onClick={isRecording ? stopRecording : startRecording}
        disabled={disabled}
      >
        {isRecording ? <StopIcon /> : <MicIcon />}
      </IconButton>
      {isRecording && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CircularProgress size={20} color="error" />
          <Typography variant="caption" color="error">
            Recording...
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default VoiceInput; 