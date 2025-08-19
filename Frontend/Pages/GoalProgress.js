import React, { useState, useEffect } from 'react';
import api from '../Api/Api';
import { TextField, Button, List, ListItem, ListItemText, Typography, Snackbar, Alert, Card } from '@mui/material';

const GoalProgress = ({ goalId }) => {
  const [progressList, setProgressList] = useState([]);
  const [status, setStatus] = useState('');
  const [description, setDescription] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    api.get(`/goal-section/goals/${goalId}/progress`)
      .then(response => setProgressList(response.data))
      .catch(error => setSnackbar({ open: true, message: 'Error fetching progress', severity: 'error' }));
  }, [goalId]);

  const handleAddProgress = () => {
    const newProgress = { goal_id: goalId, status, description };
    api.post('/goal-section/progress', newProgress)
      .then(response => {
        setProgressList([...progressList, response.data]);
        setSnackbar({ open: true, message: 'Progress added successfully', severity: 'success' });
      })
      .catch(error => setSnackbar({ open: true, message: 'Error adding progress', severity: 'error' }));
  };

  return (
    <div style={{ marginTop: '16px' }}>
      <Typography variant="h6" gutterBottom>Progress for Goal ID: {goalId}</Typography>
      <TextField
        label="Status"
        fullWidth
        select
        SelectProps={{ native: true }}
        margin="normal"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="pending">Pending</option>
        <option value="in progress">In Progress</option>
        <option value="completed">Completed</option>
      </TextField>
      <TextField
        label="Description"
        fullWidth
        multiline
        rows={2}
        margin="normal"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Button variant="contained" color="primary" onClick={handleAddProgress} style={{ marginTop: '16px' }}>Add Progress</Button>

      <Typography variant="h6" gutterBottom style={{ marginTop: '32px' }}>Progress List</Typography>
      <List>
        {progressList.map(progress => (
          <ListItem key={progress.progress_id} alignItems="flex-start">
            <Card style={{padding:"16px"}}>
            <ListItemText
            
              primary={
                <>
                <Typography style={{fontSize:"15px", fontWeight:"bold"}} component="span" variant="body2" color="textPrimary">
                 {`Status: ${progress.status}`}
              </Typography>
                
                </>
               
              }
              secondary={
                <>
                  <Typography component="span" variant="body2" color="textPrimary">
                    {progress.description}
                  </Typography>
                  <br />
                  <Typography component="span" variant="body2" color="textSecondary">
                    Created at: {new Date(progress.createdAt).toLocaleString()}
                  </Typography>
                </>
              }
            />
          </Card>

          </ListItem>
        ))}
      </List>
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default GoalProgress;
