import React, { useState, useEffect } from 'react';
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
  ButtonGroup,
  Alert,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from '../../config/axios';
import AdminSidebar from './AdminSidebar';
import { Link } from 'react-router-dom';
import AssessmentIcon from '@mui/icons-material/Assessment';

const AdminDashboard = () => {
  const [selectedView, setSelectedView] = useState('user');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAdmins: 0
  });
  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setError(null);
      await Promise.all([fetchUsers(), fetchAdmins()]);
    } catch (err) {
      setError('Failed to fetch data. Please try again later.');
      console.error('Error fetching data:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users-admin/', {
        params: { type: 'user' }
      });
      console.log('Users API Response:', response);
      
      if (!response.data) {
        console.error('No data received from server');
        setUsers([]);
        return;
      }
      
      console.log('Response data:', response.data);
      if (Array.isArray(response.data)) {
        setUsers(response.data);
      } else if (response.data.data && Array.isArray(response.data.data)) {
        setUsers(response.data.data);
      } else {
        console.error('Invalid user data format:', response.data);
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error.response || error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
      }
      setUsers([]);
      throw error;
    }
  };

  const fetchAdmins = async () => {
    try {
      const response = await axios.get('/api/users-admin/', {
        params: { type: 'admin' }
      });
      console.log('Admins API Response:', response);
      
      if (!response.data) {
        console.error('No data received from server');
        setAdmins([]);
        return;
      }
      
      console.log('Response data:', response.data);
      if (Array.isArray(response.data)) {
        setAdmins(response.data);
      } else if (response.data.data && Array.isArray(response.data.data)) {
        setAdmins(response.data.data);
      } else {
        console.error('Invalid admin data format:', response.data);
        setAdmins([]);
      }
    } catch (error) {
      console.error('Error fetching admins:', error.response || error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
      }
      setAdmins([]);
      throw error;
    }
  };

  const handleDeleteUser = async (userId, userType) => {
    if (window.confirm(`Are you sure you want to delete this ${userType}?`)) {
      try {
        await axios.delete('/api/users-admin/', {
          data: { id: userId, type: userType }
        });
        await fetchData();
      } catch (error) {
        console.error(`Error deleting ${userType}:`, error.response || error);
        alert(`Failed to delete ${userType}. Please try again.`);
      }
    }
  };

  useEffect(() => {
    setStats({
      totalUsers: users.length,
      totalAdmins: admins.length
    });
  }, [users, admins]);

  const getCurrentData = () => {
    return selectedView === 'user' ? users : admins;
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AdminSidebar />
      <Box sx={{ flexGrow: 1 }}>
        <Container maxWidth="lg">
          <Box sx={{ py: 4 }}>
            <Typography variant="h4" sx={{ mb: 4 }}>
              Admin Dashboard
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6}>
                <Card sx={{ bgcolor: 'primary.light' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
                <Card sx={{ bgcolor: 'secondary.light' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <AdminPanelSettingsIcon sx={{ fontSize: 40 }} />
                      <Box>
                        <Typography variant="h6">Total Admins</Typography>
                        <Typography variant="h3">{stats.totalAdmins}</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* View Selection Buttons */}
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
              <ButtonGroup variant="contained" size="large">
                <Button 
                  onClick={() => setSelectedView('user')}
                  variant={selectedView === 'user' ? 'contained' : 'outlined'}
                  startIcon={<PersonIcon />}
                >
                  Users
                </Button>
                <Button 
                  onClick={() => setSelectedView('admin')}
                  variant={selectedView === 'admin' ? 'contained' : 'outlined'}
                  startIcon={<AdminPanelSettingsIcon />}
                >
                  Admins
                </Button>
              </ButtonGroup>
            </Box>

            <Paper sx={{ width: '100%', mb: 2 }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Phone</TableCell>
                      <TableCell>Created At</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {getCurrentData().length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          No data available
                        </TableCell>
                      </TableRow>
                    ) : (
                      getCurrentData().map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>{user.name || 'N/A'}</TableCell>
                          <TableCell>{user.email || 'N/A'}</TableCell>
                          <TableCell>{user.phone || 'N/A'}</TableCell>
                          <TableCell>
                            {user.created_at 
                              ? new Date(user.created_at).toLocaleString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })
                              : 'N/A'
                            }
                          </TableCell>
                          <TableCell>
                            <IconButton 
                              size="small" 
                              color="primary"
                              onClick={() => console.log('Edit user:', user.id)}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteUser(user.id, selectedView)}
                            >
                              <DeleteIcon />
                            </IconButton>
                            {selectedView === 'user' && (
                              <IconButton
                                size="small"
                                color="success"
                                component={Link}
                                to={`/admin/user-progress/${user.id}`}
                                title="View Progress"
                              >
                                <AssessmentIcon />
                              </IconButton>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
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
