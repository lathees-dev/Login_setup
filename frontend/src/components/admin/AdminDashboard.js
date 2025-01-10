import React from "react";
import { Box, Typography, Grid, Button } from "@mui/material";
import AdminSidebar from "./AdminSidebar";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userInfo"); // Clear user data
    navigate("/login");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AdminSidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Typography variant="h4">Welcome, Admin</Typography>
          <Button
            variant="outlined"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
        {/* Add dashboard content */}
      </Box>
    </Box>
  );
};

export default AdminDashboard;
