import React, { useState, useEffect } from 'react';
import api from '../Api/Api';
import { Container, TextField, Button, List, ListItem, ListItemText, Typography, Snackbar, Alert } from '@mui/material';
import GoalProgress from './GoalProgress';

const SetGoals = ({ mode, tokens }) => {
  const [goals, setGoals] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
 const [token, setToken] = useState(sessionStorage.getItem('token') || tokens); 

  useEffect(() => {
    const storedToken = sessionStorage.getItem('token');
    setToken(storedToken); 
  }, []);


  useEffect(() => {
    api.get('/goal-section/goals', { headers: { Authorization: `Bearer ${token}` } 
})
      .then(response => setGoals(response.data))
      .catch(error => setSnackbar({ open: true, message: 'Error fetching goals', severity: 'error' }));
  }, []);

  const handleAddGoal = () => {
    const newGoal = { title, description, deadline };
    api.post('/goal-section/goals', newGoal, { headers: { Authorization: `Bearer ${token}` } 
})
      .then(response => {
        setGoals([...goals, response.data]);
        setSnackbar({ open: true, message: 'Goal added successfully', severity: 'success' });
      })
      .catch(error => {
        console.error('Error:', error);
        setSnackbar({ open: true, message: 'Error adding goal', severity: 'error' });
      });
  };

  return (
    <div className={`${mode === "light" ? "light-container" : "dark-container"}`} id="job-listing-page-container">
      <Container style={{ paddingTop: "160px" }}>
        <Typography variant="h4" gutterBottom>Set Goals</Typography>
        <TextField
          label="Title"
          fullWidth
          margin="normal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          label="Description"
          fullWidth
          multiline
          rows={4}
          margin="normal"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextField
          label="Deadline"
          type="date"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleAddGoal} style={{ marginTop: '16px' }}>Add Goal</Button>

        <Typography variant="h5" gutterBottom style={{ marginTop: '32px' }}>Goals</Typography>
        <List>
          {goals.map(goal => (
            <ListItem key={goal.goal_id} alignItems="flex-start">
              <ListItemText
                primary={goal.title}
                secondary={
                  <>
                    <Typography component="span" variant="body2" color="textPrimary">
                      {goal.description}
                    </Typography>
                    <br />
                    <Typography component="span" variant="body2" color="textSecondary">
                      Status: {goal.status} | Deadline: {goal.deadline}
                    </Typography>
                    <GoalProgress goalId={goal.goal_id} />
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      </Container>
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default SetGoals;
