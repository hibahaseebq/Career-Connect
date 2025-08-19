import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, useMediaQuery, useTheme, Snackbar, Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import api from '../../../Api/Api'; 
import { useNavigate } from 'react-router-dom';

const AssessmentList = () => {
  const [assessments, setAssessments] = useState([]);
  const [filteredAssessments, setFilteredAssessments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editAssessment, setEditAssessment] = useState(null);
  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const [token, setToken] = useState(sessionStorage.getItem('token')); 

  useEffect(() => {
      const storedToken = sessionStorage.getItem('token');
      setToken(storedToken); 
    }, []);


  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      const response = await api.get('/admin/assessments', {headers: {
        Authorization: `Bearer ${token}` 
      }});

      const assessments = response?.data || []; 
      setAssessments(assessments);
      setFilteredAssessments(assessments);
    } catch (error) {
      console.error('Error fetching assessments:', error);
      setSnackbarSeverity('error');
      setSnackbarMessage('Failed to fetch assessments, please check you Network connection');
      setSnackbarOpen(true);
    }
  };

  const handleEdit = (assessment) => {
    setEditAssessment(assessment);
    setOpen(true);
  };

  const handleDelete = async (assessment_id) => {
    try {
      await api.delete(`/admin/assessments/${assessment_id}`, {headers: {
        Authorization: `Bearer ${token}` 
      }});
      setAssessments(assessments.filter(a => a.assessment_id !== assessment_id));
      setFilteredAssessments(filteredAssessments.filter(a => a.assessment_id !== assessment_id));
      setSnackbarSeverity('success');
      setSnackbarMessage('Assessment deleted successfully');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error deleting assessment:', error);
      setSnackbarSeverity('error');
      setSnackbarMessage('Failed to delete assessment');
      setSnackbarOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEditAssessment(null);
  };

  const handleSave = async () => {
    if (editAssessment.assessment_id) {
      // Update assessment
      try {
        const response = await api.post(`/admin/assessments/${editAssessment.assessment_id}`, editAssessment, {headers: {
          Authorization: `Bearer ${token}` 
        }});
        console.log("🚀 ~ handleSave ~ response:", response)

        fetchAssessments();
        setSnackbarSeverity('success');
        setSnackbarMessage('Assessment updated successfully');
        setSnackbarOpen(true);
      } catch (error) {
        console.error('Error updating assessment:', error);
        setSnackbarSeverity('error');
        setSnackbarMessage('Failed to update assessment');
        setSnackbarOpen(true);
      }
    } else {
      // Create new assessment
      try {
        await api.post('/admin/assessments', editAssessment, {headers: {
          Authorization: `Bearer ${token}` 
        }});
        fetchAssessments();
        setSnackbarSeverity('success');
        setSnackbarMessage('Assessment created successfully');
        setSnackbarOpen(true);
      } catch (error) {
        console.error('Error creating assessment:', error);
        setSnackbarSeverity('error');
        setSnackbarMessage('Failed to create assessment');
        setSnackbarOpen(true);
      }
    }
    handleClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditAssessment({ ...editAssessment, [name]: value });
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    setFilteredAssessments(assessments.filter(assessment => 
      assessment.assessment_type.toLowerCase().includes(value) || 
      assessment.description.toLowerCase().includes(value)
    ));
  };


  const handleViewDetails = (assessmentId) => {
    navigate(`${assessmentId}`);
  };

  return (
    <Container className='admin-page-main-container'>
      <Box sx={{ my: 4 }}>
        {/* <Typography variant="h5" gutterBottom>
          Assessment Management
        </Typography> */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <TextField
            size="small"
            label="Search assessments"
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
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => {
              setEditAssessment({ assessment_type: '', description: '' });
              setOpen(true);
            }}
            sx={{ ml: 2 }}
          >
            Add Assessment
          </Button>
        </Box>
        <TableContainer style={{boxShadow:"rgba(0, 0, 0, 0.04) 0px 5px 22px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px"}} component={Paper}>
          <Table>
            <TableHead style={{backgroundColor:"#121621"}}>
              <TableRow >
                <TableCell style={{color:"white", fontWeight:"bold"}} >Assessment Type</TableCell>
                <TableCell style={{color:"white", fontWeight:"bold"}}>Description</TableCell>
                <TableCell style={{color:"white", fontWeight:"bold"}}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(filteredAssessments)  && filteredAssessments.map((assessment) => (
                <TableRow key={assessment.assessment_id} 
                sx={{
                  '&:hover': {
                    backgroundColor: '#d3d3d34f',
                  },
                }}>
                  <TableCell onClick={() => handleViewDetails(assessment.assessment_id)} style={{ cursor: 'pointer' }}>{assessment.assessment_type}</TableCell>
                  <TableCell onClick={() => handleViewDetails(assessment.assessment_id)} style={{ cursor: 'pointer' }}>{assessment.description}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(assessment)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(assessment.assessment_id)}>
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
        <DialogTitle>{editAssessment && editAssessment.assessment_id ? 'Edit the details of the assessment below.' : 'Enter the details of the new assessment below.'}</DialogTitle>
        <DialogContent>
          
          <TextField
            autoFocus
            margin="dense"
            name="assessment_type"
            label="Assessment Type"
            type="text"
            fullWidth
            value={editAssessment ? editAssessment.assessment_type : ''}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            value={editAssessment ? editAssessment.description : ''}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      {/* <Outlet /> */}
    </Container>
  );
};

export default AssessmentList;
