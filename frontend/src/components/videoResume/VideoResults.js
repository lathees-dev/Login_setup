import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, CircularProgress } from "@mui/material";

const VideoResults = () => {
  const { resume_transcription_id } = useParams();
  const [transcription, setTranscription] = useState("");
  const [evaluation, setEvaluation] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/videoResume/results/${resume_transcription_id}/`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch results");
        }

        const data = await response.json();
        setTranscription(data.transcription);
        setEvaluation(data.evaluation);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [resume_transcription_id]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  console.log("Transcription:", transcription);
  console.log("Evaluation:", evaluation);

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4">Transcription Results</Typography>
      <Typography variant="h6">Transcription:</Typography>
      <Typography>{transcription}</Typography>
      <Typography variant="h6">Evaluation:</Typography>
      <Typography>{evaluation}</Typography>
    </Box>
  );
};

export default VideoResults;
