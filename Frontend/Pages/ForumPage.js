import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  List,
  Snackbar,
  Alert,
} from '@mui/material';
import QuestionsList from './QuestionsList';
import PostAQuestion from './PostAQuestion';
import api from '../Api/Api';

const ForumPage = ({ mode }) => {
  const [activeButton, setActiveButton] = useState('questions-list');
  const [postsList, setPostsList] = useState([]);
  console.log("🚀 ~ ForumPage ~ postsList:", postsList);
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
    <Container
      id="people-container"
      maxWidth="md"
      style={{ padding: '10px 0px 60px 0px' }}
    >
      <div sx={{ width: '75%', margin: '0 auto' }}>
        <Typography
          variant="h1"
          sx={{
            flexDirection: { xs: 'column', md: 'row' },
            alignSelf: 'center',
            textAlign: 'center',
            fontSize: 'clamp(1.5rem, 10vw, 2.5rem)',
            marginTop: '120px',
            mb: '30px',
            color: `${mode === 'light' ? '' : 'white'}`,
          }}
        >
          Discussion&nbsp;
          <Typography
            component="span"
            variant="h1"
            sx={{
              fontSize: 'clamp(1.5rem, 10vw, 2.5rem)',
              color: (theme) =>
                theme.palette.mode === 'light' ? 'primary.main' : 'primary.light',
            }}
          >
            Forum!
          </Typography>
        </Typography>

        <Box
          display="flex"
          className={`${
            mode === 'light'
              ? 'light-m-bg-second-color light-m-border-prime-color'
              : 'dark-m-bg-second-color dark-m-border-prime-color'
          }`}
          borderRadius={'6px'}
          padding={'20px'}
          gap={1.5}
          justifyContent="left"
          mb={2}
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
  }}
>
          {activeButton === 'post-a-question' ? (
            <PostAQuestion
              mode={mode}
              posts={postsList}
              currentUser={currentUser}
              addNewPost={addNewPost}
            />
          ) : (
            <QuestionsList posts={postsList} currentUser={currentUser} />
          )}
        </List>
      </div>
    </Container>
  );
};

export default ForumPage;