import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Avatar, List, ListItem, ListItemAvatar, ListItemText, Paper, Container, Dialog, DialogContent, DialogTitle, DialogActions, Badge, InputBase, IconButton, AppBar, Toolbar, Button, Tabs, Tab, Snackbar, Alert, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import api from '../Api/Api';
import { Link } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add'; 
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import { CheckCircleOutline, Done, DoneAll } from '@mui/icons-material';
import zIndex from '@mui/material/styles/zIndex';
import DeleteIcon from '@mui/icons-material/Delete';
import MenuIcon from '@mui/icons-material/Menu';


const MessagingPage = ({ mode, tokens }) => {
  const [users, setUsers] = useState([]);
  const [conversations, setConversations] = useState([]);
  console.log("🚀 ~ MessagingPage ~ conversations:", conversations)
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageContent, setMessageContent] = useState('');
  const [token, setToken] = useState(sessionStorage.getItem('token') || tokens);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [alertType, setAlertType] = useState('success');
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();
  const { conversationId } = useParams();
  const [filteredConversations, setFilteredConversations] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sending, setSending] = useState(false);

  const boxRef = useRef(null);

  useEffect(() => {
    if (boxRef.current) {
      boxRef.current.scrollTop = boxRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    if (!token) {
      const storedToken = sessionStorage.getItem('token');
      setToken(storedToken);
    }
  }, []);


  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const fetchUsersAndConversations = async () => {
      try {
        const usersResponse = await api.get('/messages/users');
        setUsers(usersResponse.data.results);

        const conversationsResponse = await api.get('/messages/conversations', { headers: { Authorization: `Bearer ${token}` } });
        setConversations(conversationsResponse.data);
        console.log("🚀 ~ fetchUsersAndConversations ~ conversationsResponse:", conversationsResponse)
        setFilteredConversations(conversationsResponse.data);  

        if (conversationId) {
          const conversation = conversationsResponse.data.find(conv => conv.conversation_id === parseInt(conversationId));
          if (conversation) {
            setSelectedConversation(conversation);
            fetchMessages(conversation.conversation_id);
          } else {
            fetchSelectedConversation(conversationId);
          }
        }
      } catch (error) {
        console.error('Error fetching users or conversations:', error);
      }
    };

    fetchUsersAndConversations();
  }, [token, conversationId]);

  const fetchSelectedConversation = async (conversationId) => {
    try {
      const response = await api.get(`/messages/conversations/${conversationId}`, { headers: { Authorization: `Bearer ${token}` } });
      console.log(response, "setSelectedConversation")
      setSelectedConversation(response.data);
      fetchMessages(conversationId);
    } catch (error) {
      console.error('Error fetching selected conversation:', error);
    }
  };
  useEffect(() => {
  fetchSelectedConversation(conversationId)
}, [token, conversationId]);


  const fetchMessages = async (conversationId) => {
    try {
      const messagesResponse = await api.get(`/messages/conversations/${conversationId}/messages`, { headers: { Authorization: `Bearer ${token}` }});
      console.log(messagesResponse, "messagesResponse")

      setMessages(messagesResponse.data);
      
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const markMessagesAsRead = async (conversationId) => {
    try {
      const response = await api.post(`messages/conversations/${conversationId}/mark-as-read`, {headers: { Authorization: `Bearer ${token}`}});
      console.log("🚀 ~ markMessagesAsRead ~ response:", response)
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };



  const handleSendMessage = async () => {
    if (!messageContent.trim()) return;
    if(!selectedConversation) return;
    setSending(true);
    
    try {
      const newMessage = {
        content: messageContent,
        receiver_id: selectedConversation.participant1_id,
        conversation_id: selectedConversation.conversation_id
      };
      if(tokenUserId === selectedConversation.participant1_id) {
        newMessage.receiver_id = selectedConversation.participant2_id;
      }

      const response = await api.post(`/messages/conversations/${conversationId}`, newMessage, { headers: { Authorization: `Bearer ${token}` } 
      });
      console.log(response, "create message")
      const newMessageDetails = response.data[0];
      setMessages([...messages, newMessageDetails]);
      setMessageContent('');
      setSnackbarMessage('Message sent successfully!');
      setAlertType('success');
      setSnackbarOpen(true);
      setSending(false);
    } catch (error) {
      console.error('Error sending message:', error);
      setSnackbarMessage('Error sending message.');
      setAlertType('error');
      setSnackbarOpen(true);
      setSending(false);
    }
  };

  const handleConversationSelect = async (conversation) => {
    console.log("🚀🚀🚀 ~ handleConversationSelect ~ conversation:", conversation)
    setSelectedConversation(conversation);
    await markMessagesAsRead(conversation.conversation_id);
    navigate(`/conversation/${conversation.conversation_id}`);
  };

  const handleNewConversation = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedUser(null);
  };

  const handleCreateConversation = async () => {
    if (selectedUser) {
      try {
        const newConversation = {
          participant2_id: selectedUser.userId
        };

        const response = await api.post('/messages/conversations', newConversation, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setConversations([...conversations, response.data]);
        setSelectedConversation(response.data);
        setOpenDialog(false);
        setSelectedUser(null);
        fetchMessages(response.data.conversation_id);
        setSnackbarMessage('Conversation created successfully!');
        setAlertType('success');
        setSnackbarOpen(true);
        navigate(`/conversation/${response.data.conversation_id}`);
      } catch (error) {
        console.error('Error creating new conversation:', error.response.data.message);
        setSnackbarMessage(error.response.data.message);
        setAlertType('error');
        setSnackbarOpen(true);
      }
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchQuery.toLowerCase());
    if (tabValue === 0) return matchesSearch;
    if (tabValue === 1) return user.role_name === 'admin' && matchesSearch;
    if (tabValue === 2) return user.role_name === 'student' && matchesSearch;
    if (tabValue === 3) return user.role_name === 'counsellor' && matchesSearch;
    return false;
  });
  console.log("filteredUsers", filteredUsers, "filteredUsers")

  const handleDeleteConversation = async (conversationId) => {
    try {
      await api.delete(`messages/conversations/${conversationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSnackbarMessage('Conversation deleted successfully!');
      setAlertType('success');
      setSnackbarOpen(true);
      setConversations(conversations.filter(convo => convo.conversation_id !== conversationId));
    } catch (error) {
      console.error('Failed to delete the conversation:', error);
      setSnackbarMessage('Failed to delete the conversation.');
      setAlertType('error');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };
  let tokenUserId=null;
  if (token){
    tokenUserId = jwtDecode(token).userId; 
    console.log("🚀 ~ MessagingPage ~ tokenUserId:", tokenUserId)
  }
  console.log("messages🚀 ~  :", messages)
  
  
  const handleSearchChange = (event) => {
    setSearchQuery(conversations?.filter(convo => convo.other_participant_fullName.toLowerCase().includes(event.target.value.toLowerCase())));
  };
 

  if (!token) {
    return (
      <div className={`${mode === "light" ? "light-container" : "dark-container"}`} id="job-listing-page-container">
        <Container style={{ paddingTop: "200px" }}>
          <Typography variant="h6" align="center">
            <Button 
            color="primary"
            variant="contained"
            size="small"
            component="a"
            href="/user-signIn"
          >
            Sign in to view Messages
            </Button>
            </Typography>
        </Container>
      </div>
    );
  }

 

// render messages
  const renderMessages = () => {
    // Check if messages is an array
    if (!Array.isArray(messages)) {
      console.error("Expected 'messages' to be an array, but received:", messages);
      return null; // or return an appropriate fallback UI
    }
    
    return messages.map(message => (
      <Box key={message.message_id}  display="flex" justifyContent={message.sender_id === tokenUserId ? 'flex-end' : 'flex-start'} m={1}>
        <Paper  elevation={0} style={{ padding: '7px', maxWidth: '60%', backgroundColor: message.sender_id === 1 ? '#e3f2fd' : '#f1f8e9', border:"1px solid rgb(219 219 219 / 81%)", borderRadius:"12px"}}>
          <Typography variant="body2">{message.content}</Typography>
          <Typography style={{fontSize:"11px", padding:"0px", marginBottom:"-5px", display:"flex", justifyContent:"flex-end", alignItems:"center"}} variant="caption" display="block" align="right">
          {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
          {!message.readAt ? (
            <Done style={{ color: 'gray', marginLeft: '4px', fontSize: 'small' }} />
          ) : (
            <CheckCircleOutline style={{ color: 'green', marginLeft: '4px', fontSize: 'small' }} />
          )}
            </Typography>
        </Paper>
      </Box>
    ));
  };





  return (
    <div className={`${mode === "light" ? "light-container" : "dark-container"}`} id="job-listing-page-container">
      <Container style={{ paddingTop: "100px", }}>

        <Box display="flex" height="80vh" style={{border:`${mode === "light" ? "0px solid white" : "2px solid white"}`, borderRadius:"9px", position:"relative", overflow:"hidden"}}>


{/* Sidebar with user list */}
 { !isSidebarOpen && 
    <Box className='chat-side-bar' width="300px" bgcolor="#121621" p={2} style={{borderRadius:"9px 0px 0px 9px", overflowY:"scroll"}} sx={{
    '&::-webkit-scrollbar': {
      width: '5px',  // Adjust width to make it small
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#888888e3',  // Adjust color to make it light
      borderRadius: '10px',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      backgroundColor: '#555',
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: '#121621',
    },
  }}>
      <Box bgcolor="#121621" style={{position:"sticky", top:'0px', zIndex:"2", paddingBottom:"16px", paddingTop:"0px", display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between', flexDirection:"column",}}>
  <Box display={'flex'} style={{alignItems: 'center',
    justifyContent: 'space-between', width:"100%"}}>
    <Typography variant="body1"
      color={'#dbdbdb'}
      component="span"
      style={{ fontWeight: 'bold', fontSize: "18px"}}
    >
      Chat
    </Typography>
    
    <IconButton
    color="primary"
    onClick={handleNewConversation}
    style={{ backgroundColor: '#3a3f51', borderRadius: '50%' }} // Styling the icon button
  >
    <AddIcon />
  </IconButton>
  </Box>
  
        <InputBase
          placeholder="Search chats..."
          value={searchQuery}
          onChange={handleSearchChange}
          style={{
            color: '#dbdbdb',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            padding: '3px 6px',
            borderRadius: '4px',
            flexGrow: 1,
            width: '100%',
            marginTop:"16px",
            borderBottom:"2px solid #1976d2"
          }}
        />
        </Box>
        <List className='messaging-app' style={{backgroundColor:"rgb(26 32 49)", marginTop:"16px", padding:"0px", borderRadius:"9px"}}>

        {conversations?.sort((a, b) => {
          if (a.unreadMessagesCount && !b.unreadMessagesCount) {
            return -1; // 'a' has unread messages, so it should come before 'b'
          } else if (!a.unreadMessagesCount && b.unreadMessagesCount) {
            return 1; // 'b' has unread messages, so it should come before 'a'
          } else {
            return 0; // maintain the existing order if both have unread messages or neither do
          }
        }).map(conversation => (
            <ListItem key={conversation.other_participant_id} button onClick={() => handleConversationSelect(conversation)} 
            style={{
              backgroundColor: selectedConversation?.conversation_id === conversation.conversation_id
                ? '#3a3f51'  // Selected conversation color
                : (conversation.unreadMessagesCount > 0 && conversation.lastReceiverId === tokenUserId)
                ? 'rgb(43, 60, 120)' // Unread messages for the user as receiver
                : 'inherit', // Default background for other cases
              borderRadius: "9px",
              position: "relative",
            }}>

             
          <Badge
              color="success" // This sets the badge color to a predefined theme color
              badgeContent={conversation.unreadMessagesCount > 0 && conversation.lastReceiverId === tokenUserId ? conversation.unreadMessagesCount : 0}
              showZero={false} // This prevents the badge from showing when there are no unread messages
            >
          </Badge>

              <Box style={{ textDecoration: 'none', color: 'inherit', display: "flex", alignItems: "center", flex: "2" }}>
            <ListItemAvatar style={{ height: "50px", width: "50px", marginRight: "10px" }}>
              <Avatar style={{ height: "50px", width: "50px" }} src={conversation.other_participant_avatarURL} alt={conversation.other_participant_fullName || `${conversation.other_participant_first_name} ${conversation.other_participant_last_name}`} />
              <Badge
                sx={{
                  backgroundColor: "#4CAF50",
                  bottom: "12px",
                  left: "10px",
                  position: "relative",
                  borderRadius: "15px",
                  padding: "1px 6px",
                  fontSize: "9px",
                  color: "white",
                  border: "2px solid white",
                  textWrap: "nowrap"
                }}
                overlap="circular"
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
              >
            {conversation.other_participant_roleName}
          </Badge>
        </ListItemAvatar>
        <ListItemText
          primary={
            <>
            <Typography
                variant="body1"
                color={'#dbdbdb'}
                component="span"
                style={{ fontWeight: 'bold',fontSize: "16px"  }}
            >
                {conversation.other_participant_first_name && conversation.other_participant_last_name
                ? `${conversation.other_participant_first_name} ${conversation.other_participant_last_name}`
                : conversation.other_participant_fullName}
            </Typography>
               </>
        }

           secondary={
            <Typography
            variant="body2"
            color="#cfcfcf"
            component="span"
            style={{ display: "inline-block",  fontSize: "12px", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden", maxWidth: "185px" }}
            title={conversation.other_participant_headline || 'No headline provided'}
          >
            {conversation.other_participant_headline || 'No headline provided'}
          </Typography>
          }
          primaryTypographyProps={{ className: mode === 'light' ? 'light-m-text-prime-color' : 'dark-m-text-prime-color' }}
          secondaryTypographyProps={{ className: mode === 'light' ? 'light-m-text-secondary-color' : 'dark-m-text-secondary-color' }}
        />

          <IconButton style={{position:"absolute", right:"0px", }} color="error" onClick={() => handleDeleteConversation(conversation.conversation_id)}>
          <DeleteIcon fontSize='small'/>
        </IconButton>
      </Box>
    </ListItem>
    
  ))}
</List>
</Box>
}








 {/* Main chat area */}
      <Box style={{borderRadius:"9px"}} flexGrow={1} display="flex" flexDirection="column">
        <AppBar style={{borderRadius:"0px 9px 0px 0px", backgroundColor:"white", border:"1px solid rgba(0, 0, 0, 0.12)", boxShadow:"none"}} position="static" >
          <Toolbar>
            {selectedConversation && (
              <>
              <ListItemAvatar style={{ height: "50px", width: "50px", marginRight: "10px" }}>
                <Avatar 
                src={tokenUserId === selectedConversation.participant1_id? selectedConversation.participant2_avatarURL : selectedConversation.participant1_avatarURL} 
                alt={tokenUserId === selectedConversation.participant1_id? selectedConversation.participant2_fullName : selectedConversation.participant1_fullName} 
              />
             
                <Badge
                  sx={{
                    backgroundColor: "#4CAF50",
                    bottom: "12px",
                    left: "10px",
                    position: "relative",
                    borderRadius: "15px",
                    padding: "1px 6px",
                    fontSize: "9px",
                    color: "white",
                    border: "2px solid white",
                    textWrap: "nowrap"
                  }}
                  overlap="circular"
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                >
                  {`${selectedConversation.other_participant_roleName}`}
                </Badge>
                </ListItemAvatar>
                <ListItemText
                primary={
                  <>
                    <Typography
                      variant="body1"
                      color={'text.primary'}
                      component="span"
                      style={{ fontWeight: 'bold', fontSize: "16px" }}
                    >
                      {selectedConversation.other_participant_first_name && selectedConversation.other_participant_last_name
                  ? `${selectedConversation.other_participant_first_name} ${selectedConversation.other_participant_last_name}`
                  : selectedConversation.other_participant_fullName}
                    </Typography>
                  </>
                }
                secondary={
                  <>
                    <Typography
                      variant="body2"
                      color={mode === 'light' ? 'text.secondary' : '#898989'}
                      component="span"
                      style={{ fontSize: "12px", }}
                    >
                      {selectedConversation.other_participant_headline ? 
                      `${selectedConversation.other_participant_headline}` : 'Headline is not set up yet!'}
                    </Typography>
                  </>
                }
                primaryTypographyProps={{ className: mode === 'light' ? 'light-m-text-prime-color' : 'dark-m-text-prime-color' }}
                secondaryTypographyProps={{ className: mode === 'light' ? 'light-m-text-secondary-color' : 'dark-m-text-secondary-color' }}
              />
               <Button
               sx={{ display: { minWidth: '30px', p: '4px', sm:'', md:"none" } }}
                variant="text"
                color="primary"
                aria-label="menu"
                onClick={handleToggleSidebar}
              >
                <MenuIcon />
              </Button>
            </>
            )}
          </Toolbar>
        </AppBar>

        {/* Messages */}
        <Box ref={boxRef} className={`${!conversationId?"no_conversation_selected":""}`} style={{border:"1px solid rgba(0, 0, 0, 0.12)", borderTop:'none', borderBottom:"none"}} flexGrow={1} p={2} bgcolor="grey.100" overflow="auto" sx={{
           overflowY: "auto",
    '&::-webkit-scrollbar': {
      width: '5px',  // Adjust width to make it small
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#b9b9b9e3',  // Adjust color to make it light
      borderRadius: '10px',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      backgroundColor: '#989898e3',
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: 'grey.100',
    },
  }}>
          
        {!conversationId && (
          <Typography variant="body1" align="center" style={{ marginTop: '20px', color: '#666' }}>
            Welcome to your counseling hub!
            <br />
            Select a conversation to chat
          </Typography>
        )}

          {renderMessages()}
        </Box>

        {/* Message input */}
        {conversationId && (<Box style={{borderRadius:"0px 0px 9px 0px", border:"1px solid rgba(0, 0, 0, 0.12)", maxHeight:"200px",  position:"relative"}} p={2} bgcolor="grey.200" display="flex" alignItems="center">
          <InputBase
            placeholder="Type a message..."
            fullWidth
            multiline
            minRows={1}
            maxRows={4}
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
          />
         <IconButton
      color="primary"
      onClick={handleSendMessage}
      style={{
        position: 'relative',
        transition: 'transform 0.3s ease-in-out',
        ...(sending && { transform: 'scale(1.1)' })
      }}
    >
      {sending ? (
        <CircularProgress
          size={24}
          style={{
            color: 'inherit',
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginTop: -12,
            marginLeft: -12
          }}
        />
      ) : (
        <SendIcon />
      )}
    </IconButton>
        </Box>)}
        </Box>
      </Box>
    </Container>

      {/* New Conversation Dialog */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Create New Conversation</DialogTitle>
        <DialogContent>
          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label="All" />
            <Tab label="Admins" />
            <Tab label="Students" />
            <Tab label="Counselors" />
          </Tabs>
          <Box display="flex" alignItems="center" gap={1} mt={2} mb={2}>
            <SearchIcon />
            <InputBase
              placeholder="Search ..."
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Box>
          <List>
            {filteredUsers.map(user => (
              <ListItem key={user.userId} button onClick={() => setSelectedUser(user)}>
                <Box style={{ textDecoration: 'none', color: 'inherit', display: "flex", alignItems: "center", flex: "2" }}>
                  <ListItemAvatar style={{ height: "50px", width: "50px", marginRight: "10px" }}>
                    <Avatar style={{ height: "50px", width: "50px" }} src={user.avatarURL} alt={user.fullName} />
                    <Badge
                      sx={{
                        backgroundColor: "#4CAF50",
                        bottom: "12px",
                        left: "10px",
                        position: "relative",
                        borderRadius: "15px",
                        padding: "1px 6px",
                        fontSize: "9px",
                        color: "white",
                        border: "2px solid white",
                        textWrap: "nowrap"
                      }}
                      overlap="circular"
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                      }}
                    >
                      {`${user.role_name}`}
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <>
                        <Typography
                          variant="body1"
                          color={'text.primary'}
                          component="span"
                          style={{ fontWeight: 'medium', fontSize: "16px" }}
                        >
                          {user.fullName}
                        </Typography>
                      </>
                    }
                    secondary={
                      <>
                        <Typography
                          variant="body2"
                          color={mode === 'light' ? 'text.secondary' : '#898989'}
                          component="span"
                          style={{ fontSize: "12px" }}
                        >
                          {user.headline ? `${user.headline}` : 'Headline is not set up yet!'}
                        </Typography>
                      </>
                    }
                    primaryTypographyProps={{ className: mode === 'light' ? 'light-m-text-prime-color' : 'dark-m-text-prime-color' }}
                    secondaryTypographyProps={{ className: mode === 'light' ? 'light-m-text-secondary-color' : 'dark-m-text-secondary-color' }}
                  />
                </Box>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreateConversation} color="primary" disabled={!selectedUser}>
            Create
          </Button>
        </DialogActions>
      </Dialog>


      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={alertType} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

    </div>
  );
};

export default MessagingPage;
