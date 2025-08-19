import React, { useState, useEffect } from 'react';
import { Container, Box, Button, TextField, IconButton, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Grid, Card, CardContent, CardActions, Typography, Popover, MenuItem, Icon, Tooltip, CircularProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import ShareIcon from '@mui/icons-material/Share';
import { EmailIcon, EmailShareButton, FacebookIcon, FacebookShareButton, LinkedinIcon, LinkedinShareButton, WhatsappIcon, WhatsappShareButton } from "react-share";
import api from '../Api/Api';
import getLPTheme from './landing-page/getLPTheme';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CopyAll, CopyAllOutlined } from '@mui/icons-material';
import { useNavigate, useLocation  } from 'react-router-dom';


const CareerList = ({ token, mode }) => {
  const [careers, setCareers] = useState([]);
  console.log("🚀 ~ CareerList ~ careers:", careers)
  const [form, setForm] = useState({ career_name: '', description: '', required_skills: '' });
  const [editId, setEditId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [showCustomTheme, setShowCustomTheme] = useState(true);
  const LPtheme = createTheme(getLPTheme(mode));
  const defaultTheme = createTheme({ palette: { mode } });
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('normal');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [activeButton, setActiveButton] = useState("All");
  const location = useLocation();
  const navigate = useNavigate();


  useEffect(() => {
    fetchCareers();
  }, []);

  const fetchCareers = async () => {
    try {
      const response = await api.get('/careers/get-all-careers');
      setCareers(response.data);
    } catch (error) {
      console.error('Error fetching careers:', error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredCareers = careers.filter((career) =>
    career.career_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetails = (careerId) => {
    navigate(`${careerId}`);
  };

  const handleShareClick = (event, career) => {
    setAnchorEl(event.currentTarget);
    setSelectedCareer(career);
  };

  const handleCloseMenuItem = () => {
    setAnchorEl(null);
    setSelectedCareer(null);
  };

const baseURL = api.defaults.FrontendBaseURL;

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

const handleCopy = (url) => {
  navigator.clipboard.writeText(url).then(() => {
    showSnackbar("Link copied")
    window.alert('Link copied to clipboard!');
  },
    (err) => {
    console.error('Failed to copy link:', err);
  });
};



const handleButtonClick = (type) => {
  setActiveButton(type);
  if (type === 'Recommended') {
    navigate(`/careers/recommended`);
  } else if (type === 'All') {
    navigate(`/careers`);
  }
};


if (!filteredCareers) {
  return (<Container style={{  display: 'flex', justifyContent: 'center', alignItems:"center", minHeight:"100vh"}}>
  <CircularProgress />
</Container>
);
}

  return (
    <ThemeProvider theme={showCustomTheme ? LPtheme : defaultTheme}>
      <div className={`${mode === "light" ? "light-container" : "dark-container"}`} id="job-listing-page-container">
        <Container style={{ paddingTop: "100px" }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, my: 4 }}>
            <TextField
              size="small"
              label="Search Career"
              variant="outlined"
              value={searchTerm}
              onChange={handleSearch}
              InputProps={{
                endAdornment: (
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
                )
              }}
            />
          </Box>




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
            onClick={() => handleButtonClick("All")}
            sx={{
              bgcolor:
                activeButton === "All"
                  ? mode === "light"
                    ? "#42A5F5"
                    : "primary.dark"
                  : mode === "light"
                  ? "third.light"
                  : "gray",
              color:
                activeButton === "All"
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
            All Careers
          </Button>
          {token &&
          <Button
            variant={mode === "light" ? "outlined" : "contained"}
            size="small"
            onClick={() => handleButtonClick("Recommended")}
            sx={{
              bgcolor:
                activeButton === "Recommended"
                  ? mode === "light"
                    ? "primary.light"
                    : "primary.dark"
                  : mode === "light"
                  ? "third.light"
                  : "gray",
              color:
                activeButton === "Recommended"
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
            Recommended
          </Button>
}
          </Box>






          <Grid container spacing={3}>
          {Array.isArray(filteredCareers) && filteredCareers.map((career) => (
              <Grid item xs={12} sm={6} md={4} key={career.career_id}>
                <Card sx={{ 
                  boxShadow: 0, 
                  position:"relative",
                  '&:hover': { 
                    boxShadow: 1, 
                    transform: 'translateY(-4px)',
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out'
                  } 
                }}>
                  <CardContent onClick={() => handleViewDetails(career.career_id)} sx={{ cursor: 'pointer', padding: '24px', paddingBottom:"12px" }}>
                    <Typography style={{
    color: mode === 'dark' ? '#E0E0E0' : '#212121'
  }} variant="h5" component="div" sx={{ fontWeight: 'bold', marginBottom: '12px', fontSize:"22px"  }}>
                      {career.career_name}
                    </Typography>

                    <Tooltip title={career.description} placement="bottom" >
                    <Typography variant="body1" color="text.secondary" sx={{ marginBottom: '8px', height: '120px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {career.description}
                    </Typography>
                    </Tooltip>

                    <Typography mt={2} variant="body2" color="text.secondary">
                      <strong>Skills Required:</strong> {career.required_skills}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ position:'absolute', top:"10px", right:'0px', justifyContent: 'space-between', padding: '16px', pt:'0px' }}>
                    <IconButton onClick={(event) => handleShareClick(event, career)}>
                      <ShareIcon style={{fontSize:'18px'}}  />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={handleCloseMenuItem}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            {selectedCareer && (
              <Box sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom fontSize={16} mb={2}>
                  Share this Career
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-around', gap:"20px" }}>

                <CopyAllOutlined style={{width:"32px"}} onClick={() => handleCopy(`${baseURL}/careers/${selectedCareer.career_id}`)}>
                    <Icon size={32} round={true}>
                      <CopyAll />
                    </Icon>
                  </CopyAllOutlined>


                  <WhatsappShareButton url={`${window.location.origin}/career/${selectedCareer.career_id}`} title={selectedCareer.career_name}>
                    <WhatsappIcon size={32} round />
                  </WhatsappShareButton>
                  <FacebookShareButton url={`${window.location.origin}/career/${selectedCareer.career_id}`} quote={selectedCareer.career_name}>
                    <FacebookIcon size={32} round />
                  </FacebookShareButton>
                  <LinkedinShareButton url={`${window.location.origin}/career/${selectedCareer.career_id}`} title={selectedCareer.career_name} summary={selectedCareer.description}>
                    <LinkedinIcon size={32} round />
                  </LinkedinShareButton>
                  <EmailShareButton url={`${window.location.origin}/career/${selectedCareer.career_id}`} subject={selectedCareer.career_name} body={selectedCareer.description}>
                    <EmailIcon size={32} round />
                  </EmailShareButton>
                </Box>
              </Box>
            )}
          </Popover>

          <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
            <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Container>
      </div>
    </ThemeProvider>
  );
};

export default CareerList;
