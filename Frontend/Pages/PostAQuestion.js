import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  Snackbar,
  Alert
} from '@mui/material';
import api from '../Api/Api'
import { jwtDecode } from 'jwt-decode';
import { Navigate, useNavigate } from 'react-router-dom';
import { paths } from './AdminPages/Paths';



              
const PostAQuestion = ({ mode, posts, currentUser, addNewPost}) => {
  const [token, setToken] = useState(sessionStorage.getItem('token')); 
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [postsList, setPostsList] = useState(posts);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [userRole, setUserRole] = useState(null);

  
  useEffect(() => {
    setPostsList(posts);
  }, [posts]);


  useEffect(() => {
    const storedToken = sessionStorage.getItem('token');
    setToken(storedToken);
    if (storedToken) {
      const decodedToken = jwtDecode(storedToken);
      setUserRole(decodedToken.role);
    }
  }, []);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
  if (!newPostTitle || newPostTitle.length < 5 || newPostTitle.length > 150) {
    setSnackbarSeverity('error');
    setSnackbarMessage('Title must be between 5 and 100 characters.');
    setSnackbarOpen(true);
    return;
  }

 

  if (!newPostContent || newPostContent.length < 10 || newPostContent.length > 1000) {
    setSnackbarSeverity('error');
    setSnackbarMessage('Content must be between 10 and 1000 characters.');
    setSnackbarOpen(true);
    return;
  }

    try {
      const response = await api.post('/forum/post-forum', {
        title: newPostTitle,
        content: newPostContent
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("🚀 ~ handlePostSubmit ~ response:", response)

      const newPost = {
        post_id: response.data.question.post_id,
        title: newPostTitle,
        content: newPostContent,
        timestamp: response.data.question.timestamp,
        user: {
          name: currentUser.fullName,
          avatarURL: currentUser.avatarURL,
        },
        replies: [],
      };

      addNewPost(newPost);

      setPostsList([...postsList, response.data.post]);
      setNewPostTitle('');
      setNewPostContent('');
      setSnackbarSeverity('success');
      setSnackbarMessage(response.data.message);

      setSnackbarOpen(true);
      setAlertOpen(false);
    } catch (error) {
      console.error('Error posting the question:', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to post question';
      setSnackbarSeverity('error');
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity('error');
      setSnackbarMessage(errorMessage);
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

   const navigate = useNavigate();
  const handleRedirection = () => {
    navigate('/user-signIn');
  };

  return (
    <Box component="form" sx={{ mb: 2 }} noValidate autoComplete="off">
      <TextField
        label="Title"
        variant="outlined"
        fullWidth
        value={newPostTitle}
        onChange={(e) => setNewPostTitle(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Content"
        variant="outlined"
        fullWidth
        multiline
        rows={4}
        value={newPostContent}
        onChange={(e) => setNewPostContent(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Grid display={"flex"} justifyContent={"flex-end"} width={"fullWidth"}>
      {token?( <Button variant="contained" color="primary" onClick={handlePostSubmit}>
          Ask The Question
        </Button>):(
          <Button variant="contained" color="primary" onClick={handleRedirection}>
          Sign In to Ask Questions
        </Button>
        )}
       
      </Grid>


      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>


    </Box>
  );
};

export default PostAQuestion;