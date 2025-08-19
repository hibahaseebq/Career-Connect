import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  List,
} from '@mui/material';
import QuestionsList from '../../QuestionsList';
import PostAQuestion from '../../PostAQuestion';
import api from '../../../Api/Api';

const ForumManagement = ({ mode }) => {
  const [activeButton, setActiveButton] = useState('questions-list');
  const [postsList, setPostsList] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [currentUser, setUser] = useState(null); 
  const [token, setToken] = useState(sessionStorage.getItem('token'));


  
  useEffect(() => {
    const storedToken = sessionStorage.getItem('token');
    setToken(storedToken);

    // Fetch the current user details if token is available
    const fetchUserDetails = async () => {
      try {
      
        const response = await api.get('/profile/getSecureUser', {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        console.log("🚀 ~ fetchUserDetails ~ response:", response)
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    if (storedToken) {
      fetchUserDetails();
    }
  }, []);

  const handleGetQuestionLists = async () => {
    try {
      const response = await api.get('/forum/list-all-forum');
      setPostsList(response.data);
    } catch (error) {
      console.error('Error fetching the questions:', error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to fetch the questions';
      setSnackbarSeverity('error');
      setSnackbarMessage(errorMessage);
      setSnackbarOpen(true);
    }
  };

  useEffect(() => {
    handleGetQuestionLists();
  }, []);

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleButtonClick = (button) => {
    setActiveButton(button);
  };

  const addNewPost = (newPost) => {
    setPostsList((prevPostsList) => [newPost, ...prevPostsList]);
  };

  return (
    <Container style={{marginTop:"32px"}} className='admin-page-main-container'>
      <div style={{ width: '100%', margin: '0 auto' }}>
        
        <Box
          display="flex"
        bgcolor={'#121621'}
          borderRadius={'6px'}
          padding={'20px'}
          gap={1.5}
          justifyContent="left"
        >
          <Button
            variant={mode === 'light' ? 'outlined' : 'contained'}
            size="small"
            onClick={() => handleButtonClick('questions-list')}
            sx={{
              bgcolor:
                activeButton === 'questions-list'
                  ? mode === 'light'
                    ? 'primary.light'
                    : 'primary.dark'
                  : mode === 'light'
                  ? 'third.light'
                  : 'gray',
              color:
                activeButton === 'questions-list'
                  ? mode === 'light'
                    ? 'white'
                    : 'light'
                  : mode === 'light'
                  ? 'primary.main'
                  : 'light',
              '&:hover': {
                bgcolor: mode === 'light' ? 'primary.light' : 'primary.dark',
              },
            }}
          >
            Questions
          </Button>
          <Button
            variant={mode === 'light' ? 'outlined' : 'contained'}
            size="small"
            onClick={() => handleButtonClick('post-a-question')}
            sx={{
              bgcolor:
                activeButton === 'post-a-question'
                  ? mode === 'light'
                    ? 'primary.light'
                    : 'primary.dark'
                  : mode === 'light'
                  ? 'third.light'
                  : 'gray',
              color:
                activeButton === 'post-a-question'
                  ? mode === 'light'
                    ? 'white'
                    : 'light'
                  : mode === 'light'
                  ? 'primary.main'
                  : 'light',
              '&:hover': {
                bgcolor: mode === 'light' ? 'primary.light' : 'primary.dark',
              },
            }}
          >
            Ask a Question
          </Button>
          
        </Box>

        <List
            sx={{
                width: {
                xs: '90%',
                sm: '90%',
                md: '100%'
                },
                margin: '0 auto',
            }}>
          {activeButton === 'post-a-question' ? (
            <PostAQuestion
              mode={mode}
              posts={postsList}
              currentUser={currentUser}
              addNewPost={addNewPost}
            />
          ) : (
            <QuestionsList fromAdmin={true} posts={postsList} currentUser={currentUser} />
          )}
        </List>
      </div>
    </Container>
  );
};

export default ForumManagement