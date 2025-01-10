import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Paper,
  Alert,
  Container,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";
import ReplayIcon from "@mui/icons-material/Replay";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const PageContainer = styled(Box)({
  minHeight: "100vh",
  background: "linear-gradient(135deg, #58CC02 0%, #2B8500 100%)",
  padding: "2rem 0",
});

const TestContainer = styled(Paper)({
  maxWidth: "800px",
  margin: "0 auto",
  padding: "2rem",
  display: "flex",
  flexDirection: "column",
  gap: "2rem",
  backgroundColor: "rgba(255, 255, 255, 0.95)",
  borderRadius: "16px",
});

const SituationCard = styled(Paper)({
  padding: "2rem",
  backgroundColor: "#f8f9fa",
  borderRadius: "12px",
  border: "1px solid #e0e0e0",
  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
});

const RecordingControls = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "1.5rem",
  padding: "2rem",
});

const RecordButton = styled(Button)(({ recording }) => ({
  width: "80px",
  height: "80px",
  borderRadius: "50%",
  minWidth: "unset",
  backgroundColor: recording ? "#ff4444" : "#4CAF50",
  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
  "&:hover": {
    backgroundColor: recording ? "#ff6666" : "#45a049",
    transform: "scale(1.05)",
  },
  transition: "all 0.3s ease",
}));

const Timer = styled(Typography)({
  fontSize: "2rem",
  fontWeight: "bold",
  color: "#333",
  fontFamily: "monospace",
});

const Instructions = styled(Typography)({
  color: "#666",
  textAlign: "center",
  marginBottom: "1rem",
});

const ScoreDisplay = styled(Box)({
  textAlign: "center",
  padding: "2rem",
  backgroundColor: "#f0f7ff",
  borderRadius: "12px",
  "& .score-value": {
    fontSize: "3rem",
    color: "#2196f3",
    fontWeight: "bold",
  },
});

const StoryTellingTest = () => {
  const navigate = useNavigate();
  const [situation, setSituation] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [score, setScore] = useState(null);
  const [error, setError] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (!userInfo) {
      navigate("/login");
      return;
    }
    fetchSituation();
    return () => {
      stopTimer();
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
    };
  }, [navigate]);

  const fetchSituation = async () => {
    try {
      const response = await fetch("/api/start-test/", {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("userInfo")).token
          }`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch situation");
      const data = await response.json();
      setSituation(data.situation);
    } catch (err) {
      setError("Failed to load test situation. Please try again.");
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      startTimer();
    } catch (err) {
      setError("Failed to access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      stopTimer();
      setIsRecording(false);

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        await submitRecording(audioBlob);
      };
    }
  };

  const startTimer = () => {
    setRecordingTime(0);
    timerRef.current = setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(timerRef.current);
  };

  const submitRecording = async (audioBlob) => {
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.append("audio_file", audioBlob, "recording.wav");

    try {
      const response = await fetch("/api/submit-test/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to submit recording");

      const data = await response.json();
      setScore(data.score);
    } catch (err) {
      setError("Failed to submit recording. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetTest = () => {
    setScore(null);
    setRecordingTime(0);
    setError(null);
    fetchSituation();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <PageContainer>
      <Container maxWidth="lg">
        <Box mb={3} display="flex" alignItems="center">
          <IconButton
            onClick={() => navigate(-1)}
            sx={{ color: "#fff", marginRight: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" color="white">
            Story Telling Test
          </Typography>
        </Box>

        <TestContainer elevation={3}>
          {error && (
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {!score && (
            <Instructions variant="h6">
              Read the situation carefully and record your response. Try to
              speak for at least 1 minute.
            </Instructions>
          )}

          <SituationCard elevation={1}>
            <Typography variant="h6" gutterBottom color="primary">
              Situation:
            </Typography>
            <Typography variant="body1">
              {situation?.description || "Loading..."}
            </Typography>
          </SituationCard>

          <RecordingControls>
            <Timer>{formatTime(recordingTime)}</Timer>

            {!score && (
              <>
                <RecordButton
                  variant="contained"
                  recording={isRecording}
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={isSubmitting}
                >
                  {isRecording ? (
                    <StopIcon sx={{ fontSize: 32 }} />
                  ) : (
                    <MicIcon sx={{ fontSize: 32 }} />
                  )}
                </RecordButton>
                <Typography variant="body2" color="textSecondary">
                  {isRecording
                    ? "Click to stop recording"
                    : "Click to start recording"}
                </Typography>
              </>
            )}

            {isSubmitting && (
              <Box textAlign="center">
                <CircularProgress />
                <Typography variant="body2" color="textSecondary" mt={1}>
                  Analyzing your response...
                </Typography>
              </Box>
            )}

            {score !== null && (
              <ScoreDisplay>
                <Typography variant="h6" gutterBottom>
                  Your Score
                </Typography>
                <Typography className="score-value">{score}/100</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<ReplayIcon />}
                  onClick={resetTest}
                  sx={{ marginTop: 2 }}
                >
                  Try Another Situation
                </Button>
              </ScoreDisplay>
            )}
          </RecordingControls>
        </TestContainer>
      </Container>
    </PageContainer>
  );
};

export default StoryTellingTest;
