import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  TextField,
  IconButton,
  Snackbar,
  Alert,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Tooltip,
  CircularProgress,
  Popover,
  Icon,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ShareIcon from '@mui/icons-material/Share';
import { useNavigate } from 'react-router-dom';
import api from '../Api/Api';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import getLPTheme from './landing-page/getLPTheme';
import { EmailIcon, EmailShareButton, FacebookIcon, FacebookShareButton, LinkedinIcon, LinkedinShareButton, WhatsappIcon, WhatsappShareButton } from "react-share";
import { CopyAll, CopyAllOutlined } from '@mui/icons-material';

const AssessmentsList = ({ token, mode }) => {
  const [assessments, setAssessments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();
  const [showCustomTheme, setShowCustomTheme] = useState(true);
  const LPtheme = createTheme(getLPTheme(mode));
  const defaultTheme = createTheme({ palette: { mode } });
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('normal');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      const response = await api.get('/assessments/get-all-assessments');
      setAssessments(response.data);
    } catch (error) {
      console.error('Error fetching assessments:', error);
      setSnackbar({ open: true, message: 'Failed to fetch assessments, please check your network connection', severity: 'error' });
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredAssessments = assessments.filter((assessment) =>
    assessment.assessment_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assessment.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetails = (assessmentId) => {
    navigate(`${assessmentId}`);
  };

  const handleShareClick = (event, assessment) => {
    setAnchorEl(event.currentTarget);
    setSelectedAssessment(assessment);
  };

  const handleCloseMenuItem = () => {
    setAnchorEl(null);
    setSelectedAssessment(null);
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
}



  if (!filteredAssessments) {
    return (
      <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <ThemeProvider theme={showCustomTheme ? LPtheme : defaultTheme}>
      <div className={`${mode === "light" ? "light-container" : "dark-container"}`} id="assessment-listing-page-container">
        <Container style={{ paddingTop: "100px" }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, my: 4 }}>
            <TextField
              size="small"
              label="Search Assessments"
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

          <Grid container spacing={3}>
            {Array.isArray(filteredAssessments) && filteredAssessments.map((assessment) => (
              <Grid  item xs={12} sm={6} md={4} key={assessment.assessment_id}>
                <Card  style={{minHeight:"100%"}} sx={{
                  boxShadow: 0,
                  position: "relative",
                  '&:hover': {
                    boxShadow: 1,
                    transform: 'translateY(-4px)',
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out'
                  }
                }}>
                  <CardContent  onClick={() => handleViewDetails(assessment.assessment_id)} sx={{ cursor: 'pointer', padding: '24px', paddingBottom: "12px" }}>
                    <Typography style={{
                      color: mode === 'dark' ? '#E0E0E0' : '#212121'
                    }} variant="h5" component="div" sx={{ fontWeight: 'bold', marginBottom: '12px', fontSize: "22px" }}>
                      {assessment.assessment_type}
                    </Typography>

                    <Tooltip title={assessment.description} placement="bottom">
                      <Typography variant="body1" color="text.secondary" sx={{ marginBottom: '8px', minHeight: '130px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {assessment.description}
                      </Typography>
                    </Tooltip>
                  </CardContent>
                  <CardActions sx={{ position: 'absolute', top: "10px", right: '0px', justifyContent: 'space-between', padding: '16px', pt: '0px' }}>
                    <IconButton onClick={(event) => handleShareClick(event, assessment)}>
                      <ShareIcon style={{ fontSize: '18px' }} />
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
            {selectedAssessment && (
              <Box sx={{ p: 2 }}>
                <Typography variant="h6" fontSize={16} mb={2} gutterBottom>
                  Share this Assessment
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-around', gap:"20px" }}>

                <CopyAllOutlined style={{width:"32px"}} onClick={() => handleCopy(`${baseURL}/assessments/${selectedAssessment.assessment_id}`)}>
                    <Icon size={32} round={true}>
                      <CopyAll />
                    </Icon>
                  </CopyAllOutlined>


                  <WhatsappShareButton url={`${window.location.origin}/assessments/${selectedAssessment.assessment_id}`} title={selectedAssessment.assessment_name}>
                    <WhatsappIcon size={32} round />
                  </WhatsappShareButton>
                  <FacebookShareButton url={`${window.location.origin}/assessments/${selectedAssessment.assessment_id}`} quote={selectedAssessment.assessment_name}>
                    <FacebookIcon size={32} round />
                  </FacebookShareButton>
                  <LinkedinShareButton url={`${window.location.origin}/assessments/${selectedAssessment.assessment_id}`} title={selectedAssessment.assessment_name} summary={selectedAssessment.description}>
                    <LinkedinIcon size={32} round />
                  </LinkedinShareButton>
                  <EmailShareButton url={`${window.location.origin}/assessments/${selectedAssessment.assessment_id}`} subject={selectedAssessment.assessment_name} body={selectedAssessment.description}>
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

export default AssessmentsList;
