import React, { useEffect, useState } from "react";
import { Container, Box, Button, List, Snackbar, Alert, Divider } from "@mui/material";
import FriendList from "../Components/FriendList";
import SearchPeople from "../Components/SearchPeople";
import RequestHandling from "../Components/RequestHandling.js"; 
import api from '../Api/Api.js'
import Footer from "./landing-page/components/Footer.js";


const Peoples = ({ mode }) => {
  const [loading, setLoading] = useState(false);
  const [activeButton, setActiveButton] = useState("search");
  const [friends, setFriends] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [requests, setRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [token, setToken] = useState(sessionStorage.getItem("token"));
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [alertOpen, setAlertOpen] = useState(false); 
  const [alertMessage, setAlertMessage] = useState(""); 
    const [snackbarSeverity, setSnackbarSeverity] = useState('');
    
  
  useEffect(() => {
    const storedToken = sessionStorage.getItem("token");
    setToken(storedToken);
  }, [token]); 


  // const handleAccept = () => {
  //   onAccept(requests.id);
  // };

  // const handleReject = () => {
  //   onReject(requests.id);
  // };



  
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const response = await api.get("/people/listAllRequest", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRequests(response.data.allRequests);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setLoading(false);
      }
    };

    fetchRequests();
  }, [activeButton,token]);






  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/people");
      setFriends(response.data.results);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  // const fetchRequests = async () => {
  //   try {
  //     const response = await api.get("/notifications/requests"); // Fetch notification requests
  //     setRequests(response.data.requests);
  //   } catch (error) {
  //     console.error("Error fetching requests:", error);
  //   }
  // };

  const handleSearchResults = (results) => {
    setSearchResults(results);
  };

  const handleConnectRequest = async (connectionId) => {
    try {
      // Make a POST request to your backend API to send a connection request
      const response = await api.post(`/people/request-connection/${connectionId}`);
      // Assuming the backend responds with a success message, you can update the UI or show a notification
      alert('Connection request sent successfully');
    } catch (error) {
      console.error('Error sending connection request:', error);
      alert('Failed to send connection request. Please try again.');
    }
  };

  const handleButtonClick = (type) => {
    setActiveButton(type);
    setLoading(true); // Set loading state to true when button clicked
    // Assuming loading state is set in fetchUsers()
  };

  const handleAccept = async (requestId) => {
    try {
      const response = await api.post(`/people/requests/${requestId}/accept`, {headers: {
        Authorization: `Bearer ${token}` 
      }
      });
       setRequests(requests.filter((request) => request.id !== requestId));
       setSnackbarSeverity('success');
       setSnackbarMessage(response.data.message);

    setSnackbarOpen(true);
    setAlertOpen(false);
    } catch (error) {
      console.error('Error accepting request:', error);
      setSnackbarSeverity('error');
      setAlertMessage(error.response.data.message);
    setAlertOpen(true);
    setSnackbarOpen(true);
    }
  };

  const handleReject = async (requestId) => {
    try {
      const response = await api.post(`/people/requests/${requestId}/reject`, {headers: {
        Authorization: `Bearer ${token}` 
      }
      });
       setRequests(requests.filter((request) => request.id !== requestId));
       setSnackbarSeverity('success');
       setSnackbarMessage(response.data.message);
       setSnackbarOpen(true);
      setAlertOpen(false);
    } catch (error) {
      console.error('Error rejecting request:', error);
      setSnackbarSeverity('error');
    setAlertMessage(error.response.data.message);
    setAlertOpen(true);
    setSnackbarOpen(true);
    }
  };
    
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
    };

  return (
    <>

    <Container
      id="people-container"
      maxWidth="md"
      style={{ padding: "100px 0px 60px 0px" }}
    >
      <List sx={{ width: "75%", margin: "0 auto" }}>
        <Box
          display="flex"
          className={`${
            mode === "light"
              ? "light-m-bg-second-color light-m-border-prime-color"
              : "dark-m-bg-second-color dark-m-border-prime-color"
          }`}
          borderRadius={"6px"}
          padding={"20px"}
          gap={1.5}
          justifyContent="left"
          mb={2}
        >
          <Button
            variant={mode === "light" ? "outlined" : "contained"}
            size="small"
            onClick={() => handleButtonClick("search")}
            sx={{
              bgcolor:
                activeButton === "search"
                  ? mode === "light"
                    ? "primary.light"
                    : "primary.dark"
                  : mode === "light"
                  ? "third.light"
                  : "gray",
              color:
                activeButton === "search"
                  ? mode === "light"
                    ? "white"
                    : "light"
                  : mode === "light"
                  ? "primary.main"
                  : "light",
              "&:hover": {
                bgcolor: mode === "light" ? "primary.light" : "primary.dark",
              },
            }}
          >
            Search People
          </Button>
          <Button
            variant={mode === "light" ? "outlined" : "contained"}
            size="small"
            onClick={() => handleButtonClick("friends")}
            sx={{
              bgcolor:
                activeButton === "friends"
                  ? mode === "light"
                    ? "primary.light"
                    : "primary.dark"
                  : mode === "light"
                  ? "third.light"
                  : "gray",
              color:
                activeButton === "friends"
                  ? mode === "light"
                    ? "white"
                    : "light"
                  : mode === "light"
                  ? "primary.main"
                  : "light",
              "&:hover": {
                bgcolor: mode === "light" ? "primary.light" : "primary.dark",
              },
            }}
          >
            Friends
          </Button>
          <Button
            variant={mode === "light" ? "outlined" : "contained"}
            size="small"
            onClick={() => handleButtonClick("request")} 
            sx={{
              bgcolor:
                activeButton === "request"
                  ? mode === "light"
                    ? "primary.light"
                    : "primary.dark"
                  : mode === "light"
                  ? "third.light"
                  : "gray",
              color:
                activeButton === "request"
                  ? mode === "light"
                    ? "white"
                    : "light"
                  : mode === "light"
                  ? "primary.main"
                  : "light",
              "&:hover": {
                bgcolor: mode === "light" ? "primary.light" : "primary.dark",
              },
            }}
          >
            Requests
          </Button>
        </Box>

        {activeButton === "search" ? (
          <SearchPeople
            mode={mode}
            loading={loading}
            friends={searchResults}
            handleMoreOptionsClick={() => {}}
            handleSearchResults={handleSearchResults}
          />
        ) : activeButton === "friends" ? (
          <FriendList
            mode={mode}
            loading={loading}
            friends={friends}
            handleConnectRequest={handleConnectRequest}
            token={token}
          />
        ) : (
          // Conditionally render based on the presence of token
          token ? (
            // Render the list of requests if token is present
            <List sx={{ width: '100%', margin: "0 auto" }}>
              {requests.length === 0 ? (
                <p style={{textAlign:"center"}}>No requests available</p>
              ) : (
                requests.map((request) => (
                  <RequestHandling
                    mode={mode}
                    activeButton={activeButton}
                    key={request.id}
                    request={request}
                    onAccept={() => handleAccept(request.id)}
                    onReject={() => handleReject(request.id)}
                  />
                ))
              )}
            </List>
          ) : (
            // Render content when token is not present
            <Container maxWidth="lg">
              <p style={{ textAlign: "center" }}>Please sign in to view requests</p>
            </Container>
          )
        )}

         {/* Snackbar for request acceptance/rejection success */}
        

      </List>
      
    </Container>
    <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
          </Snackbar>

          <Divider sx={{
        marginTop:"100px"
      }} />
      <Footer/>
</>
  );
};

export default Peoples;
