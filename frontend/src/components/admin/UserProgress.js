import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  CircularProgress,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import axios from '../../config/axios';
import AdminSidebar from './AdminSidebar';

const UserProgress = () => {
  const { userId } = useParams();
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProgress = async () => {
      try {
        const response = await axios.get(`/api/users-admin/progress/${userId}`);
        setProgress(response.data);
      } catch (err) {
        setError('Failed to fetch user progress');
        console.error('Error fetching user progress:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProgress();
  }, [userId]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ display: 'flex' }}>
      <AdminSidebar />
      <Box sx={{ flexGrow: 1 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ mb: 4 }}>
            User Progress
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Completed Modules</Typography>
                  <Typography variant="h3">{progress?.completedModules || 0}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Total Score</Typography>
                  <Typography variant="h3">{progress?.totalScore || 0}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Progress Percentage</Typography>
                  <Typography variant="h3">
                    {progress?.progressPercentage || 0}%
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default UserProgress; 