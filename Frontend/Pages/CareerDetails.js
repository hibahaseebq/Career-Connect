import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Container, Box, Typography, Snackbar, Alert, List, ListItem, ListItemText, IconButton, CircularProgress, Card, CardContent, Button, CardActions, Grid, } from '@mui/material';
import api from '../Api/Api';
import '../Pages/AdminPages/Dashboard/Dashboard.css';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import getLPTheme from './landing-page/getLPTheme';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './styles/JobListingPage.css';
const CareerDetails = ({ token, mode }) => {
  const { career_id } = useParams();
  const [showCustomTheme, setShowCustomTheme] = useState(true);
  const LPtheme = createTheme(getLPTheme(mode));
  const defaultTheme = createTheme({ palette: { mode } });
  const [career, setCareer] = useState(null);
  const [resources, setResources] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchCareerDetails();
    fetchResources();
  }, [career_id]);

  const fetchCareerDetails = async () => {
    try {
      const response = await api.get(`/careers/${career_id}`);
      setCareer(response.data);
    } catch (error) {
      console.error('Error fetching career details:', error);
    }
  };

  const fetchResources = async () => {
    try {
      const response = await api.get(`/careers/${career_id}/resources`);
      console.log("🚀 ~ fetchResources ~ response:", response)
      setResources(response.data);
    } catch (error) {
      console.error('Error fetching resources:', error);
    }
  };


  const handleCopyLink = (link) => {
    navigator.clipboard.writeText(link);
    setSnackbar({ open: true, message: 'Resource link copied to clipboard', severity: 'success' });
  };
  

  if (!career) {
    return (<Container style={{  display: 'flex', justifyContent: 'center', alignItems:"center", minHeight:"100vh"}}>
    <CircularProgress />
  </Container>
);
  }

  return ( 
  <ThemeProvider theme={showCustomTheme ? LPtheme : defaultTheme}>
    <div className={`${mode === "light" ? "light-container" : "dark-container"}`} id="job-listing-page-container">
      <Container style={{ paddingTop: "100px" }}>
      <Box sx={{ my: 4 }}>
      <Typography variant="h5" component="div" sx={{fontWeight: 'bold', marginBottom: '12px', fontSize:"26px"}} style={{
    color: mode === 'dark' ? '#E0E0E0' : '#212121'
  }}>
        {career.career_name}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {career.description}
        </Typography>
        <Typography mt={2} variant="body2" color="text.secondary">
          {career.required_skills}
        </Typography>
        
          <Grid container spacing={3} sx={{ mt: 3 }}>
            {resources.map((resource, index) => (
              <Grid item xs={12} sm={6} key={index}>
              <Card key={index} sx={{ minWidth: 275, boxShadow: 0, borderRadius: 2, position:"relative", 
                '&:hover': { 
                  boxShadow: 1, 
                  transform: 'translateY(-4px)',
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out'}
               }}>
                <CardContent>
                <Box sx={{ flex: '1 1 auto', minWidth: 0 }}>
                  <Typography 
                    sx={{
                      fontWeight: 'bold', 
                      marginBottom: '12px', 
                      fontSize: '18px', 
                      overflow: 'hidden', 
                    }} 
                    style={{ color: mode === 'dark' ? '#BDBDBD' : '#424242' }} 
                    variant="h6" 
                    component="div" 
                    title={resource.resource_name} 
                  >
                    {resource.resource_name}
                  </Typography>
                </Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {resource.description}
                  </Typography>
                  <Typography variant="body2" color="primary" component={Link} href={resource.resource_link} target="_blank" rel="noopener">
                    {resource.resource_link}
                  </Typography>
                </CardContent>
                <CardActions  style={{position:"absolute", top:"0px", right:'0px'}}>
                  <IconButton style={{fontSize:'16px'}} onClick={() => handleCopyLink(resource.resource_link)}>
                  <ContentCopyIcon style={{fontSize:'18px', color:"#0959AA"}} />
                  </IconButton>
                </CardActions>
              </Card>
              </Grid>
            ))}
          </Grid>
      </Box>
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

export default CareerDetails;
