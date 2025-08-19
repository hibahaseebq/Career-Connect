import JobManagementHeader from './JobManagementHeader'
import React, { useState, startTransition,useEffect } from "react";
import { Typography, List, ListItem, ListItemText, Paper, Button, Container, Grid, Dialog, DialogTitle, DialogContent, DialogActions, Divider, CardContent, Card, MenuItem, Icon, IconButton, Popover, TextField, FormControlLabel, Checkbox, Autocomplete, FormControl, Snackbar, Alert } from '@mui/material';
import { Edit, Delete, Favorite, LocationOn, Business, CopyAllOutlined, CopyAll, Share, MoreVert, ViewAgendaSharp, Visibility, AnalyticsOutlined } from '@mui/icons-material';
import '../../styles/UserPostedJobs.css'; // Import external CSS file
import { createTheme, ThemeProvider } from '@mui/material/styles';
import getLPTheme from '../../landing-page/getLPTheme';
import api from '../../../Api/Api';
import { Link, useParams } from 'react-router-dom';
import { WhatsappShareButton } from 'react-share';
import ReactQuill from "react-quill";
import '../../../Pages/styles/JobListingPage.css';

const JobList = ({ mode }) => {
    const [showCustomTheme, setShowCustomTheme] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const LPtheme = createTheme(getLPTheme(mode));
    const defaultTheme = createTheme({ palette: { mode } });
    const [JobsFound, setJobsFound] = useState(false);
const [allUserJobsPosts, setAllUserJobsPosts] = useState([])
const [showSelectedJob, setShowSelectedJob] = useState(false);
const [anchorEl, setAnchorEl] = useState({ anchor: null, jobId: null });
  const [formErrors, setFormErrors] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('');
    

  const [token, setToken] = useState(sessionStorage.getItem('token')); 
const {userId} =useParams();
    
const truncateText = (text, maxLength) => {
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};
useEffect(() => {
    const storedToken = sessionStorage.getItem('token');
    setToken(storedToken); 
  }, []);


  useEffect(() => {
    const fetchAllJobsOfUser = async () => {
      try {
        const response = await api.get(`/admin/get/allJob/accepted`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (!response.status===200) {
          throw new Error("Failed to fetch job listings");
        }
       
        setAllUserJobsPosts(response?.data?.jobs);
      } catch (error) {
        console.error("Error fetching job listings:", error);
        if (error.response.status===404){
          setJobsFound(true)
  
          }
      }
    };

    fetchAllJobsOfUser();
  }, []);




 

  const handleDelete = async (jobId) => {
    try {
      await api.delete(`/jobs/delete/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSnackbarSeverity('success');
      setSnackbarMessage('Job post delete successfully!');
      setSnackbarOpen(true);
      setAllUserJobsPosts(allUserJobsPosts.filter(job => job.id !== jobId));
    } catch (error) {
      console.error("Error deleting job:", error);
      setSnackbarSeverity('error');
      setSnackbarMessage('Error deleting job. Please try again.');
      setSnackbarOpen(true);
    }
  };




  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
    };
    
 
      useEffect(() => {
        if (selectedJob) {
          setShowSelectedJob(true);
        } else {
          setShowSelectedJob(false);
        }
      }, [selectedJob]);
    
    
      const handleJobClick = (job) => {
        startTransition(() => {
          setSelectedJob(job);
          setShowSelectedJob(true); 
        });
      };

      
     


      const handleJobAction = async (jobId, action) => {
        try {
          const response = await api.post(
            `/admin/action-on-job/${jobId}`,
            { action },
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );
      
          if (response.status === 200) {
            setSnackbarSeverity('success');
            setSnackbarMessage(`Job ${action}d successfully!`);
            setSnackbarOpen(true);
            setAllUserJobsPosts(allUserJobsPosts.filter(job => job.id !== jobId));
          } else {
            throw new Error(`Failed to ${action} job`);
          }
        } catch (error) {
          console.error(`Error ${action} job:`, error);
          setSnackbarSeverity('error');
          setSnackbarMessage(`Error ${action} job. Please try again.`);
          setSnackbarOpen(true);
        }
      };
    
    return (
      <>
      <JobManagementHeader/>
        <ThemeProvider theme={showCustomTheme ? LPtheme : defaultTheme}>
            <div style={{height:"500px"}} className={`${mode === "light" ? "light-container" : "dark-container"}`} id="job-listing-page-container">
                <Container id={'padding-removed'} style={{ paddingTop: "32px", paddingBottom:"50px", height:"500px" }}>
                    <Grid style={{height:"500px"}} >
                    

                        {/* small job cards container  */}
                        <Grid style={{display:"flex", flexDirection:"row", height:"500px" }} container md={12} lg={12} margin={0} gap={2} marginTop={0}>
                        {JobsFound? (
                        <Typography ml={"auto"} mr={"auto"} mt={5} variant="body1" color="textSecondary">No jobs found</Typography>
                        ) : (allUserJobsPosts.map((job) => (
                            <Grid
                            style={{ position: "relative", height:"500px"}}
                            item
                            xs={12}
                            md={5.9}
                            key={job.id}
                            >
                            
                            <Card style={{minHeight:"500px"}} id="job-card-fix-height"
                                className={`job-card ${mode === "light" ? "light-m-border-prime-color" : "dark-m-border-prime-color"}`} onClick={() => handleJobClick(job)}>
                                <CardContent id="job-card-fix-height-content" style={{ paddingBottom: "10px", minHeight:"500px" }}>
                                

                               


                                    
                                    <div className="heading6-jobCard hiring-multiple-canditate tapItem-gutter metadataContainer css-z5ecg7 eu4oa1w0">
                                    {job.hiringMultipleCandidate &&
                                            <div
                                            style={{minWidth:"max-content"}}
                                              data-testid="attribute_snippet_testid"
                                              className={`css-1cvvo1b eu4oa1w0 `}
                                            >
                                              Hiring multiple candidates
                                            </div>}


                                            <Grid container spacing={1}>
      <Grid style={{marginLeft:"auto"}} item>
        <Button
          size="small"
          variant="contained"
          color="primary"
          onClick={() => handleJobAction(job.id, 'reject')}
        >
          Unpublish
        </Button>
      </Grid>
     
      <Grid item>
        <Button
          size="small"
          variant="outlined"
          color='error'
          onClick={() => handleDelete(job.id)}
        >
          Delete
        </Button>
      </Grid>
    </Grid>

                                        </div>
                                

                              

                      <Typography className={`${mode === 'light' ? 'light-m-text-prime-color' : 'dark-m-text-prime-color'}`} style={{ fontSize: '1.25rem', lineHeight: '1.5rem', margin: '0 0 0.5rem 0', color: '#2d2d2d', letterSpacing: '-0.06px' }} fontWeight={"bold"} variant="h6" gutterBottom>
                            <Link
                              to={`/job-details/${job.id}`}
                              style={{
                                textDecoration: "none",
                                color: mode === "light" ? "black" : "white",
                                padding: "0.1rem",
                                transition: "border-color 0.3s ease",
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.borderBottom = "1px solid gray";
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.borderBottom = "none"; 
                              }}
                            >
                              {job.title}
                            </Link>
                        </Typography>


                                <Typography  marginTop={2} display={"flex"} alignItems={"center"} gap={1} variant="subtitle1" color="textSecondary">
                                    <Business fontSize="small" /> {job.companyId}
                                </Typography>
                                <Typography marginTop={0.5} display={"flex"} alignItems={"center"} gap={1} variant="subtitle2" color="textSecondary">
                                    <LocationOn fontSize="small" /> {job.jobLocation}
                                </Typography>

                                <div className="job-cards-badges" style={{ marginTop: "1rem" }}>
                                    <div className="heading6-jobCard tapItem-gutter metadataContainer css-z5ecg7 eu4oa1w0">
                                    <div className="metadata salary-snippet-container css-5zy3wz eu4oa1w0">
                          <div
                          data-testid="attribute_snippet_testid"
                          className={`css-1cvvo1b eu4oa1w0 ${job.salaryMax>=70000 ? 'good-salary' : 'bad-salary'}`}
                        >
                           Rs. {job.salaryMin} - Rs. {job.salaryMax} a month
                          {job.salaryMax>=70000 ? (
                              <span style={{ display:"flex", alignItems:"center", justifyContent:"center", marginLeft:"4px"}}  className="css-130a5xa eu4oa1w0"><Favorite fontSize="14px"/></span>
                          ) : null}
                        </div>
                                    </div>
                                    <div className="metadata css-5zy3wz eu4oa1w0">
                                        <div
                                        data-testid="attribute_snippet_testid"
                                        className="css-1cvvo1b eu4oa1w0"
                                        >
                                        {job.jobType}
                                        </div>
                                    </div>
                                    </div>
                                </div>

                                <Divider/>
                                {/* <Typography
                                title={job.description} 
                                id="job-car-desc"
                                className="parent-container-des"
                                variant="body2"
                                style={{ marginTop: "0.8rem", letterSpacing: "0.5px", wordSpacing: "1px" }}
                                dangerouslySetInnerHTML={{
                                  __html: truncateText(job.description, 100)
                                }}
                              /> */}

                      <div style={{overflowY:"scroll", height:"270px"}}>
                      <Typography className={`${mode === 'light' ? 'light-m-text-prime-color' : 'dark-m-text-prime-color'}`} style={{ marginTop: "1.5rem" }} variant="h2" fontSize='20px' fontWeight="bolder" color="black">
                      Job Details
                      </Typography>

                      <Typography
                      variant="body2" className="parent-container-des"
                      style={{ marginTop: "0.8rem", letterSpacing: "0.5px", wordSpacing: "1px" }}
                      dangerouslySetInnerHTML={{ __html: job.description }}
                    />
                        
                        </div>
                                {/* Additional job details can be displayed here */}
                                </CardContent>
                                
                            </Card>
                            </Grid>
                        )))}
                     </Grid>
                  </Grid>
                </Container>


               
            </div>
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
          </Snackbar>
        </ThemeProvider>
        </>
    );
};

export default JobList;
