import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Drawer,
  List,
  ListItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PersonIcon from "@mui/icons-material/Person";
import DashboardIcon from "@mui/icons-material/Dashboard";
import StarIcon from "@mui/icons-material/Star";
import LockIcon from "@mui/icons-material/Lock";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { motion } from "framer-motion";
import MenuIcon from "@mui/icons-material/Menu";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import HomeIcon from "@mui/icons-material/Home";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const PageContainer = styled(Box)({
  minHeight: "100vh",
  background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)",
  padding: "2rem 0",
  overflow: "auto",
});

const Header = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0 2rem",
  marginBottom: "3rem",
  color: "#333",
});

const RoadmapContainer = styled(Box)({
  position: "relative",
  maxWidth: "600px",
  margin: "0 auto",
  padding: "2rem",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});

const MapPath = styled("svg")({
  position: "absolute",
  top: 0,
  left: "50%",
  transform: "translateX(-50%)",
  height: "100%",
  width: "100px",
  zIndex: 0,
  "& path": {
    fill: "none",
    stroke: "rgba(0, 0, 0, 0.2)",
    strokeWidth: 8,
    strokeLinecap: "round",
    strokeDasharray: "0, 20",
  },
});

const NodesContainer = styled(Box)({
  position: "relative",
  zIndex: 1,
  display: "flex",
  flexDirection: "column",
  gap: "2rem",
  alignItems: "center",
  width: "100%",
});

const NodeWrapper = styled(Box)(({ position }) => ({
  width: "100%",
  display: "flex",
  justifyContent: position === "left" ? "flex-end" : "flex-start",
  paddingLeft: position === "left" ? 0 : "55%",
  paddingRight: position === "left" ? "55%" : 0,
}));

const Node = styled(Box)(({ completed, locked, isTest }) => ({
  position: "relative",
  width: "150px",
  height: "150px",
  cursor: locked ? "not-allowed" : "pointer",
  transition: "transform 0.3s, filter 0.3s",
  filter: locked ? "grayscale(100%)" : "none",
  opacity: locked ? 0.7 : 1,
  "&:hover": {
    transform: locked ? "none" : "scale(1.1)",
  },
}));

const NodeCircle = styled(Box)(({ completed, isTest }) => ({
  width: "100%",
  height: "100%",
  borderRadius: "50%",
  background: isTest
    ? "linear-gradient(45deg, #FF9600 30%, #FFB800 90%)"
    : completed
    ? "linear-gradient(45deg, #58CC02 30%, #76CF2B 90%)"
    : "linear-gradient(45deg, #1CB0F6 30%, #38C5FF 90%)",
  boxShadow: "0 8px 0 rgba(0,0,0,0.2)",
  border: "5px solid #fff",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  color: "#fff",
  position: "relative",
  padding: "10px",
  overflow: "hidden",
}));

const NodeIcon = styled(Box)({
  fontSize: "2.5rem",
  marginBottom: "0.5rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const NodeTitle = styled(Typography)({
  fontSize: "0.9rem",
  textAlign: "center",
  fontWeight: "bold",
  padding: "0 0.5rem",
  color: "#fff",
  wordWrap: "break-word",
  maxWidth: "100%",
  lineHeight: 1.2,
});

const StarsContainer = styled(Box)({
  position: "absolute",
  top: "-30px",
  left: "50%",
  transform: "translateX(-50%)",
  display: "flex",
  gap: "5px",
});

const Star = styled(StarIcon)(({ filled }) => ({
  color: filled ? "#ffd700" : "#ffffff44",
  fontSize: "1.6rem",
}));

const LevelNumber = styled(Typography)({
  position: "absolute",
  top: "-25px",
  left: "50%",
  transform: "translateX(-50%)",
  background: "#fff",
  borderRadius: "50%",
  width: "24px",
  height: "24px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "0.8rem",
  fontWeight: "bold",
  color: "#1a237e",
});

const LevelBadge = styled(Box)({
  position: "absolute",
  top: "-10px",
  left: "-10px",
  width: "30px",
  height: "30px",
  borderRadius: "50%",
  background: "#fff",
  color: "#58CC02",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "bold",
  fontSize: "0.9rem",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
});

const AnimatedNode = motion(Node);
const nodeVariants = {
  initial: { scale: 0 },
  animate: { scale: 1 },
  hover: { scale: 1.1 },
};

const roadmapData = [
  {
    id: 1,
    title: "Introduction to Communication",
    completed: true,
    stars: 3,
    position: "left",
  },
  {
    id: 2,
    title: "Grammar / Sentence Framing",
    completed: true,
    stars: 2,
    position: "right",
  },
  {
    id: 3,
    title: "Vocabulary Development",
    completed: false,
    stars: 0,
    position: "left",
  },
  {
    id: 4,
    title: "Conversational Skills",
    completed: false,
    locked: true,
    position: "right",
  },
  {
    id: 5,
    title: "Scenario based self intro",
    locked: true,
    position: "left",
  },
  {
    id: 6,
    title: "Storytelling Techniques",
    locked: false,
    position: "right",
    link: '/story-telling'
  },
  {
    id: 7,
    title: "Public Speaking Basics",
    locked: true,
    position: "left",
  },
  {
    id: 8,
    title: "Self Intro Basics",
    locked: true,
    position: "right",
  },
  {
    id: 9,
    title: "Video Resume Creation",
    locked: true,
    position: "left",
    link: "/video-resume",
  },
  {
    id: 10,
    title: "Group Discussion Skills",
    locked: true,
    position: "right",
  },
  {
    id: 11,
    title: "Debate Basics",
    locked: true,
    position: "left",
  },
  {
    id: 12,
    title: "Written Communication",
    locked: true,
    position: "right",
  },
  {
    id: 13,
    title: "Networking Etiquette",
    locked: true,
    position: "left",
  },
  {
    id: 14,
    title: "LinkedIn Training",
    locked: true,
    position: "right",
  },
  {
    id: 15,
    title: "Personal Presentation",
    locked: true,
    position: "left",
  },
  {
    id: 16,
    title: "Memory Activities",
    locked: true,
    position: "right",
  },
  {
    id: 17,
    title: "Personal Branding",
    locked: true,
    position: "left",
  },
  {
    id: 18,
    title: "Resume Creation",
    locked: true,
    position: "right",
  },
  {
    id: 19,
    title: "Presentation Skills",
    locked: true,
    position: "left",
  },
  {
    id: 20,
    title: "BMC Pitching",
    locked: true,
    position: "right",
  },
  {
    id: 21,
    title: "Mock Interview",
    locked: true,
    position: "left",
  },
  {
    id: 22,
    title: "Speed Networking",
    locked: true,
    position: "right",
  },
  {
    id: 23,
    title: "Speed Interview",
    locked: true,
    position: "left",
  },
  {
    id: 24,
    title: "Final Test",
    isTest: true,
    locked: true,
    position: "right",
  },
];

const Sidebar = styled(Drawer)(({ open }) => ({
  "& .MuiDrawer-paper": {
    width: open ? 240 : 70,
    boxSizing: "border-box",
    backgroundColor: "#fff",
    borderRight: "1px solid rgba(0, 0, 0, 0.12)",
    transition: "width 0.3s ease",
    overflowX: "hidden",
    whiteSpace: "nowrap",
    position: "fixed",
  },
  "& .MuiDrawer-root": {
    position: "relative",
  },
}));

const SidebarItem = styled(ListItem)({
  padding: "12px 16px",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.04)",
  },
  display: "flex",
  gap: "12px",
  alignItems: "center",
});

const MainContent = styled(Box)(({ open }) => ({
  marginLeft: open ? "240px" : "70px",
  width: open ? "calc(100% - 240px)" : "calc(100% - 70px)",
  transition: "margin 0.3s ease, width 0.3s ease",
}));

const ProfileSection = styled(Box)({
  padding: "1rem",
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
  justifyContent: "space-between",
  minHeight: "72px",
  width: "100%",
});

const UserHome = () => {
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (!userInfo) {
      navigate("/login");
      return;
    }
    const parsedUser = JSON.parse(userInfo);
    if (parsedUser.user_type === "admin") {
      navigate("/admin-home");
      return;
    }
    setUser(parsedUser);
  }, [navigate]);

  const renderNode = (item) => (
    <NodeWrapper position={item.position}>
      <AnimatedNode
        variants={nodeVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        completed={item.completed}
        locked={item.locked}
        isTest={item.isTest}
        onClick={() => {
          if (!item.locked && item.link) {
            navigate(item.link);
          }
        }}
        sx={{ cursor: item.locked ? 'not-allowed' : 'pointer' }}
      >
        <NodeCircle completed={item.completed} isTest={item.isTest}>
          {!item.isTest && (
            <StarsContainer>
              {[1, 2, 3].map((star) => (
                <Star key={star} filled={star <= item.stars} />
              ))}
            </StarsContainer>
          )}
          <NodeIcon>
            {item.locked ? (
              <LockIcon />
            ) : item.isTest ? (
              <EmojiEventsIcon sx={{ fontSize: "2rem" }} />
            ) : (
              item.icon || <StarIcon />
            )}
          </NodeIcon>
          <NodeTitle>{item.title}</NodeTitle>
        </NodeCircle>
      </AnimatedNode>
    </NodeWrapper>
  );

  const sidebarItems = [
    {
      icon: <HomeIcon />,
      text: "Home",
      onClick: () => navigate("/user-home"),
    },
    {
      icon: <SmartToyIcon />,
      text: "AI Trainer",
      onClick: () => navigate("/ai-trainer"),
    },
    {
      icon: <PersonIcon />,
      text: "Profile Info",
      onClick: () => navigate("/profile"),
    },
    {
      icon: <DashboardIcon />,
      text: "Dashboard",
      onClick: () => navigate("/dashboard"),
    },
  ];

  if (!user) return null;

  const firstName = user.name.split(" ")[0];

  return (
    <Box display="flex">
      <Sidebar variant="permanent" open={isSidebarOpen} anchor="left">
        <ProfileSection>
          <Box display="flex" alignItems="center" gap={1}>
            <IconButton size="large">
              <AccountCircleIcon sx={{ fontSize: 40, color: "#00796b" }} />
            </IconButton>
            {isSidebarOpen && (
              <Typography variant="subtitle1" noWrap>
                {firstName}
            </Typography>
            )}
          </Box>
          <IconButton
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            sx={{
              minWidth: "40px",
              visibility: "visible",
              position: "absolute",
              right: "8px",
            }}
          >
            {isSidebarOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </ProfileSection>
        <List>
          {sidebarItems.map((item, index) => (
            <SidebarItem key={index} onClick={item.onClick}>
              {item.icon}
              {isSidebarOpen && (
                <Typography
                  sx={{
                    opacity: isSidebarOpen ? 1 : 0,
                    transition: "opacity 0.3s ease",
                  }}
                >
                  {item.text}
            </Typography>
              )}
            </SidebarItem>
          ))}
        </List>
      </Sidebar>

      <MainContent open={isSidebarOpen}>
        <PageContainer>
          <Header>
            <Box>
              <Typography
                variant="h4"
                sx={{ color: "#00796b", fontWeight: "600" }}
              >
                Communication Training Roadmap
              </Typography>
              <Typography variant="h6" sx={{ color: "#666666", mt: 1 }}>
                Welcome, {firstName}!
              </Typography>
            </Box>
          </Header>
          <RoadmapContainer>
            <MapPath>
              <path
                d="M50,0 Q60,50 40,100 Q60,150 40,200 Q60,250 40,300 Q60,350 40,400 Q60,450 40,500 Q60,550 40,600"
                // Zigzag path
              />
            </MapPath>
            <NodesContainer>
              {roadmapData.map((item) => renderNode(item))}
            </NodesContainer>
          </RoadmapContainer>
        </PageContainer>
      </MainContent>
    </Box>
  );
};

export default UserHome;
