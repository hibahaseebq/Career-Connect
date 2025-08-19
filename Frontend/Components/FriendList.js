import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, Button, IconButton, Box, CircularProgress, Container, Menu, MenuItem, TextField, Typography, Badge } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import api from '../Api/Api';
import { Link } from 'react-router-dom';

const FriendList = ({ mode ,token, friends, handleMoreOptionsClick }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);
  const [loading, setLoading] = useState(false);

    
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/people/listAllFriends?term=${searchTerm}&page=1&limit=10`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setFilteredResults(response.data.results);
      } catch (error) {
        console.error("Error fetching friends:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, [searchTerm, token]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const handleSendConnection = (friend) => {
    // Implement sending connection request logic here
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  function timeSince(date) {
    const now = new Date();
    const past = new Date(date);
    const secondsPast = (now - past) / 1000;
  
    if (secondsPast < 60) {
      return `${Math.floor(secondsPast)} second${Math.floor(secondsPast) !== 1 ? 's' : ''}`;
    }
    if (secondsPast < 3600) {
      return `${Math.floor(secondsPast / 60)} minute${Math.floor(secondsPast / 60) !== 1 ? 's' : ''}`;
    }
    if (secondsPast < 86400) {
      return `${Math.floor(secondsPast / 3600)} hour${Math.floor(secondsPast / 3600) !== 1 ? 's' : ''}`;
    }
    if (secondsPast < 2592000) {
      return `${Math.floor(secondsPast / 86400)} day${Math.floor(secondsPast / 86400) !== 1 ? 's' : ''}`;
    }
    if (secondsPast < 31536000) {
      return `${Math.floor(secondsPast / 2592000)} month${Math.floor(secondsPast / 2592000) !== 1 ? 's' : ''}`;
    }
    return `${Math.floor(secondsPast / 31536000)} year${Math.floor(secondsPast / 31536000) !== 1 ? 's' : ''}`;
  }


  return (
    <Container  style={{ padding: "10px 0px 10px 0px" }}>
    <Box display="flex" justifyContent="left" alignItems="center" mb={1}>
        <TextField
          className={`${mode === "light" ? "light-m-input-field" : "dark-m-input-field"}`}
          label="Search People"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            sx: {
              color: mode === "light" ? "primary.main" : "primary.light", // Text color based on mode
              '& .MuiSvgIcon-root': {
                color: mode === "light" ? "primary.main" : "primary.light", // Icon color based on mode
              },
              '&:hover .MuiIconButton-root': {
                backgroundColor: mode === "light" ? "primary.light" : "primary.main", // Icon button background color on hover based on mode
              }
            },
            endAdornment: (
              <>
                <SearchIcon />
                {searchTerm && (
                  <IconButton style={{ padding: "1px", marginLeft: "10px", backgroundColor: "none" }} size="small" onClick={handleClearSearch}>
                    <ClearIcon />
                  </IconButton>
                )}
              </>
            )
          }}
        />
      </Box>
      <List sx={{ width: '100%', margin: "0 auto" }}>
                {loading ? (
                    <Box textAlign="center" py={2}>
                        <CircularProgress />
                    </Box>
        ) : (
          <Box borderRadius={'6px'} className={`${mode === "light" ? "light-m-border-prime-color" : "dark-m-border-prime-color"}`}>


        {filteredResults && filteredResults.length > 0 ? (
           filteredResults.map((friend) => (
  
              <ListItem   style={{position:"relative"}} key={friend.userId} className={`${mode === "light" ? 'light-m-bg-prime-color light-m-border-prime-color' : 'dark-m-bg-second-color dark-m-border-prime-color'} `} borderRadius={'6px'} padding={'20px'} gap={1.5} 
              // onClick={() => handleMoreOptionsClick(friend)}
              >
               

               <Link  to={`/profile/${friend.userId}`} style={{ textDecoration: 'none', color: 'inherit', display:"flex", alignItems:"center", flex:"2" }}>


                <ListItemAvatar style={{height:"50px", width:"50px", marginRight:"10px"}}>
                                <Avatar style={{height:"50px", width:"50px"}} src={friend.senderAvatarUrl} alt={friend.FullName} />

                                <Badge
                                        sx={{
                                        backgroundColor: "#4CAF50",
                                        bottom: "12px",
                                        left: "10px",
                                        position:"relative",
                                        borderRadius: "15px",
                                        padding:"1px 6px",
                                        fontSize:"9px",
                                        color:"white",
                                        border:"2px solid white",
                                        textWrap:"nowrap"
                                        }} 
                                        overlap="circular"
                                        anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'right',
                                        }}
                                        >
                                        {`${friend.senderUserType}`}
                                        </Badge>

                                        
                            </ListItemAvatar>



                <ListItemText
                                primary={
                                    <Typography
                                        variant="body1"
                                        color={mode === 'light' ? 'text.primary' : 'white'}
                                        component="span"
                                        style={{ fontWeight: 'bold' }}
                                    >
                                        {friend.senderFullName}
                                        {friend.id}
                                    </Typography>
                                }
                                secondary={
                                    <>
                                        <Typography
                                            variant="body2"
                                            color={mode === 'light' ? 'text.secondary' : '#cfcfcf'}
                                            component="span"
                                        >
                                            {friend.senderHeadline}
                                        </Typography>
                                        <br />

                                        <Typography
                                        variant="caption"
                                        color={mode === 'light' ? 'text.secondary' : '#cfcfcf'}
                                        component="span"
                                    >
                                        {friend.senderDistrict}, {friend.senderRegion},  {friend.senderCountry}
                                    </Typography>
                                    </>
                                }
                                primaryTypographyProps={{ className: mode === 'light' ? 'light-m-text-prime-color' : 'dark-m-text-prime-color' }}
                                secondaryTypographyProps={{ className: mode === 'light' ? 'light-m-text-secondary-color' : 'dark-m-text-secondary-color' }}
                    />

                </Link>

      <span className={`${mode  === 'light' ? 'light-m-text-prime-color' : 'dark-m-text-prime-color'}`}  style={{marginLeft:"20px", fontWeight:"lighter", fontSize:"12px", position:"absolute", bottom:"5px", right:"5px"}}>{timeSince(friend.updatedAt)}</span>

                <Box ml="auto" mr='10px'>

                    <Button  sx={{ border: `2px solid ${mode === "light" ? "primary.main" : "primary.light"}`, borderRadius: "20px", borderWidth:"2px" }} variant={`${mode==="light"? "outlined":"contained"}`} color="primary" onClick={() => handleSendConnection(friend)}>
                        Message
                    </Button>
                </Box>
                    
                <Box>
                  <IconButton onClick={(event) => setAnchorEl(event.currentTarget)}>
                    <MoreVertIcon style={{color:`${mode==="light"?"":"#cfcfcf"}`}} />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleCloseMenu}
                  >
                    <MenuItem onClick={handleCloseMenu}>Remove</MenuItem>
                  </Menu>
                </Box>
             
            </ListItem>
             ))
             ) : (
              <Container maxWidth="lg">
                {token ? (
                  <p style={{ textAlign: "center" }}>No Friends Yet</p>
                ) : (
                  <p style={{ textAlign: "center" }}>log in to see your friends...</p>
                )}

              </Container>)
            }

          </Box>
        )}
      </List>
    </Container>
  );
};

export default FriendList;
