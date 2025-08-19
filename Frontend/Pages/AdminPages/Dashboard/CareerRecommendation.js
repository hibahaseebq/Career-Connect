import React, { useState, useEffect } from 'react';
import { Container, Box, Button, TextField, List, ListItem, ListItemText, IconButton, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions, TableRow, TableCell, TableHead, Table, TableContainer, TableBody, Paper } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import api from '../../../Api/Api';
import { useNavigate } from 'react-router-dom';

const CareerRecommendation = ({token}) => {
  const [careers, setCareers] = useState([]);
  const [form, setForm] = useState({ career_name: '', description: '', required_skills: '' });
  const [editId, setEditId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    fetchCareers();
  }, []);

  const fetchCareers = async () => {
    try {
      const response = await api.get('/admin/career-recommendations', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCareers(response.data);
    } catch (error) {
      console.error('Error fetching careers:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/admin/career-recommendations/${editId}`, form, {
            headers: { Authorization: `Bearer ${token}` },
          });
      } else {
        await api.post('/admin/career-recommendations', form, {
            headers: { Authorization: `Bearer ${token}` },
          } );
      }
      setForm({ career_name: '', description: '', required_skills: '' });
      setEditId(null);
      setOpen(false);
      fetchCareers();
      setSnackbar({ open: true, message: 'Career saved successfully', severity: 'success' });
    } catch (error) {
      console.error('Error saving career:', error);
      setSnackbar({ open: true, message: 'Failed to save career', severity: 'error' });
    }
  };

  const handleEdit = (career) => {
    setForm(career);
    setEditId(career.career_id);
    setOpen(true);
  };

  const handleDelete = async (career_id) => {
    try {
      await api.delete(`/admin/career-recommendations/${career_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCareers();
      setSnackbar({ open: true, message: 'Career deleted successfully', severity: 'success' });
    } catch (error) {
      console.error('Error deleting career:', error);
      setSnackbar({ open: true, message: 'Failed to delete career', severity: 'error' });
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredCareers = careers.filter((career) =>
    career.career_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetails = (assessmentId) => {
    navigate(`${assessmentId}`);
  };


  return (
    <Container className='admin-page-main-container'>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, my:4 }}>
        <TextField
          size="small"
          label="Search Career"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            endAdornment: (
              <IconButton>
                <SearchIcon />
              </IconButton>
            )
          }}
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
          sx={{ ml: 2 }}
        >
          Add Career
        </Button>
      </Box>


      <TableContainer style={{boxShadow:"rgba(0, 0, 0, 0.04) 0px 5px 22px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px"}} component={Paper}>
          <Table>
            <TableHead style={{backgroundColor:"#121621"}}>
              <TableRow >
                <TableCell style={{color:"white", fontWeight:"bold"}} >Career Name</TableCell>
                <TableCell style={{color:"white", fontWeight:"bold", }}>Description</TableCell>
                <TableCell style={{color:"white", fontWeight:"bold", }}>Skills Required</TableCell>
                <TableCell style={{color:"white", fontWeight:"bold", width:"10.5%"}}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(filteredCareers)  && filteredCareers.map((career) => (
                <TableRow key={career.career_id} 
                sx={{
                  '&:hover': {
                    backgroundColor: '#d3d3d34f',
                  },
                }}>
                  <TableCell onClick={() => handleViewDetails(career.career_id)} style={{ cursor: 'pointer' }}>{career.career_name}</TableCell>
                  <TableCell onClick={() => handleViewDetails(career.career_id)} style={{ cursor: 'pointer' }}>{career.description}</TableCell>
                  <TableCell onClick={() => handleViewDetails(career.career_id)} style={{ cursor: 'pointer' }}>{career.required_skills}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(career)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(career.career_id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>





      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editId ? 'Edit Career' : 'Add Career'}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingTop:"10px", paddingBottom:"10px" }}>
            <TextField 
              label="Career Name" 
              value={form.career_name} 
              onChange={(e) => setForm({ ...form, career_name: e.target.value })} 
              required 
            />
            <TextField 
              label="Description" 
              value={form.description} 
              onChange={(e) => setForm({ ...form, description: e.target.value })} 
              required 
              multiline 
            />
            <TextField 
              label="Required Skills" 
              value={form.required_skills} 
              onChange={(e) => setForm({ ...form, required_skills: e.target.value })} 
              required 
            />
          </form>
        </DialogContent>
        <DialogActions >
          <Button onClick={() => setOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            {editId ? 'Update' : 'Add'} Career
          </Button>
        </DialogActions>
        
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CareerRecommendation;
