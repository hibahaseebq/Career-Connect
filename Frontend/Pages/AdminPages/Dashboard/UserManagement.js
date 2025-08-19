import React, { useEffect, useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  useMediaQuery,
  useTheme,
  Select,
  MenuItem,
  Snackbar,
  Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import api from '../../../Api/Api'
import './Dashboard.css'


const UserManagement = ({token}) => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [editUser, setEditUser] = useState(null);
    const [open, setOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
   
    // Fetch data from the API

    useEffect(() => {
        fetchUsers();
      }, []);
    
      const fetchUsers = async () => {
        try {
          const response = await api.get('/admin/admin-get-users',
          {headers: {
            Authorization: `Bearer ${token}` 
          }}
          );
          const allUsers = response?.data || [];
          setUsers(allUsers);
          setFilteredUsers(allUsers);


        } catch (error) {
          console.error('Error fetching users:', error);
          setSnackbarSeverity('error');
          setSnackbarMessage('Failed to fetch users, please check you Network connection');
          setSnackbarOpen(true);
        }
      };


      const handleEdit = (user) => {
        setEditUser(user);
        setOpen(true);
      };
    
      const handleDelete = async (userId) => {
        try {
          await api.delete(`/admin/admin-delete-user/${userId}`,
          {headers: {
            Authorization: `Bearer ${token}` 
          }});
          setUsers(users.filter(user => user.userId !== userId));
          setFilteredUsers(filteredUsers.filter(user => user.userId !== userId));
          setSnackbarSeverity('success');
          setSnackbarMessage('User deleted successfully');
          setSnackbarOpen(true);
        } catch (error) {
          console.error('Error deleting user:', error);
          setSnackbarSeverity('error');
          setSnackbarMessage('Failed to delete user');
          setSnackbarOpen(true);
        }
      };
    
      const handleClose = () => {
        setOpen(false);
        setEditUser(null);
      };
    
      const handleSave = async () => {
        try {
          await api.post('/admin/admin-update-user', editUser,
          {headers: {
            Authorization: `Bearer ${token}` 
          }});
          setUsers(users.map(user => (user.userId === editUser.userId ? editUser : user)));
          setFilteredUsers(filteredUsers.map(user => (user.userId === editUser.userId ? editUser : user)));
          handleClose();
          setSnackbarSeverity('success');
          setSnackbarMessage('User updated successfully');
          setSnackbarOpen(true);
        } catch (error) {
          console.error('Error updating user:', error);
          setSnackbarSeverity('error');
          setSnackbarMessage('Failed to update user');
          setSnackbarOpen(true);
        }
      };

      

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditUser({ ...editUser, [name]: value });
  };

  const handleSearch = (e) => {
    const value = e?.target?.value?.toLowerCase();
    setSearchTerm(value);
    setFilteredUsers(users.filter(user => 
      user?.fullName?.toLowerCase().includes(value) || 
      user?.emailAddress?.toLowerCase().includes(value) ||
      user?.role_name?.toLowerCase().includes(value)
    ));
  };


  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };


  return (
    <Container className='admin-page-main-container'>
      <Box sx={{ my: 4 }}>
        {/* <Typography variant="h5" gutterBottom>
          User Management
        </Typography> */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <TextField
          size="small"
            label="Search users"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearch}
            fullWidth={isMobile ? true : false}
            InputProps={{
              endAdornment: (
                <IconButton>
                  <SearchIcon />
                </IconButton>
              )
            }}
          />
        </Box>
        <TableContainer style={{boxShadow:"rgba(0, 0, 0, 0.04) 0px 5px 22px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px"}} component={Paper}>
          <Table>
            <TableHead>
              <TableRow style={{backgroundColor:"#121621"}} >
                <TableCell style={{fontWeight:"bold", color:"white"}}>Full Name</TableCell>
                <TableCell style={{fontWeight:"bold", color:"white"}}>Email Address</TableCell>
                <TableCell style={{fontWeight:"bold", color:"white"}}>Role</TableCell>
                <TableCell style={{fontWeight:"bold", color:"white"}}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(filteredUsers) && filteredUsers.map((user) => (
                <TableRow key={user.userId}>
                  <TableCell>{user.fullName}</TableCell>
                  <TableCell>{user.emailAddress}</TableCell>
                  <TableCell>{user.role_name}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(user)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(user.userId)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Dialog open={open} onClose={handleClose} fullWidth={true} maxWidth="sm">
        <DialogTitle>Edit the details of the user below.</DialogTitle>
        <DialogContent style={{display:"flex", flexDirection:"column", gap:"20px"}}>
          
          <TextField
            autoFocus
            margin="dense"
            name="fullName"
            label="Full Name"
            type="text"
            fullWidth
            value={editUser ? editUser.fullName : ''}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="emailAddress"
            label="Email Address"
            type="email"
            fullWidth
            value={editUser ? editUser.emailAddress : ''}
            onChange={handleChange}
          />
           <Select
            margin="dense"
            name="role_name"
            label="Role"
            fullWidth
            value={editUser ? editUser.role_name : ''}
            onChange={handleChange}
          >
            <MenuItem value="student">Student</MenuItem>
            <MenuItem value="counsellor">Counsellor</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default UserManagement;
