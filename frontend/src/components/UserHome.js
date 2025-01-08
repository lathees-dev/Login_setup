import React, { useEffect, useState } from 'react';
import { Box, Typography, Container, IconButton, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import LogoutIcon from '@mui/icons-material/Logout';

// Styled components
const SliderContainer = styled(Box)({
  position: 'relative',
  padding: '20px 0',
  '&:hover .slider-arrow': {
    opacity: 1,
  },
});

const SliderWrapper = styled(Box)({
  display: 'flex',
  overflowX: 'hidden',
  scrollBehavior: 'smooth',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
});

const SliderCard = styled(Box)({
  minWidth: '200px',
  height: '150px',
  margin: '0 10px',
  position: 'relative',
  backgroundColor: '#1e1e1e',
  borderRadius: '8px',
  transition: 'transform 0.3s, box-shadow 0.3s',
  cursor: 'pointer',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
    '& .card-title': {
      backgroundColor: 'rgb(105, 163, 226)',
    },
  },
});

const CardImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  borderRadius: '8px',
});

const CardTitle = styled(Typography)({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  padding: '10px',
  background: 'rgba(0, 0, 0, 0.7)',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textAlign: 'center',
  borderBottomLeftRadius: '8px',
  borderBottomRightRadius: '8px',
  transition: 'background-color 0.3s',
});

const SliderArrow = styled(IconButton)({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  color: '#fff',
  opacity: 0,
  transition: 'opacity 0.3s',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  zIndex: 1,
});

const Header = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '20px 0',
  marginBottom: '20px',
});

const categories = [
  {
    title: 'Communication Skills',
    items: [
      { title: 'Communication', image: 'https://via.placeholder.com/200x150?text=Communication', link: '/communication' },
      { title: 'Self Intro', image: 'https://via.placeholder.com/200x150?text=Self+Intro', link: '/self-intro' },
      { title: 'Presentation', image: 'https://via.placeholder.com/200x150?text=Presentation', link: '/presentation' },
    ]
  },
  {
    title: 'Professional Development',
    items: [
      { title: 'Resume', image: 'https://via.placeholder.com/200x150?text=Resume', link: '/resume' },
      { title: 'Interview', image: 'https://via.placeholder.com/200x150?text=Interview', link: '/interview' },
      { title: 'GD', image: 'https://via.placeholder.com/200x150?text=Group+Discussion', link: '/gd' },
    ]
  },
  {
    title: 'Business Skills',
    items: [
      { title: 'BMC Pitching', image: 'https://via.placeholder.com/200x150?text=BMC+Pitiching', link: '/bmc-pitching' },
      { title: 'Networking', image: 'https://via.placeholder.com/200x150?text=Networking', link: '/networking' },
      { title: 'Outfit', image: 'https://via.placeholder.com/200x150?text=Outfit', link: '/outfit' },
    ]
  }
];

const UserHome = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) {
      navigate('/login');
      return;
    }
    const parsedUser = JSON.parse(userInfo);
    if (parsedUser.user_type === 'admin') {
      navigate('/admin-home');
      return;
    }
    setUser(parsedUser);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  const scroll = (elementId, direction) => {
    const container = document.getElementById(elementId);
    const scrollAmount = 400; // Adjust scroll amount as needed
    container.scrollLeft += direction * scrollAmount;
  };

  if (!user) return null;

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      backgroundColor: '#121212', 
      color: '#fff',
      py: 4 
    }}>
      <Container maxWidth="xl">
        <Header>
          <Box>
            <Typography variant="h4" component="h1">
              AI Trainer
            </Typography>
            <Typography variant="subtitle1" sx={{ mt: 1 }}>
              Welcome, {user.name}!
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            color="error" 
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Header>

        {categories.map((category, categoryIndex) => (
          <SliderContainer key={categoryIndex}>
            <Typography variant="h5" sx={{ mb: 2, ml: 1 }}>
              {category.title}
            </Typography>

            <SliderArrow
              className="slider-arrow"
              sx={{ left: 0 }}
              onClick={() => scroll(`slider-${categoryIndex}`, -1)}
            >
              <ArrowBackIosIcon />
            </SliderArrow>

            <SliderWrapper id={`slider-${categoryIndex}`}>
              {category.items.map((item, index) => (
                <SliderCard key={index} onClick={() => navigate(item.link)}>
                  <CardImage src={item.image} alt={item.title} />
                  <CardTitle className="card-title">
                    {item.title}
                  </CardTitle>
                </SliderCard>
              ))}
            </SliderWrapper>

            <SliderArrow
              className="slider-arrow"
              sx={{ right: 0 }}
              onClick={() => scroll(`slider-${categoryIndex}`, 1)}
            >
              <ArrowForwardIosIcon />
            </SliderArrow>
          </SliderContainer>
        ))}
      </Container>
    </Box>
  );
};

export default UserHome;