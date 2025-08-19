import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  ListItemAvatar,
  Avatar,
  Grid,
  Snackbar,
  Alert,
  Typography,
  Tooltip,
  IconButton,
} from '@mui/material';
import { Link } from 'react-router-dom';
import api from '../Api/Api';
import './styles/Forum.css';
import Delete from '@mui/icons-material/Delete';
import {jwtDecode} from 'jwt-decode';
const QuestionsList = ({ posts, currentUser, fromAdmin}) => {
  console.log("🚀 ~ QuestionsList ~ currentUser:", currentUser)
  const [replyFields, setReplyFields] = useState({});
  const [replyContents, setReplyContents] = useState({});
  const [token, setToken] = useState(sessionStorage.getItem('token'));
  const [postsList, setPostsList] = useState(posts);
  console.log("🚀 ~ QuestionsList ~ postsList:", postsList)
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [userRole, setUserRole] = useState(null);


  const roleColors = {
    admin: '#4A90E2',       // Soft blue
    counsellor: 'rgb(208 45 157)',  // Soft teal
    user: '#50E3C2'         // Soft green
  };
  
  const getColorByRole = (role) => {
    switch (role) {
      case 'admin':
        return roleColors.admin;
      case 'counsellor':
        return roleColors.counsellor;
      default:
        return roleColors.user;
    }
  };


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

  const toggleReplyField = (id, type) => {
    setReplyFields((prev) => {
      const newReplyFields = {};
      Object.keys(prev).forEach((key) => {
        if (key !== `${type}${id}`) {
          newReplyFields[key] = false;
        }
      });
      return {
        ...newReplyFields,
        [`${type}${id}`]: !prev[`${type}${id}`],
      };
    });
  };

  const handleReplyContentChange = (id, value) => {
    setReplyContents((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmitReply = async (id, type, e) => {
    e.preventDefault();
    const replyContent = replyContents[id];

    if (!replyContent || replyContent.length < 2 || replyContent.length > 1000) {
      setSnackbarSeverity('error');
      setSnackbarMessage('Reply must be between 2 and 1000 characters.');
      setSnackbarOpen(true);
      return;
    }

    try {
      const response = await api.post(
        `/forum/reply-forum/${id}`,
        {
          content: replyContent,
          parentType: type,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newReply = {
        reply_id: response.data.reply.reply_id,
        content: response.data.reply.content,
        timestamp: response.data.reply.timestamp,
        user: {
          name: currentUser.fullName,
          avatarURL: currentUser.avatarURL,
        },
      };

      // const updatedPostsList = postsList.map((post) =>
      //   post.post_id === postId
      //     ? { ...post, replies: [...post.replies, newReply] }
      //     : post
      // );

      const updatedPostsList = postsList.map((post) => {
        if (type === 'post' && post.post_id === id) {
          return { ...post, replies: [...post.replies, newReply] };
        }
        if (type === 'reply') {
          return {
            ...post,
            replies: post.replies.map((reply) => {
              if (reply.reply_id === id) {
                return { ...reply, replies: [...(reply.replies || []), newReply] };
              }
              return reply;
            }),
          };
        }
        return post;
      });

      setPostsList(updatedPostsList);
      

      // const updatedPostsList = postsList.map((post) =>
      //   post.post_id === postId
      //     ? { ...post, replies: [...post.replies, response.data.reply] }
      //     : post
      // );

      // setPostsList(updatedPostsList);
      // setReplyContents((prev) => ({
      //   ...prev,
      //   [postId]: '',
      // }));
      setReplyContents((prev) => ({
        ...prev,
        [id]: '',
      }));
      setSnackbarSeverity('success');
      setSnackbarMessage(response.data.message);
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error replying to the question:', error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to reply to the question';
      setSnackbarSeverity('error');
      setSnackbarMessage(errorMessage);
      setSnackbarOpen(true);
    }
  };


// delete post or reply
const handleDelete = async (id, type) => {
  try {
    const url = type === 'post' ? `/admin/posts/${id}` : `/admin/replies/${id}`;
    const response = await api.delete(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log("🚀 ~ handleDelete ~ response:", response)

    if (type === 'post') {
      setPostsList(postsList.filter(post => post.post_id !== id));
    } else {
      setPostsList(postsList.map(post => ({
        ...post,
        replies: post.replies.filter(reply => reply.reply_id !== id)
      })));
    }

    setSnackbarSeverity('success');
    setSnackbarMessage('Deleted successfully');
    setSnackbarOpen(true);
  } catch (error) {
    console.error('Error deleting:', error);
    setSnackbarSeverity('error');
    setSnackbarMessage('Failed to delete');
    setSnackbarOpen(true);
  }
};



  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };



  function timeAgo(date) {
    const now = new Date();
    const secondsPast = (now.getTime() - new Date(date).getTime()) / 1000;
  
    if (secondsPast < 60) {
      return `${Math.round(secondsPast)} seconds ago`;
    } else if (secondsPast < 3600) {
      return `${Math.round(secondsPast / 60)} minutes ago`;
    } else if (secondsPast < 86400) {
      return `${Math.round(secondsPast / 3600)} hours ago`;
    } else if (secondsPast < 2592000) {
      return `${Math.round(secondsPast / 86400)} days ago`;
    } else if (secondsPast < 31536000) {
      return `${Math.round(secondsPast / 2592000)} months ago`;
    } else {
      return `${Math.round(secondsPast / 31536000)} years ago`;
    }
  }


  const getDisplayName = (user) => {
    if (!user) return '';
  
    const firstName = user.first_name || '';
    const lastName = user.last_name || '';
    const fullName = `${firstName} ${lastName}`.trim();
  
    return fullName || user.name || '';
  };
  
  return (
    <List >
      {postsList.map((post) => (
        <React.Fragment key={post.post_id}>
          <Divider style={{ marginTop: '25px' }} />
          <ListItem
            className="list-question-item"
            style={{ display: 'flex', flexDirection: 'column', gap: '0px', paddingLeft: "0px",
            paddingRight: "0px",}}
            alignItems="flex-start"
          >
            <Grid container width={'100%'} justifyContent={'space-between'} alignItems={'center'}>
              <Link style={{ textDecoration: 'none' }} to={`/profile/${post?.user?.userId}`}>
                <ListItemAvatar style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px', position:"relative" }}>
                  <Avatar alt={post?.user?.name} src={post?.user?.avatarURL} />

                  <span className="user-name-question">
                  {` - ${getDisplayName(post?.user)}`}
                    </span>

                    <Typography 
  style={{
    backgroundColor: getColorByRole(post?.user?.role),
    padding: "0px 7px", 
    borderRadius: "12px", 
    color: "white"
  }} 
  variant="caption" 
  size="caption"
>
  {post?.user?.role}
</Typography>

                </ListItemAvatar>
              </Link>
              <div style={{display:"flex", alignItems:"center", justifyContent:"center", gap:"10px"}}>
              <Typography variant="caption" size="caption">
              {timeAgo(post?.timestamp)}
              </Typography>
              
              {/* Delete Button */}
              {userRole === 'admin' && (
              <IconButton onClick={() => handleDelete(post.post_id, 'post')}>
                <Delete />
              </IconButton>)}

              </div>
            </Grid>
            <ListItemText
            className={"hide-last-hr-of-reply"}
              style={{ width: '100%', cursor: 'pointer' }}
              primary={
                <Tooltip title={`Click to reply to ${post?.user?.name}`} followCursor>
                  <h2
                    onClick={() => toggleReplyField(post.post_id, 'post')}
                    style={{ cursor: 'pointer' }}
                    className="question-title"
                    sx={{ display: 'inline' }}
                    component="span"
                    variant="h3"
                    color="text.primary"
                  >
                    {post.title}
                  </h2>
                </Tooltip>
              }
              secondary={
                <>
                  <Tooltip title={`Click to reply to ${post?.user?.name}`} followCursor>
                    <Typography
                      onClick={() => toggleReplyField(post.post_id, 'post')}
                      sx={{ display: 'inline', cursor: 'pointer' }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {post.content}
                    </Typography>
                  </Tooltip>

                  <React.Fragment >

                  {post.replies.length>0 &&
                <Divider style={{ marginTop: '20px' }} variant="fullWidth" />
                  }
                    
                    {post.replies &&
                      post.replies.map((reply) => (
                        <React.Fragment key={reply.reply_id}>
                          <Box
                            style={{ display: 'flex', flexDirection: 'column' }}
                            alignItems="flex-start"
                            sx={{ mt: 1, ml: 3 }}
                          >
                            <Grid
                              container
                              width={'100%'}
                              justifyContent={'space-between'}
                              alignItems={'center'}
                            >
                              <Link style={{ textDecoration: 'none' }} to={`/profile/${reply?.user?.userId}`}>
                                <ListItemAvatar
                                  style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px' }}
                                >
                                  <Avatar alt={reply?.user?.name} src={reply?.user?.avatarURL} />
                                  <span className="user-name-question"> 
                                  {` - ${getDisplayName(reply?.user)}`}
                                  </span>

                                  <Typography 
  style={{
    backgroundColor: getColorByRole(reply?.user?.role),
    padding: "0px 7px", 
    borderRadius: "12px", 
    color: "white"
  }} 
  variant="caption" 
  size="caption"
>
  {reply?.user?.role}
</Typography>


                                </ListItemAvatar>
                              </Link>

                              <div style={{display:"flex", alignItems:"center", justifyContent:"center", gap:"10px"}}>

                              <Typography variant="caption" size="caption">
                              {timeAgo(reply?.timestamp)}
                              </Typography>

                              {/* Delete Button */}
                              {userRole === 'admin' && (
                            <IconButton onClick={() => handleDelete(reply.reply_id, 'reply')}>
                              <Delete />
                            </IconButton>)}

                            </div>
                            </Grid>
                            <Tooltip title={`Click to reply to ${reply?.user?.name}`} followCursor>
                              <Typography
                                onClick={() => toggleReplyField(reply.reply_id, 'reply')}
                                className="reply-content"
                                sx={{ display: 'inline' }}
                                component="span"
                                variant="body2"
                                color="text.primary"
                                style={{ cursor: 'pointer' }}
                              >
                                {reply.content}
                              </Typography>
                            </Tooltip>
                                {/* reply to any other reply */}
                            {/* {replyFields[`reply${reply.reply_id}`] && (
                              <Box
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  marginTop: '10px',
                                  transition: 'all 0.3s ease-in-out',
                                  width: '100%',
                                }}
                              >
                                <TextField
                                  style={{ transition: 'all 0.3s ease-in-out' }}
                                  variant="outlined"
                                  fullWidth
                                  size="small"
                                  placeholder="Write a reply..."
                                  value={replyContents[`${reply.reply_id}`] || ''}
                                  onChange={(e) => handleReplyContentChange(`${reply.reply_id}`, e.target.value)}
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                      handleSubmitReply(reply.reply_id, 'reply', e);
                                    }
                                  }}
                                />
                                <Button
                                  style={{ marginLeft: '10px',  transition: 'all 0.3s ease-in-out' }}
                                  variant="contained"
                                  color="primary"
                                  onClick={(e) => handleSubmitReply(reply.reply_id, 'reply', e)}
                                >
                                  Submit
                                </Button>
                              </Box>
                            )} */}
                          </Box>
                          <Divider style={{ marginLeft: '20px', opacity: '0.5' }} />
                        </React.Fragment>
                      ))}

                    {replyFields[`post${post.post_id}`] && (
                      <Box
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          marginTop: '10px',
                          transition: 'all 0.3s ease-in-out',
                          width: '100%',
                        }}
                      >
                        <TextField
                          style={{ transition: 'all 0.3s ease-in-out' }}
                          variant="outlined"
                          fullWidth
                          size="small"
                          placeholder="Write a reply..."
                          value={replyContents[`${post.post_id}`] || ''}
                          onChange={(e) => handleReplyContentChange(`${post.post_id}`, e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleSubmitReply(post.post_id, 'post', e);
                            }
                          }}
                        />
                        <Button
                          style={{ marginLeft: '10px',  transition: 'all 0.3s ease-in-out' }}
                          variant="contained"
                          color="primary"
                          onClick={(e) => handleSubmitReply(post.post_id, 'post', e)}
                        >
                          Submit
                        </Button>
                      </Box>
                    )}
                  </React.Fragment>
                </>
              }
            />
          </ListItem>
        </React.Fragment>
      ))}

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </List>
  );
};

export default QuestionsList;
