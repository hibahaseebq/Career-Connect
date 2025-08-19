//CourseResource.js
import React, { useState, useEffect } from 'react';
import { Container, Box, Button, TextField, List, ListItem, ListItemText, IconButton, Snackbar, Alert } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import api from '../../../Api/Api';


const CourseResource = () => {
  const [resources, setResources] = useState([]);
  const [form, setForm] = useState({ career_id: '', resource_name: '', resource_link: '', description: '' });
  const [editId, setEditId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await api.get('/course-resources');
      setResources(response.data);
    } catch (error) {
      console.error('Error fetching resources:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/course-resources/${editId}`, form);
      } else {
        await api.post('/course-resources', form);
      }
      setForm({ career_id: '', resource_name: '', resource_link: '', description: '' });
      setEditId(null);
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
  };

  const handleDelete = async (resource_id) => {
    try {
      await api.delete(`/course-resources/${resource_id}`);
      fetchResources();
      setSnackbar({ open: true, message: 'Resource deleted successfully', severity: 'success' });
    } catch (error) {
      console.error('Error deleting resource:', error);
      setSnackbar({ open: true, message: 'Failed to delete resource', severity: 'error' });
    }
  };

  return (
    <Container>
      <Box>
        <form onSubmit={handleSubmit}>
          <TextField label="Career ID" value={form.career_id} onChange={(e) => setForm({ ...form, career_id: e.target.value })} required />
          <TextField label="Resource Name" value={form.resource_name} onChange={(e) => setForm({ ...form, resource_name: e.target.value })} required />
          <TextField label="Resource Link" value={form.resource_link} onChange={(e) => setForm({ ...form, resource_link: e.target.value })} required />
          <TextField label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} multiline />
          <Button type="submit">{editId ? 'Update' : 'Add'} Resource</Button>
        </form>
        <List>
          {resources.map((resource) => (
            <ListItem key={resource.resource_id}>
              <ListItemText primary={resource.resource_name} secondary={resource.resource_link} />
              <IconButton onClick={() => handleEdit(resource)}><EditIcon /></IconButton>
              <IconButton onClick={() => handleDelete(resource.resource_id)}><DeleteIcon /></IconButton>
            </ListItem>
          ))}
        </List>
      </Box>
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CourseResource;
