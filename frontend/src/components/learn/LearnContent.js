import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Button,
  Container,
  Divider,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRoadmap } from '../../context/RoadmapContext';

const LearnContent = () => {
  const { nodeId } = useParams();
  const navigate = useNavigate();
  const { roadmapNodes } = useRoadmap();
  const [activeTab, setActiveTab] = useState(0);

  // Find the current node
  const currentNode = roadmapNodes.find(node => node.id === parseInt(nodeId));
  const learnContent = currentNode?.learnContent || {};

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (!currentNode) {
    return <Typography>Content not found</Typography>;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mb: 3 }}
        >
          Back
        </Button>

        <Typography variant="h4" gutterBottom>
          {currentNode.title}
        </Typography>

        <Paper sx={{ mt: 3 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={activeTab} onChange={handleTabChange}>
              <Tab label="Introduction" />
              <Tab label="Content" />
              <Tab label="Examples" />
              <Tab label="Practice" />
              <Tab label="Summary" />
            </Tabs>
          </Box>

          <Box sx={{ p: 3 }}>
            {activeTab === 0 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Introduction
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                  {learnContent.introduction || 'No introduction content available.'}
                </Typography>
              </Box>
            )}

            {activeTab === 1 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Main Content
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                  {learnContent.content || 'No main content available.'}
                </Typography>
              </Box>
            )}

            {activeTab === 2 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Examples
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                  {learnContent.examples || 'No examples available.'}
                </Typography>
              </Box>
            )}

            {activeTab === 3 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Practice Exercises
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                  {learnContent.practice || 'No practice exercises available.'}
                </Typography>
              </Box>
            )}

            {activeTab === 4 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Summary
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                  {learnContent.summary || 'No summary available.'}
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default LearnContent; 