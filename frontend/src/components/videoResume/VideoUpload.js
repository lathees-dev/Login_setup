import React, { useState } from "react";
import { Button, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const VideoUpload = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    setVideoFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!videoFile) {
      setError("Please select a video file.");
      return;
    }

    const formData = new FormData();
    formData.append("video_resume", videoFile);

    try {
      const response = await fetch(
        "http://localhost:8000/videoResume/upload/",
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        navigate(`/videoResume/results/${data.transcription_id}`);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Upload failed.");
      }
    } catch (error) {
      setError("An error occurred while uploading the video.");
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4">Upload Video Resume</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <input type="file" accept="video/mp4" onChange={handleFileChange} />
      <Button variant="contained" onClick={handleUpload} sx={{ mt: 2 }}>
        Upload
      </Button>
    </Box>
  );
};

export default VideoUpload;
