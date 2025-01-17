import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tabs,
  Tab,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import axios from "../../config/axios";
import AdminSidebar from "./AdminSidebar";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAdmins: 0,
  });
  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchUsers();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get("/api/users/stats/");
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/users/all/");
      const allUsers = response.data;
      setUsers(allUsers.filter((user) => user.user_type === "user"));
      setAdmins(allUsers.filter((user) => user.user_type === "admin"));
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`/api/users/${userId}/`);
        fetchUsers();
        fetchStats();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AdminSidebar />
      <Box sx={{ flexGrow: 1 }}>
        <Container maxWidth="lg">
          <Box sx={{ py: 4 }}>
            <Typography variant="h4" sx={{ mb: 4 }}>
              Admin Dashboard
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6}>
                <Card sx={{ bgcolor: "primary.light" }}>
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <PersonIcon sx={{ fontSize: 40 }} />
                      <Box>
                        <Typography variant="h6">Total Users</Typography>
                        <Typography variant="h3">{stats.totalUsers}</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card sx={{ bgcolor: "secondary.light" }}>
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <AdminPanelSettingsIcon sx={{ fontSize: 40 }} />
                      <Box>
                        <Typography variant="h6">Total Admins</Typography>
                        <Typography variant="h3">
                          {stats.totalAdmins}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Paper sx={{ width: "100%", mb: 2 }}>
              <Tabs value={activeTab} onChange={handleTabChange}>
                <Tab label="Users" />
                <Tab label="Admins" />
              </Tabs>

              <TableContainer sx={{ mt: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Created At</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(activeTab === 0 ? users : admins).map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          {new Date(user.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => console.log("Edit user:", user.id)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
