import React, {useEffect, useState} from 'react'
import AppAppBar from './landing-page/components/AppAppBar'
import Footer from './landing-page/components/Footer'
import { Box, Button, Card, CardActions, CardContent, Container, Divider, Grid, Icon, IconButton, MenuItem, Popover, Typography } from '@mui/material'
import './styles/JobListingPage.css'
import { Business, CopyAll, CopyAllOutlined, Favorite, LocationOn, Share } from '@mui/icons-material'
import api from '../Api/Api'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import getLPTheme from './landing-page/getLPTheme';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  LinkedinShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";



const JobDetails = ({mode}) => {

const  jobId  = useParams();

const [showCustomTheme, setShowCustomTheme] = React.useState(true);
const LPtheme = createTheme(getLPTheme(mode));
  const [selectedJob, setSelectedJob] = useState(null);
  const defaultTheme = createTheme({ palette: { mode } });
  const [showSelectedJob, setShowSelectedJob] = useState(false); 
  const [anchorEl, setAnchorEl] = useState(null);
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await api.get(`/jobs/get/byId/${jobId.jobId}`);
        setSelectedJob(response.data.job);
        setShowSelectedJob(true);
      } catch (error) {
        console.error('Error fetching job details:', error);
      }
    };

    fetchJobDetails();
  }, []);


  const handleAnimationEnd = () => {
    // Animation end logic
  };

  const handleClickMenuItem = (event, jobId) => {
    setAnchorEl(event.currentTarget);
    // Handle click on menu item logic
  };

  const handleCloseMenuItem = () => {
    setAnchorEl(null);
    // Handle close menu item logic
  };

  // useEffect(() => {
  //   setSelectedJob({
  //     title: 'Facebook Engineer',
  //     company: 'Google',
  //     location: 'Mountain View, CA',
  //     description: "Mountain View, CA VSoftware EngineerSoftware EngineerSoftware Engineerntain View, CAMountain View, CAaaaaa",
  //     date: '1 day ago',
  //     logo: 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png',
  //   });
  //   setShowSelectedJob(true);
  // }, []);

  const baseURL = api.defaults.FrontendBaseURL;


  
const handleCopy = (url) => {
  navigator.clipboard.writeText(url).then(() => {
    window.alert('Link copied to clipboard!');
  },
    (err) => {
    console.error('Failed to copy link:', err);
  });
};

  return (
<ThemeProvider  theme={showCustomTheme ? LPtheme : defaultTheme}>
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: { xs: 4, sm: 8 },
        py: { xs: 8, sm: 10 },
        textAlign: { sm: 'left', md: 'left' },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          width: '100%',
          justifyContent: 'space-between',
        }}
      >

        <Container className={`${mode === 'light' ? 'light-m-bg-prime-color' : 'dark-m-bg-prime-color'}`} style={{ padding:"70px 0px 40px 0px" }}>
          
          <Grid item key={selectedJob?.id}
          
            style={{ display: 'flex', justifyContent: 'center', margin: '0px auto', background: "white", width: "100%", minWidth: "100%" }} lg={12}
           
            className={`selected-job-container 
            ${showSelectedJob ? "selected-job-active" : ""}, ${mode==="light"? "light-m-bg-prime-color":"dark-m-bg-prime-color border-radius-dark"}`} margin={0} container md={6} spacing={3} marginTop={0}>
        
            {selectedJob && (
          <Grid
            item
              style={{ position: "relative", padding:"0px",}}
              xs={12}
              md={12}
                key={selectedJob.id}
                id='job-details-container'
            >
              

              <Card style={{border:`${mode==="light"? "1px solid #d4d2d0":"2px solid #d4d2d0"}`}} className="job-card job-card-job-details" >
                <CardContent className={`${mode==="light"? "light-m-bg-prime-color":"dark-m-bg-prime-color border-radius-dark"}`} style={{ paddingBottom: "10px", boxSizing:"border-box" }}>
                  

               {selectedJob.hiringMultipleCandidate && <div className="heading6-jobCard hiring-multiple-canditate tapItem-gutter metadataContainer css-z5ecg7 eu4oa1w0">
                        <div
                          data-testid="attribute_snippet_testid"
                          className={`css-1cvvo1b eu4oa1w0 `}
                        >
                          Hiring multiple candidates
                          
                        </div>
                      
                </div>}
                  
              <Grid display={'flex'} justifyContent={'space-between'} alignContent={'center'}>
                  <Typography style={{ fontSize: '1.85rem', margin: '0 0 0.5rem 0', color: '#2d2d2d', letterSpacing: '-0.06px', textAlign: "left", lineHeight:"2.3rem", paddingRight:"40px" }} fontWeight={"bold"} variant="h6" gutterBottom>

                  <Link style={{ textDecoration:"none", color:"blue",  }} className={`${mode === 'light' ? 'light-m-text-prime-color' : 'dark-m-text-prime-color'}`}>
                   {selectedJob.title}
                  </Link>
                  </Typography>
                  
                 
              </Grid>
                  <Typography  className={`${mode === 'light' ? 'light-m-text-prime-color' : 'dark-m-text-prime-color'}`} marginTop={2} display={"flex"} alignItems={"center"} gap={1} variant="subtitle1" color="textSecondary">
                    <Business fontSize="small" /> {selectedJob.companyId}
                  </Typography>
                  <Typography  className={`${mode === 'light' ? 'light-m-text-prime-color' : 'dark-m-text-prime-color'}`} marginTop={0.5} display={"flex"} alignItems={"center"} gap={1} variant="subtitle2" color="textSecondary">
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
                      
                      <Divider style={{ marginTop: "16px" }} />
                      
                      <Typography  className={`${mode === 'light' ? 'light-m-text-prime-color' : 'dark-m-text-prime-color'}`} style={{ marginTop: "1.5rem" }} variant="h2" fontSize='20px' fontWeight="bolder" color="black">
                      Job Details
                      </Typography>

                      {/* <Typography    variant="body2" style={{ marginTop: "0.8rem", letterSpacing:"0.5px", wordSpacing:"1px" }}>
                    {selectedJob?.description}
                  </Typography> */}

                  <Typography
                      variant="body2"
                      className={ `parent-container-des ${mode === 'light' ? 'light-m-text-prime-color' : 'dark-m-text-prime-color'}`}
                      style={{ marginTop: "0.8rem", letterSpacing: "0.5px", wordSpacing: "1px" }}
                      dangerouslySetInnerHTML={{ __html: selectedJob?.description }}/>

                  {/* Additional job details can be displayed here */}
                </CardContent>
                
                
              <Box style={{position:"absolute", top:"16px", right:"16px"}} className='options-buttons-job-details-cont'>
                    <IconButton
                       className={`options-buttons-job-details ${mode === 'light' ? 'light-m-text-prime-color' : 'dark-m-text-prime-color'}`}
                aria-label="options"
                onClick={(event) => handleClickMenuItem(event, selectedJob.id)}
              >
                <Share/>
              </IconButton>
              {/* <IconButton
              aria-label="options"
              onClick={(event) => handleClickMenuItem(event, selectedJob.id)}
              className="options-button"
            >
              <Share />
            </IconButton> */}
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
                  </Box>
                </Card>
                  
            </Grid>
            )}
          </Grid>

          <Divider style={{ marginTop: "160px" }} />
          <Footer/>
      </Container>
    </Box>
    </Container>

    </ThemeProvider>
  )
}

export default JobDetails