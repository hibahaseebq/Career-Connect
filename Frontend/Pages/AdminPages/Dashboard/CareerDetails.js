import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Container, Grid,Autocomplete, FormControl, InputLabel, Select, MenuItem, Box, Divider, Typography, TextField, Button, Snackbar, Alert, List, ListItem, ListItemText, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import api from '../../../Api/Api';
import './Dashboard.css';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const CareerDetails = ({ token }) => {
  const { career_id } = useParams();
  const [career, setCareer] = useState(null);
  console.log(career, "careercareercareer")
  const [resources, setResources] = useState([]);
  const [form, setForm] = useState({ resource_name: '', resource_link: '', description: '' });
  const [editId, setEditId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState({});
// adjustment of recommendation
  const [assessments, setAssessments] = useState([]);
  const [selectedAssessments, setSelectedAssessments] = useState([]);
  console.log(selectedAssessments, "selectedAssessments")
  const [adjustRecommendationOpen, setAdjustRecommendationOpen] = useState(false);

  useEffect(() => {
    fetchCareerDetails();
    fetchResources();
    fetchAssessments();
  }, [career_id]);

  const fetchCareerDetails = async () => {
    try {
      const response = await api.get(`/admin/career-recommendations/${career_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCareer(response.data.career);
  console.log(response.data.assessments, "selectedAssessments")

      setSelectedAssessments(response.data.assessments);
    } catch (error) {
      console.error('Error fetching career details:', error);
    }
  };

  const fetchResources = async () => {
    try {
      const response = await api.get(`/admin/career-recommendations/${career_id}/resources`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResources(response.data);
    } catch (error) {
      console.error('Error fetching resources:', error);
    }
  };

  const fetchAssessments = async () => {
    try {
      const response = await api.get('/admin/assessments', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAssessments(response.data);
    } catch (error) {
      console.error('Error fetching assessments:', error);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.resource_name) newErrors.resource_name = 'Resource name is required';
    if (!form.resource_link) {
      newErrors.resource_link = 'Resource link is required';
    } else if (!/^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/.test(form.resource_link)) {
      newErrors.resource_link = 'Resource link is invalid';
    }
    if (!form.description) newErrors.description = 'Description is required';
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setSnackbar({ open: true, message: Object.values(newErrors).join(', '), severity: 'error' });
    }

    return Object.keys(newErrors).length === 0;
  };

  // resource submit 
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      if (editId) {
        await api.put(`/admin/career-recommendations/${career_id}/resources/${editId}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await api.post(`/admin/career-recommendations/${career_id}/resources`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setForm({ resource_name: '', resource_link: '', description: '' });
      setEditId(null);
      setOpen(false);
      fetchResources();
      setSnackbar({ open: true, message: 'Resource saved successfully', severity: 'success' });
    } catch (error) {
      console.error('Error saving resource:', error);
      setSnackbar({ open: true, message: 'Failed to save resource', severity: 'error' });
    }
  };

  const handleEdit = (resource) => {
    setForm(resource);
    setEditId(resource.resource_id);
    setOpen(true);
  };
  // resource resouces detelte 

  const handleDelete = async (resource_id) => {
    try {
      await api.delete(`/admin/career-recommendations/${career_id}/resources/${resource_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchResources();
      setSnackbar({ open: true, message: 'Resource deleted successfully', severity: 'success' });
    } catch (error) {
      console.error('Error deleting resource:', error);
      setSnackbar({ open: true, message: 'Failed to delete resource', severity: 'error' });
    }
  };
  const handleCopyLink = (link) => {
    navigator.clipboard.writeText(link);
    setSnackbar({ open: true, message: 'Resource link copied to clipboard', severity: 'success' });
  };
  

// logic for recomendation adustment 

const handleAdjustRecommendationSubmit = async (e) => {
  e.preventDefault();
  try {
    await api.put(`/admin/career-recommendations/${career_id}`, {
      ...career,
      min_score: career.min_score,
      max_score: career.max_score,
      assessments: selectedAssessments
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setAdjustRecommendationOpen(false);
    setSnackbar({ open: true, message: 'Recommendation adjusted successfully', severity: 'success' });
    fetchCareerDetails();
  } catch (error) {
    console.error('Error adjusting recommendation:', error);
    setSnackbar({ open: true, message: 'Failed to adjust recommendation', severity: 'error' });
  }
};










  if (!career) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  return (
    <Container className='admin-page-main-container'>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          {career.career_name}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          {career.description}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          {career.required_skills}
        </Typography>
        <Divider style={{margin:"6px 0px"}}/>
        <Typography variant="subtitle1" gutterBottom>
          Min Score: {career.min_score}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Max Score: {career.max_score}
        </Typography>
         <Divider style={{margin:"6px 0px"}}/>

        <Typography style={{marginBottom:"0px"}} variant="subtitle1" gutterBottom>
          Related Assessments:
        </Typography>
        <List style={{padding:"0px"}}>
          {selectedAssessments?.map((assessment) => (
            <ListItem key={assessment.assessment_id}>
              <ListItemText primary={assessment.assessment_type} secondary={assessment.description} />
            </ListItem>
          ))}
        </List>
        <Divider style={{margin:"6px 0px"}}/>


        <Button
        style={{marginTop:"16px"}}
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
        >
          Add Resource
        </Button>

        <Button
          style={{ marginTop: "16px", marginLeft:"16px" }}
          variant="contained"
          color="primary"
          onClick={() => setAdjustRecommendationOpen(true)}
        >
          Adjust Recommendation
        </Button>


        <List style={{ boxShadow: "0px 1px 2px 1px rgba(0, 0, 0, 0.08)", marginTop: "26px", borderTop: "1px solid #8080804a", padding: "0px", borderRadius: "5px" }}>
          {resources.map((resource, index) => (
            <ListItem style={{ borderBottom: "1px solid #8080804a" }} key={index}>
              <ListItemText
                className='question-text'
                primary={resource.resource_name}
                secondary={
                  <>
                    <Typography variant="body2">{resource.description}</Typography>
                    <Link style={{fontWeight:"600"}} href={resource.resource_link}  rel="noopener">{resource.resource_link}</Link>
                    <span><IconButton style={{marginLeft:"20px"}} onClick={() => handleCopyLink(resource.resource_link)}>
                <ContentCopyIcon style={{fontSize:"16px"}}/>
              </IconButton></span>
                  </>
                }
              />
               
              <IconButton onClick={() => handleEdit(resource)}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => handleDelete(resource.resource_id)}>
                <DeleteIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>
      </Box>
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{editId ? 'Edit Resource' : 'Add Resource'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Resource Name"
            type="text"
            fullWidth
            variant="standard"
            value={form.resource_name}
            onChange={(e) => setForm({ ...form, resource_name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Resource Link"
            type="text"
            fullWidth
            variant="standard"
            value={form.resource_link}
            onChange={(e) => setForm({ ...form, resource_link: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            variant="standard"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>{editId ? 'Update' : 'Add'}</Button>
        </DialogActions>
      </Dialog>


      {/* recommmendation adjustment */}

      <Dialog open={adjustRecommendationOpen} onClose={() => setAdjustRecommendationOpen(false)}>
        <DialogTitle>Adjust Recommendation</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Min Score"
            type="number"
            fullWidth
            variant="standard"
            value={career.min_score}
            onChange={(e) => setCareer({ ...career, min_score: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Max Score"
            type="number"
            fullWidth
            variant="standard"
            value={career.max_score}
            onChange={(e) => setCareer({ ...career, max_score: e.target.value })}
          />
          <Autocomplete
          style={{marginTop:"16px"}}
            multiple
            id="tags-outlined"
            options={assessments}
            getOptionLabel={(option) => option.assessment_type}
            value={assessments.filter(assessment => selectedAssessments.includes(assessment.assessment_id))}
            onChange={(event, newValue) => setSelectedAssessments(newValue.map(assessment => assessment.assessment_id))}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                label="Related Assessments"
                placeholder="Select assessments"
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAdjustRecommendationOpen(false)}>Cancel</Button>
          <Button onClick={handleAdjustRecommendationSubmit}>Save</Button>
        </DialogActions>
      </Dialog>

    </Container>
  );
};

export default CareerDetails;
