import React, { useEffect, useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SchoolIcon from '@mui/icons-material/School';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import AssignmentIcon from '@mui/icons-material/Assignment';

const OptionCard = styled(Card)(({ theme }) => ({
  height: '200px',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const CardIcon = styled(Box)(({ theme }) => ({
    fontSize: '4rem',
    marginBottom: theme.spacing(2),
    color: theme.palette.primary.main,
  }));

const CommunicationOptions = () => {
  const navigate = useNavigate();
  const options = [
    {
      title: 'Learn',
      description: 'Learn the fundamentals of Communication',
      icon: <SchoolIcon sx={{ fontSize: '4rem' }} />,
     
    },
    {
      title: 'Practice',
      description: 'Practice your Communication skills',
      icon: <SportsEsportsIcon sx={{ fontSize: '4rem' }} />,
      
    },
    {
      title: 'Test',
      description: 'Test your Communication abilities',
      icon: <AssignmentIcon sx={{ fontSize: '4rem' }} />,
     
    }
  ];
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
          <IconButton onClick={() => navigate('/user-home')} color="primary">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1">
            Communication Options
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {options.map((option) => (
            <Grid item xs={12} md={4} key={option.title}>
              <OptionCard elevation={3}>
                <CardActionArea 
                  onClick={() => navigate(option.path)}
                  sx={{ height: '100%' }}
                >
                  <CardContent sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center'
                  }}>
                    <CardIcon>
                      {option.icon}
                    </CardIcon>
                    <Typography variant="h5" component="h2" gutterBottom>
                      {option.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {option.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </OptionCard>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};


export default CommunicationOptions; 