import React, { useState, startTransition,useEffect } from "react";
import { AppBar, Toolbar, Typography, Container, Grid, TextField, Button, Card, CardContent, CardActions, Collapse, FormControl, InputLabel, Select, MenuItem, IconButton, Popover, Divider, Box, Icon, Snackbar, Alert,
} from "@mui/material";
import PropTypes from "prop-types";
import { LocationOn, Business, Description, MoreVert, Badge, ArrowRight, FavoriteSharp, Favorite, FavoriteBorderOutlined, BoltRounded, Share, CopyAll, CopyAllOutlined, SetMeal,
} from "@mui/icons-material";
import Footer from './landing-page/components/Footer'
import "./styles/JobListingPage.css";
import getLPTheme from './landing-page/getLPTheme';
import { EmailIcon, EmailShareButton, FacebookIcon, FacebookShareButton, LinkedinShareButton, WhatsappIcon, WhatsappShareButton,
} from "react-share";
import api from '../Api/Api';
import {Link} from 'react-router-dom'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { light } from "@mui/material/styles/createPalette";


const JobListingPage = ({mode}) => {


  const [selectedJob, setSelectedJob] = useState(""); // Initialize as ""
  const [anchorEl, setAnchorEl] = useState("");
  const [showSelectedJob, setShowSelectedJob] = useState(false);
  const [showCustomTheme, setShowCustomTheme] = React.useState(true);
  const LPtheme = createTheme(getLPTheme(mode));
  const defaultTheme = createTheme({ palette: { mode } });
  const [jobListing, setJobListing] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [JobsFound, setJobsFound] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('normal');
  const [searchQuery, setSearchQuery] = useState("");
  const [keywords, setKeywords] = useState("");
  const [datePosted, setDatePosted] = useState('');
  const [Companies, setCompany] = useState('');
  const [salary, setSalary] = useState('');
  const [Types, setJobType] = useState('');
  const [Languages, setLanguages] = useState('');
  const [Locations, setLocations] = useState('');
  const [selectedSalaryOption, setSelectedSalaryOption] = useState('');

  const [filterOptions, setFilterOptions] = useState({
    Locations: [],
    Companies: [],
    Types: [],
    Languages: []
  });


  const handleJobClick = (job) => {
    startTransition(() => {
      setSelectedJob(job);
      setShowSelectedJob(true); 
    });
  };

  const handleClickMenuItem = (event, jobId) => {
    event.stopPropagation(); // Prevent click event from bubbling up
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenuItem = () => {
    setAnchorEl(null);
  };
  const handleAnimationEnd = () => {
    if (!selectedJob) {
      setShowSelectedJob(false);
    }
  };
  useEffect(() => {
    if (selectedJob) {
      setShowSelectedJob(true);
    } else {
      setShowSelectedJob(false);
    }
  }, [selectedJob]);


  
  useEffect(() => {
    // Function to fetch all available jobs
    const fetchAllJobs = async () => {
      try {
        const response = await api.get("/jobs/get/allJob");
        if (!response?.status===200) {
          throw new Error("Failed to fetch job listings");
        }
       
        setJobListing(response?.data?.jobs);
      } catch (error) {
        console.error("Error fetching job listings:", error);
        if (error?.response?.status===404){
          setJobsFound(true)
  
          }
      }
    };

    fetchAllJobs();
  }, []);

  useEffect(() => {
    fetchOptions();
  }, [searchQuery, keywords, Locations,  Companies, salary, Types, Languages]);

  const fetchOptions = async () => {
    try {
      const response = await api.get('/jobs/options', {
        params: { searchQuery,keywords, Locations,  Companies, salary, Types, Languages }
      });
      setFilterOptions(response.data);
    } catch (error) {
      console.error('Error fetching options:', error);
    }
  };

  const handleSearch = async () => {
    try {
      const queryParams = new URLSearchParams({
        searchQuery,
        keywords,
        Locations,
        datePosted,
        Companies,
        Types,
        Languages,
        selectedSalaryOption
      });
  
  
      const response = await api.get(`/jobs/get/allJob?${queryParams}`);
  
      if (response.status !== 200) {
        throw new Error('Failed to fetch job listings');
      }
  
      const jobs = response.data.jobs;
      setJobListing(jobs);
      setJobsFound(false)

    } catch (error) {
      console.error('Error fetching job listings:', error);
      if(error?.response?.status===404){
      setJobsFound(true)
      setJobListing([])
      }
    }
  };
  

const baseURL = api.defaults.FrontendBaseURL;

const handleSnackbarClose = (event, reason) => {
  if (reason === 'clickaway') {
    return;
  }
  setSnackbarOpen(false);
  };
  
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


// data and salaries 


const DateOptions = [
  { label: 'Today', value: 'today' },
  { label: 'Last 7 Days', value: 'last7days' },
  { label: 'Last Month', value: 'lastMonth' },
  { label: 'Last year', value: 'lastYear' },
];

const handleDateChange = (e) => {
  setDatePosted(e.target.value);
};


const SalaryOptions = [
  { label: 'Any', value: 'any' },
  { label: 'Less than $50k', value: 'lt50k' },
  { label: '$50k - $100k', value: '50k-100k' },
  { label: '$100k - $150k', value: '100k-150k' },
  { label: '$150k - $200k', value: '150k-200k' },
  { label: 'More than $200k', value: 'gt200k' },
];  
const handleSalaryChange = (e) => {
  const value = e.target.value;
  setSelectedSalaryOption(value);

  switch (value) {
    case 'any':
      break;
    case 'lt50k':
      break;
    default:
      break;
  }
};



const truncateText = (text, maxLength) => {
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};



  return (
    <ThemeProvider  theme={showCustomTheme ? LPtheme : defaultTheme}>
    <div className={`${mode==="light"? "light-container": "dark-container"}`}  id="job-listing-page-container">
      {/* animation */}
      <div className="wrapper-anima">
        <div className="box-anima">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          
        </div>
      </div>
      {/* navbar */}
     
      <Container style={{ paddingTop: "160px" }}>
        <Grid
          id="form-inputs-container"
          container
          spacing={3}
          justifyContent="center"
        >
          <Grid item xs={12} md={6}>
              <TextField
              id="job-title"
              label="Job Title"
              variant="outlined"
                fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Grid>

          <Grid item xs={12} md={6}>
              <TextField
              id="keyword"
              label="Keyword"
              variant="outlined"
              fullWidth
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
            />
          </Grid>

        




      <Grid item xs={12} md={2}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Date Posted</InputLabel>
              <Select
                value={datePosted}
                onChange={handleDateChange}
                label="Date Posted"
              >
                {DateOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>








{['Companies', 'Locations', 'Types', 'Languages'].map((field, index) => (
              <Grid key={index} item xs={12} md={2}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>{field}</InputLabel>
                  <Select
                    value={
                      {
                        'Company': Companies,
                        'Location': Locations,
                        'Job Type': Types,
                        'Job Language': Languages,
                      }[field]
                    }
                    onChange={(e) => {
                      const setter = {
                        'Companies': setCompany,
                        'salaries': setSalary,
                        'Types': setJobType,
                        'Languages': setLanguages,
                        'Locations': setLocations
                      }[field];
                      setter(e.target.value);
                    }}
                    label={field}
                  >
                    {filterOptions[field]?.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            ))}




<Grid item xs={12} md={2}>
<FormControl fullWidth variant="outlined">
          <InputLabel>Salary Range</InputLabel>
          <Select
            value={selectedSalaryOption}
            onChange={handleSalaryChange}
            label="Salary Range"
          >
            {SalaryOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
          </Grid>






          <Grid style={{ marginLeft: "auto" }} item>
            <Button
              size="large"
              variant="contained"
              color="primary"
              onClick={handleSearch}
            >
              Search
            </Button>
          </Grid>
        </Grid>
        <hr className="custom-border" />

        <Grid
          id="job-list-container"
          container
          spacing={3}
          marginTop={3}
          justifyContent="center"
        >
          <Grid item xs={12} md={12} marginTop={3}>
            <Grid container style={{ paddingRight: "12px" }} md={6} margin={0}>
              <Button variant="outlined" color="primary">
                Most Recent
              </Button>
              <Button
                variant="outlined"
                style={{ marginLeft: "15px" }}
                color="primary"
              >
                Most Popular
              </Button>
              <Grid
                style={{
                  marginLeft: "auto",
                  alignItems: "center",
                  display: "flex",
                }}
                display={"inline"}
              >
                <Typography className={`${mode === 'light' ? 'light-m-text-prime-color' : 'dark-m-text-prime-color'}`} display={"inline"} variant="body2">
                  {" "}
                  {jobListing?.length} - jobs{" "}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid container md={6} margin={0} spacing={3} marginTop={0}>

            
          {JobsFound? (
          <Typography ml={"auto"} mr={"auto"} mt={5} variant="body1" color="textSecondary">No jobs found</Typography>
          ) : (jobListing?.map((job) => (
              <Grid
                style={{ position: "relative"}}
                item
                xs={12}
                md={12}
                key={job.id}
                
              >
                <IconButton
                  aria-label="options"
                  onClick={(event) => handleClickMenuItem(event, job.id)}
                  className="options-button"
                >
                  <MoreVert />
                </IconButton>
                <Popover
                  // open={Boolean(anchorEl)}
                  // anchorEl={anchorEl}
                  onClose={handleCloseMenuItem}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                >
                  <MenuItem onClick={handleCloseMenuItem}>Save Job</MenuItem>
                  <MenuItem onClick={handleCloseMenuItem}>
                    Not Interested
                  </MenuItem>
                </Popover>

                <Card
                  className={`job-card ${mode === "light" ? "light-m-border-prime-color" : "dark-m-border-prime-color"}`} onClick={() => handleJobClick(job)}>
                  <CardContent style={{ paddingBottom: "10px" }}>
                    
                  {job.hiringMultipleCandidate &&
                  <div className="heading6-jobCard hiring-multiple-canditate tapItem-gutter metadataContainer css-z5ecg7 eu4oa1w0">
                          <div
                            data-testid="attribute_snippet_testid"
                            className={`css-1cvvo1b eu4oa1w0 `}
                          >
                            Hiring multiple candidates
                            
                          </div>
                        
                      </div>}
                    

                    {/* <Typography  className={`${mode === 'light' ? 'light-m-text-prime-color' : 'dark-m-text-prime-color'}`} style={{ fontSize: '1.25rem', lineHeight: '1.5rem', margin: '0 0 0.5rem 0', color: '#2d2d2d', letterSpacing: '-0.06px' }} fontWeight={"bold"} variant="h6" gutterBottom>
                      {job.title}
                    </Typography> */}

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

                    <Typography  style={{ marginTop: "1.5rem" }} display={"flex"} alignItems={"center"} gap={1} variant="subtitle2" color="textSecondary">
                    <span className="css-wftrf9 eu4oa1w0"><span className="iaIcon css-pu2c8l eu4oa1w0"><svg xmlns="http://www.w3.org/2000/svg" focusable="false" role="img" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true" className="css-1tvjh98 eac13zx0"><path d="M2.344 4.018a.25.25 0 00-.33.31l1.897 5.895a.5.5 0 00.371.335l7.72 1.44-7.72 1.44a.5.5 0 00-.371.335l-1.898 5.896a.25.25 0 00.33.31l19.494-7.749a.25.25 0 000-.464L2.344 4.018z"></path></svg></span><span className={`${mode === 'light' ? 'light-m-text-prime-color' : 'dark-m-text-prime-color'}`} data-testid="indeedApply">Easily apply</span></span>
                    </Typography>


                    <Typography className="parent-container-des" variant="body2" title={job.description} style={{ marginTop: "0.8rem", letterSpacing:"0.5px", wordSpacing:"1px", maxHeight:"50px", textOverflow:"ellipsis", overflow:"hidden" }}
                    dangerouslySetInnerHTML={{ __html: truncateText(job.description, 150) }}/>
                    

                    

                    {/* Additional job details can be displayed here */}
                  </CardContent>
                  <CardActions style={{marginBottom:"3px"}}>
                    <Button  style={{ marginLeft: "6px" }} size="small" color="primary">
                      Learn More
                    </Button>
                    <IconButton style={{ marginLeft: "auto", }} aria-label="favorite">
                      {false ? <Favorite fontSize="small" /> : <FavoriteBorderOutlined fontSize="small" />}
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            )))}
          </Grid>
          <Grid key={selectedJob?.id}   className={`selected-job-container ${
          showSelectedJob ? "selected-job-active" : ""
        }`} onAnimationEnd={handleAnimationEnd}  margin={0} container md={6} spacing={3} marginTop={0}>
            {selectedJob && (
                <Grid
                id="selected-job-cont" 
              style={{ position: "relative",}}
              item
              xs={12}
              md={12}
              key={selectedJob.id}
                >
                  


              <IconButton
              aria-label="options"
              onClick={(event) => handleClickMenuItem(event, selectedJob.id)}
              className="options-button"
            >
              <Share />
            </IconButton>
            <Popover
              open={Boolean(anchorEl)}
              anchorEl={anchorEl}
              onClose={handleCloseMenuItem}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >

              <Card>
                <CardContent>
                  <MenuItem onClick={handleCloseMenuItem}>
                      <CopyAllOutlined style={{width:"32px"}} onClick={() => handleCopy(`${baseURL}/job-details/${selectedJob.id}`)}>
                    <Icon size={32} round={true}>
                      <CopyAll />
                    </Icon>
                  </CopyAllOutlined>
                  </MenuItem>
                        <MenuItem>
                        <WhatsappShareButton
                        url={`${baseURL}/job-details/${selectedJob.id}`}
                        title={selectedJob.title}
                        className="share-button"
                      >
                        <Icon size={32} round={true}>
                          <WhatsappIcon />
                        </Icon>
                      </WhatsappShareButton>
                  </MenuItem>
                    <MenuItem>
                        <FacebookShareButton
                        url={`${baseURL}/job-details/${selectedJob.id}`}
                        subject={selectedJob.title}
                        body={`Check out this job: ${baseURL}/job-details/${selectedJob.id}`}
                        className="share-button"
                      >
                        <Icon size={32} round={true}>
                          <FacebookIcon/>
                        </Icon>
                      </FacebookShareButton>
                        </MenuItem>
                    <MenuItem>
                        
                  <EmailShareButton
                    url={`${baseURL}/job-details/${selectedJob.id}`}
                    subject={selectedJob.title}
                    body={`Check out this job: ${baseURL}/job-details/${selectedJob.id}`}
                    className="share-button"
                  >
                    <Icon size={32} round={true}>
                      <EmailIcon />
                    </Icon>
                          </EmailShareButton>
                        </MenuItem>
                          
                </CardContent>
              </Card>



              </Popover>

                  <Card   className={`job-card ${mode==="light"? "light-m-border-prime-color":"dark-m-border-prime-color"}`} >
                <CardContent style={{ paddingBottom: "20px" }}>
                  

                {selectedJob.hiringMultipleCandidate &&
                  <div className="heading6-jobCard hiring-multiple-canditate tapItem-gutter metadataContainer css-z5ecg7 eu4oa1w0">
                        <div
                          data-testid="attribute_snippet_testid"
                          className={`css-1cvvo1b eu4oa1w0 `}
                        >
                          Hiring multiple candidates
                          
                        </div>
                      
                    </div>
                    }

                      <Typography className={`${mode === 'light' ? 'light-m-text-prime-color' : 'dark-m-text-prime-color'}`} style={{ fontSize: '1.85rem', lineHeight: '2.5rem', margin: '0 0 0.5rem 0', color: '#2d2d2d', letterSpacing: '-0.06px' }} fontWeight={"bold"} variant="h6" gutterBottom>
                      <Link
                        to={`/job-details/${selectedJob.id}`}
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
                        {selectedJob.title}
                      </Link>
                  </Typography>
                  <Typography  marginTop={2} display={"flex"} alignItems={"center"} gap={1} variant="subtitle1" color="textSecondary">
                    <Business fontSize="small" /> {selectedJob.companyId}
                  </Typography>
                  <Typography marginTop={0.5} display={"flex"} alignItems={"center"} gap={1} variant="subtitle2" color="textSecondary">
                    <LocationOn fontSize="small" /> {selectedJob.jobLocation}
                  </Typography>

                  <div className="job-cards-badges" style={{ marginTop: "1rem" }}>
                    <div className="heading6-jobCard tapItem-gutter metadataContainer css-z5ecg7 eu4oa1w0">
                      <div className="metadata salary-snippet-container css-5zy3wz eu4oa1w0">
                        <div
                          data-testid="attribute_snippet_testid"
                          className={`css-1cvvo1b eu4oa1w0 ${selectedJob.salaryMax>=70000 ? 'good-salary' : 'bad-salary'}`}
                        >
                           Rs. {selectedJob.salaryMin} - Rs. {selectedJob.salaryMax} a month
                          {selectedJob.salaryMax>=70000 ? (
                              <span style={{ display:"flex", alignItems:"center", justifyContent:"center", marginLeft:"4px"}}  className="css-130a5xa eu4oa1w0"><Favorite fontSize="14px"/></span>
                          ) : null}
                        </div>
                      </div>
                      <div className="metadata css-5zy3wz eu4oa1w0">
                        <div
                          data-testid="attribute_snippet_testid"
                          className="css-1cvvo1b eu4oa1w0"
                        >
                          {selectedJob.jobType}
                        </div>
                      </div>
                    </div>
                      </div>
                      <Link to={selectedJob.applicationLink}>
                      <Button variant="contained" color="primary">Apply Now</Button>
                      </Link>
                      
                      {false ? 
                        <Button style={{ marginLeft: "15px" }} variant="contained" color="primary">Saved</Button> 
                        :
                        <Button style={{ marginLeft: "15px" }} variant="outlined" color="primary">Save</Button>  
                      }
                      {/* cheange the height here */}
                      <Divider style={{ marginTop: "16px" }} />
                      <div style={{overflowY:"scroll", height:"34.5vh"}}>
                      <Typography className={`${mode === 'light' ? 'light-m-text-prime-color' : 'dark-m-text-prime-color'}`} style={{ marginTop: "1.5rem" }} variant="h2" fontSize='20px' fontWeight="bolder" color="black">
                      Job Details
                      </Typography>

                      <Typography
                      variant="body2" className="parent-container-des"
                      style={{ marginTop: "0.8rem", letterSpacing: "0.5px", wordSpacing: "1px" }}
                      dangerouslySetInnerHTML={{ __html: selectedJob.description }}
                    />
                        
                        </div>
                  {/* Additional job details can be displayed here */}
                </CardContent>
               
              </Card>
            </Grid>
            )}
          </Grid>
        </Grid>
        </Container>
        <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
        </Snackbar>
        
      <Divider sx={{
        marginTop:"100px"
      }} />
      <Footer/>
      </div>
      
     </ThemeProvider>
  );
  
};


// PropTypes for type checking
JobListingPage.propTypes = {
  jobListings: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      company: PropTypes.string.isRequired,
      location: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default JobListingPage;
