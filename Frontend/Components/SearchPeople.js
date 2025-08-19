import React, { useEffect, useState  } from 'react';
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, Box, CircularProgress, Container, TextField, IconButton, Typography, Divider, Button, Badge } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import debounce from 'lodash.debounce';
import api from '../Api/Api';
import { Link } from 'react-router-dom';
import { Snackbar, Alert } from '@mui/material';

const SearchPeople = ({ mode, friends, handleMoreOptionsClick }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredResults, setFilteredResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [requestedUsers, setRequestedUsers] = useState([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');
    const [currentPage, setCurrentPage] = useState(1); // Track current page
    const [totalPages, setTotalPages] = useState(1); // Track total pages
    const [token, setToken] = React.useState(sessionStorage.getItem('token')); 
    let debounceTimeout;

    // useEffect(() => {
    //     setLoading(true);
    //     const fetchData = setTimeout(() => {

    //         const friends = [
    //             { id: 1, name: 'John Dsaaoe', headline: 'Software Engineer', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
    //             { id: 2, name: 'aane Smith', headline: 'Web Developer', avatar: 'https://randomuser.me/api/portraits/women/1.jpg' },
    //             { id: 3, name: 'John Dsaaoe', headline: 'Software Engineer', avatar: 'https://randomuser.me/api/portraits/men/2.jpg' },
    //             { id: 4, name: 'aane Smith', headline: 'Web Developer', avatar: 'https://randomuser.me/api/portraits/women/2.jpg' },
    //             { id: 5, name: 'John Dsaaoe', headline: 'Software Engineer', avatar: 'https://randomuser.me/api/portraits/men/3.jpg' },
    //             { id: 6, name: 'aane Smith', headline: 'Web Developer', avatar: 'https://randomuser.me/api/portraits/women/3.jpg' },
    //         ];

            

    //         debounceTimeout = setTimeout(() => {
    //             const sampleSearchResults = friends.filter(friend =>
    //                 friend.name.toLowerCase().includes(searchTerm.toLowerCase())
    //             );
    //             setFilteredResults(sampleSearchResults);
    //             setLoading(false);
    //         }, 1000);

    //         setLoading(false);
    //     }, 1000);
    //     return () => clearTimeout(fetchData);
    // }, [searchTerm, friends]);

    useEffect(() => {
        setLoading(true);
        const fetchData = setTimeout(() => {
            api.get(`/people/search?term=${searchTerm}&page=${currentPage}&limit=10`)
                .then(response => {
                    setFilteredResults(response.data.results);
                    setTotalPages(response.data.totalPages);
                    setLoading(false);
                })
                .catch(error => {
                    setError(error);
                    setLoading(false);
                });
        }, 0);
        return () => clearTimeout(fetchData);
    }, [searchTerm, currentPage]);

    const handleSearchChange = (event) => {
        const term = event.target.value;
        setSearchTerm(term);
        setCurrentPage(1); 
    };



    const handleSendConnection = async (connectionId) => {
        try {
            if (!token) {
                console.error('Please sign in first');
                showSnackbar('Failed to send connection request. Please sign in to your account first.', 'error');
                return;
              }
            const response = await api.post(`/people/connections/send-connection/${connectionId}`, {
                headers: {
                  Authorization: `Bearer ${token}` 
                }
              });
          
          if (response.status===200) {
            setRequestedUsers(prevState => [...prevState, connectionId]);
            showSnackbar('Connection request sent successfully', 'success');
          } else {
            const errorMessage = await response;
            console.error('Error sending connection request:', errorMessage.data.message);
            showSnackbar(`Error: ${errorMessage.data.message}`, 'error');
          }
        } catch (error) {
          console.error('Error sending connection request:', error.response.data.message);
          showSnackbar(`Error: ${error.response.data.message}`, 'error');
        }
    };

    const handleClearSearch = () => {
        setSearchTerm('');
        setCurrentPage(1); 
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };
    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };
    
    const showSnackbar = (message, severity = 'success') => {
        setSnackbarMessage(message);
        setAlertSeverity(severity);
        setSnackbarOpen(true);
    };
    return (
        <Container  style={{ padding: "10px 0px 10px 0px" }}>
            <Box display="flex" justifyContent="left" alignItems="center" mb={1}>
                <TextField
                className={`${mode==="light"? "light-m-input-field":"dark-m-input-field"}`}
                label="Search People"
                variant="outlined"
                size={"small"} 
                value={searchTerm}
                onChange={handleSearchChange}
                InputProps={{
                    sx: {
                        color: mode === "light" ? "primary.main" : "primary.light", // Adjust text color based on mode
                        '& .MuiSvgIcon-root': {
                            color: mode === "light" ? "primary.main" : "primary.light", // Adjust icon color based on mode
                        },
                        '&:hover .MuiIconButton-root': {
                            backgroundColor: mode === "light" ? "primary.light" : "primary.main", // Adjust icon button background color on hover based on mode
                        }
                    },
                    endAdornment: (
                        <>
                            <SearchIcon />
                            {searchTerm && (
                                <IconButton style={{padding:"1px", marginLeft:"10px", backgroundColor:"none"}} size="small"  onClick={handleClearSearch}>
                                    <ClearIcon  />
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
                ) : filteredResults.length ? (
                    filteredResults.map((result) => (

                        <ListItem key={result.id} className={`${mode === "light" ? 'light-m-bg-prime-color light-m-border-prime-color' : 'dark-m-bg-second-color dark-m-border-prime-color'} `} borderRadius={'6px'} padding={'20px'} style={{display:"flex", justifyContent:"space-between"}} gap={1.5} onClick={() => handleMoreOptionsClick(result)}>

                            <Link  to={`/profile/${result.id}`} style={{ textDecoration: 'none', color: 'inherit', display:"flex", alignItems:"center", flex:"2" }}>

                            <ListItemAvatar style={{height:"50px", width:"50px", marginRight:"10px"}}>

                                <Avatar style={{height:"50px", width:"50px"}} src={result.avatarURL} alt={result.fullName} />

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
                                        {`${result.role_name}`}
                                        </Badge>

                                        
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <>
                                    <Typography
                                        variant="body1"
                                        color={mode === 'light' ? 'text.primary' : 'white'}
                                        component="span"
                                        style={{ fontWeight: 'bold' }}
                                    >
                                        {result.fullName}
                                    </Typography>

                                       
                                       </>
                                }
                                secondary={
                                    <>
                                        <Typography
                                            variant="body2"
                                            color={mode === 'light' ? 'text.secondary' : '#cfcfcf'}
                                            component="span"
                                        >
                                            {result.headline? `${result.headline}`: 'headline is not setup yet! by this user'}
                                        </Typography>
                                        <br />
                                        <Typography
                                            variant="caption"
                                            color={mode === 'light' ? 'text.secondary' : '#cfcfcf'}
                                            component="span"
                                        >
                                            {result.district}, {result.region},  {result.country}
                                        </Typography>
                                    </>
                                }
                                primaryTypographyProps={{ className: mode === 'light' ? 'light-m-text-prime-color' : 'dark-m-text-prime-color' }}
                                secondaryTypographyProps={{ className: mode === 'light' ? 'light-m-text-secondary-color' : 'dark-m-text-secondary-color' }}
                            />

                            </Link>

                             <Box ml="auto">
                                <Button sx={{ border: `2px solid ${mode === "light" ? "primary.main" : "primary.light"}`, borderRadius: "20px", borderWidth:"2px" }} variant={`${mode==="light"? "outlined":"contained"}`} color="primary" onClick={() => handleSendConnection(result.id)}  disabled={requestedUsers.includes(result.userId)}>
                                {requestedUsers.includes(result.userId) ? "Requested" : "Connect"}
                                </Button>

                                {/* {result.userId} */}
                            </Box>
                        </ListItem>
                    ))
                ) : (
                    <Box textAlign="center" py={2}>
                        {error ? (
                            <Typography variant="body1" color="error">
                                {error.message}
                            </Typography>
                        ) : (
                            <Typography variant="body1">
                                No results found
                            </Typography>
                        )}
                    </Box>
                )}
            </List>
            {/* Pagination Buttons */}
            <Box display="flex" justifyContent="center" mt={2}>
                <Button disabled={currentPage === 1} onClick={handlePrevPage}>Previous</Button>
                <Button disabled={currentPage === totalPages} onClick={handleNextPage}>Next</Button>
            </Box>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
            >
                <Alert onClose={handleSnackbarClose} severity={alertSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default SearchPeople;
