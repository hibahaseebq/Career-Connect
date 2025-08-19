import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Button,
  IconButton,
  Box,
  CircularProgress,
  MenuItem,
  Menu,
  Container,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";
import axios from "axios";
import api from "../Api/Api.js";
import "./styles/NotificationPage.css";

const NotificationPage = ({ mode }) => {
  const [notifications, setNotifications] = useState([]);
  const [userProfile, setUserProfile] = useState({});
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [activeButton, setActiveButton] = useState("all");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [token, setToken] = useState(sessionStorage.getItem("token"));

  useEffect(() => {
    const storedToken = sessionStorage.getItem("token");
    setToken(storedToken);
  }, [token]); // Include 'token' in the dependency array

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const response = await api.get("/notifications/get", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setNotifications(response.data.notifications);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [page, pageSize, activeButton, token]); // Remove page, pageSize, and activeButton from the dependency array

  // useEffect(() => {
  //   const fetchProfile = async () => {
  //     try {
  //       const response = await api.get("/profile", {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });
  //       setUserProfile(response.data.profile);
  //     } catch (error) {
  //       console.error("Error fetching user profile:", error);
  //     }
  //   };

  //   fetchProfile();
  // }, [token]);

  const markAsRead = async (notificationId) => {
    try {
      await axios.patch(`/notifications/${notificationId}/read`);
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? { ...notification, unread: false }
            : notification
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await axios.delete(`/notifications/${notificationId}`);
      setNotifications((prev) =>
        prev.filter((notification) => notification.id !== notificationId)
      );
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleButtonClick = (type) => {
    setActiveButton(type);
    setPage(1); // Reset to first page when changing filters
  };

  const handleMoreOptionsClick = (event, notification) => {
    setSelectedNotification(notification);
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <Container maxWidth="md" style={{ padding: "100px 0px 60px 0px" }}>
      <List sx={{ width: "75%", margin: "0 auto" }}>
        {loading ? (
          <Box textAlign="center">
            <CircularProgress />
          </Box>
        ) : (
          <>
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
                onClick={() => handleButtonClick("all")}
                variant={mode === "light" ? "outlined" : "contained"}
                size="small"
                sx={{
                  borderRadius: "6px",
                  bgcolor:
                    activeButton === "all"
                      ? mode === "light"
                        ? "primary.light"
                        : "primary.dark"
                      : mode === "light"
                      ? "third.light"
                      : "gray",
                  color:
                    activeButton === "all"
                      ? mode === "light"
                        ? "white"
                        : "light"
                      : mode === "light"
                      ? "primary.main"
                      : "light",
                  "&:hover": {
                    bgcolor:
                      mode === "light" ? "primary.light" : "primary.dark",
                  },
                }}
              >
                All
              </Button>
              <Button
                onClick={() => handleButtonClick("myPosts")}
                variant={mode === "light" ? "outlined" : "contained"}
                size="small"
                sx={{
                  bgcolor:
                    activeButton === "myPosts"
                      ? mode === "light"
                        ? "primary.light"
                        : "primary.dark"
                      : mode === "light"
                      ? "third.light"
                      : "gray",
                  color:
                    activeButton === "myPosts"
                      ? mode === "light"
                        ? "white"
                        : "light"
                      : mode === "light"
                      ? "primary.main"
                      : "light",
                  "&:hover": {
                    bgcolor:
                      mode === "light" ? "primary.light" : "primary.dark",
                  },
                }}
              >
                My posts
              </Button>
              <Button
                onClick={() => handleButtonClick("mentions")}
                variant={mode === "light" ? "outlined" : "contained"}
                size="small"
                sx={{
                  bgcolor:
                    activeButton === "mentions"
                      ? mode === "light"
                        ? "primary.light"
                        : "primary.dark"
                      : mode === "light"
                      ? "third.light"
                      : "gray",
                  color:
                    activeButton === "mentions"
                      ? mode === "light"
                        ? "white"
                        : "light"
                      : mode === "light"
                      ? "primary.main"
                      : "light",
                  "&:hover": {
                    bgcolor:
                      mode === "light" ? "primary.light" : "primary.dark",
                  },
                }}
              >
                Mentions
              </Button>
            </Box>
            <Box
              borderRadius={"6px"}
              className={`${
                mode === "light"
                  ? "light-m-border-prime-color"
                  : "dark-m-border-prime-color"
              }`}
            >
              {notifications.map((notification) => (
                <ListItem
                  key={notification.id}
                  className={`notification-item ${
                    notification.unread ? "unread" : "read"
                  }`}
                  component={Link} // Use Link component for navigation
                  to={{
                    pathname: "/peoples",
                    state: { activeButton: "requests" }, 
                  }} 
                >
                  <ListItemAvatar>
                    <Avatar src={userProfile.avatar} alt={userProfile.name} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={notification.body} // Assuming 'body' contains the notification content
                    secondary={new Date(notification.time).toLocaleString()} // Assuming 'time' is a timestamp
                    primaryTypographyProps={{
                      className:
                        mode === "light"
                          ? "light-m-text-prime-color"
                          : "dark-m-text-prime-color",
                    }}
                    secondaryTypographyProps={{
                      className:
                        mode === "light"
                          ? "light-m-text-third-color"
                          : "dark-m-text-third-color",
                    }}
                  />
                  <IconButton
                    onClick={(event) =>
                      handleMoreOptionsClick(event, notification)
                    }
                    color="primary"
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleCloseMenu}
                  >
                    <MenuItem onClick={() => markAsRead(notification.id)}>
                      Mark as Read
                    </MenuItem>
                    <MenuItem
                      onClick={() => deleteNotification(notification.id)}
                    >
                      Delete
                    </MenuItem>
                  </Menu>
                </ListItem>
              ))}
            </Box>
            <Box mt={3} display="flex" justifyContent="space-between" gap={2}>
              <Button
                disabled={page === 1}
                onClick={() => handlePageChange(page - 1)}
                variant="contained"
                sx={{
                  borderRadius: "6px",
                  bgcolor: mode === "light" ? "primary.main" : "dark.main",
                  color: mode === "light" ? "white" : "light",
                  "&:hover": {
                    bgcolor: mode === "light" ? "primary.dark" : "dark.dark",
                  },
                }}
              >
                Previous
              </Button>
              <Button
                onClick={() => handlePageChange(page + 1)}
                variant="contained"
                sx={{
                  borderRadius: "6px",
                  bgcolor: mode === "light" ? "primary.main" : "dark.main",
                  color: mode === "light" ? "white" : "light",
                  "&:hover": {
                    bgcolor: mode === "light" ? "primary.dark" : "dark.dark",
                  },
                }}
              >
                Next
              </Button>
            </Box>
          </>
        )}
      </List>
    </Container>
  );
};

export default NotificationPage;
