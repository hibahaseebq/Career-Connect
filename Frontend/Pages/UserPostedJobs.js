import React, { useState, startTransition,useEffect } from "react";
import { Typography, List, ListItem, ListItemText, Paper, Button, Container, Grid, Dialog, DialogTitle, DialogContent, DialogActions, Divider, CardContent, Card, MenuItem, Icon, IconButton, Popover, TextField, FormControlLabel, Checkbox, Autocomplete, FormControl, Snackbar, Alert } from '@mui/material';
import { Edit, Delete, Favorite, LocationOn, Business, CopyAllOutlined, CopyAll, Share, MoreVert, ViewAgendaSharp, Visibility, AnalyticsOutlined, BorderRight } from '@mui/icons-material';
import './styles/UserPostedJobs.css'; // Import external CSS file
import { createTheme, ThemeProvider } from '@mui/material/styles';
import getLPTheme from './landing-page/getLPTheme';
import api from '../Api/Api';
import { Link, useParams } from 'react-router-dom';
import { WhatsappShareButton } from 'react-share';
import ReactQuill from "react-quill";
import '../Pages/styles/JobListingPage.css';
import Footer from "./landing-page/components/Footer";
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import isBetween from 'dayjs/plugin/isBetween';
import advancedFormat from 'dayjs/plugin/advancedFormat';


dayjs.extend(weekOfYear);
dayjs.extend(customParseFormat);
dayjs.extend(localizedFormat);
dayjs.extend(isBetween);
dayjs.extend(advancedFormat);



const UserPostedJobs = ({ mode }) => {
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
const [careers, setCareers] = useState([]);
const [jobFormData, setJobFormData] = useState({
  title: '',
  companyId: '',
  salaryMin: '',
  salaryMax: '',
  applicationLink: '',
  skillsRequired: [],
  description: '',
  deadline: new Date(),
  hiringMultipleCandidate: false,
});
const truncateText = (text, maxLength) => {
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};
useEffect(() => {
    const storedToken = sessionStorage.getItem('token');
    setToken(storedToken); 
  }, []);



// for date picker
  const initialValues = {
    startedAt: '',
    endsAt: dayjs(),
  };
  const [formValues, setFormValues] = useState(initialValues);

  const handleDateChange = (date, dateType) => {
    setFormValues({ ...formValues, [dateType]: date });
    setJobFormData((prevData) => ({
      ...prevData,
      deadline: date.format("MMMM DD, YYYY hh:mm A"),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormValues(initialValues);
  };


  const [selectedCareer, setSelectedCareer] = useState(null);

  useEffect(() => {
    fetchCareers();
  }, []);

  const fetchCareers = async () => {
    try {
      const response = await api.get('/jobs/career-recommendations');
      setCareers(response.data);
    } catch (error) {
      console.error('Error fetching careers:', error);
    }
  };





  useEffect(() => {
    const fetchAllJobsOfUser = async () => {
      try {
        const response = await api.get(`/jobs/get/allJobByUser/${userId}`);
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




  const handleEdit = (job) => {
    setSelectedJob(job);
    setDialogOpen(true);
  };

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

  const handleSave = async (e) => {

    e.preventDefault();

     // Validation
  const errors = {};
  if (!selectedJob.title) errors.title = 'Title is required';
  if (!selectedJob.companyId) errors.companyId = 'Company name is required';
  if (!selectedJob.salaryMin) errors.salaryMin = 'Minimum salary is required';
  if (!selectedJob.salaryMax) errors.salaryMax = 'Maximum salary is required';
  if (!selectedJob.applicationLink) errors.applicationLink = 'Application link is required';
  if (!selectedJob.description) errors.description = 'Description is required';
  if (!selectedJob.deadline) errors.deadline = 'Deadline is required';
  setFormErrors(errors);

  if (Object.keys(errors).length > 0) {
    setSnackbarSeverity('error');
    setSnackbarMessage('Please fill in all required fields.');
    setSnackbarOpen(true);
    return;
  }



    const formData = {
      ...selectedJob,
      salaryMin: parseInt(selectedJob.salaryMin),
      salaryMax: parseInt(selectedJob.salaryMax),
    };

    try {
      const response = await api.put(`/jobs/update/${selectedJob.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSnackbarSeverity('success');
      setSnackbarMessage('Job post successfully update!, Wait for admin approval,');
      setSnackbarOpen(true);
      setAllUserJobsPosts(allUserJobsPosts.map(job => (job.id === selectedJob.id ? selectedJob : job)));
      setDialogOpen(false);
      handleCloseMenuItem();
    } catch (error) {
      console.error("Error updating job:", error);
        setSnackbarSeverity('error');
        setSnackbarMessage('Error updating job. Please try again.');
        setSnackbarOpen(true);
    }
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedJob({ ...selectedJob, [name]: value });
  };
  const handleCheckChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setSelectedJob((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
    };

  const handleCloseDialog = () => {
    setDialogOpen(false);
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

      
      const handleClickMenuItem = (event, jobId) => {
        event.stopPropagation();
        setAnchorEl({ anchor: event.currentTarget, jobId });
      };
      
      const handleCloseMenuItem = () => {
        setAnchorEl({ anchor: null, jobId: null });
    };

  const handleSalaryMinChange = (e) => {
    const { value } = e.target;
    if (!isNaN(value)) {
        setSelectedJob((prevData) => ({
        ...prevData,
        salaryMin: value,
      }));
    }
  };
  
  const handleSalaryMaxChange = (e) => {
    const { value } = e.target;
    if (!isNaN(value)) {
        setSelectedJob((prevData) => ({
        ...prevData,
        salaryMax: value,
      }));
    }
  };

 

const handleSkillsChange = (event, value) => {
    setSelectedJob((prevData) => ({
  ...prevData,
  skillsRequired: value,
}));
};
const handleCareerChange = (event, value) => {
  setSelectedCareer(value);
  setJobFormData((prevData) => ({
    ...prevData,
    careerName: value ? [value.career_id] : [],
    skillsRequired: value ? value.required_skills.split(', ') : [],
  }));
};


const handleQuillChange = (content) => {
  setSelectedJob({ ...selectedJob, description: content });
};


const modules = {
  toolbar: [
    [{ header: '1' }, { header: '2' }],
    ['bold', 'italic', 'underline'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link'],
    ['clean'],
  ],
};

const formats = [
  'header',
  'bold',
  'italic',
  'underline',
  'list',
  'bullet',
  'link',
];


    return (
        <ThemeProvider theme={showCustomTheme ? LPtheme : defaultTheme}>
            <div className={`${mode === "light" ? "light-container" : "dark-container"}`} id="job-listing-page-container">
                <Container style={{ paddingTop: "10px", paddingBottom:"50px" }}>
                    <Grid >
                    <Typography
                        variant="h1"
                        sx={{
                        flexDirection: { xs: 'column', md: 'row' },
                        alignSelf: 'center',
                        textAlign: 'center',
                        fontSize: 'clamp(1.5rem, 10vw, 2.5rem)',
                        marginTop: "120px",
                        mb: "30px",
                        color: `${mode==='light'? "": "white"}`
                        }}>
                        Here is the list of&nbsp;
                        <Typography
                        component="span"
                        variant="h1"
                        sx={{
                            fontSize: 'clamp(1.5rem, 10vw, 2.5rem)',
                            color: (theme) =>
                            theme.palette.mode === 'light' ? 'primary.main' : 'primary.light',
                        }}
                        >
                        Jobs You Posted!
                        </Typography>
                    </Typography>

                        {/* small job cards container  */}
                        <Grid style={{display:"flex", flexDirection:"row", }} container md={12} lg={12} margin={0} gap={2} marginTop={0}>
                        {JobsFound? (
                        <Typography ml={"auto"} mr={"auto"} mt={5} variant="body1" color="textSecondary">No jobs found</Typography>
                        ) : (allUserJobsPosts.map((job) => (
                            <Grid
                            style={{ position: "relative"}}
                            item
                            xs={12}
                            md={5.9}
                            key={job.id}
                            >
                            
                            <Card id="job-card-fix-height"
                                className={`job-card ${mode === "light" ? "light-m-border-prime-color" : "dark-m-border-prime-color"}`} onClick={() => handleJobClick(job)}>
                                <CardContent id="job-card-fix-height-content" style={{ paddingBottom: "10px" }}>
                                

                               


                                    
                                    <div className="heading6-jobCard hiring-multiple-canditate tapItem-gutter metadataContainer css-z5ecg7 eu4oa1w0">
                                    {job.hiringMultipleCandidate &&
                                            <div
                                              data-testid="attribute_snippet_testid"
                                              className={`css-1cvvo1b eu4oa1w0 `}
                                            >
                                              Hiring multiple candidates
                                            </div>}

                                            <Grid  style={{marginLeft:"auto"}} item>
                                            <Typography id={job.isApproved? 'status-of-job-approved':'status-of-job'} variant="caption" fontSize={'12px'} borderRadius={'10px'}>
                                              {job.isApproved? 'Approved':'Pending'}
                                            </Typography>


                                            <IconButton aria-label="options" onClick={(event) => handleClickMenuItem(event, job.id)} className="options-button"
                                            id="options-button-actions"
                                            >
                                            <MoreVert />
                                          </IconButton>
                                          <Popover
                                            className="popover-menu"
                                            open={Boolean(anchorEl.jobId === job.id)}
                                            anchorEl={anchorEl.anchor}
                                            onClose={handleCloseMenuItem}
                                            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                                            
                                            >
                                            <MenuItem onClick={() => handleEdit(job)}>Edit</MenuItem>
                                            <MenuItem onClick={() => handleDelete(job.id)}>Delete</MenuItem>
                                          </Popover>
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
                                <Typography
                                title={job.description} 
                                id="job-car-desc"
                                className="parent-container-des"
                                variant="body2"
                                style={{ marginTop: "0.8rem", letterSpacing: "0.5px", wordSpacing: "1px" }}
                                dangerouslySetInnerHTML={{
                                  __html: truncateText(job.description, 100)
                                }}
                              />
                                {/* Additional job details can be displayed here */}
                                </CardContent>
                                
                            </Card>
                            </Grid>
                        )))}
                     </Grid>
                  </Grid>
                </Container>
                  <Footer />


                <Dialog   open={dialogOpen} onClose={handleCloseDialog}>
          <DialogTitle>Edit Job</DialogTitle>
          <DialogContent >
          <Container className={`${mode==="light"? "light-container ": "dark-container"}`} lg={10} style={{
        display: "flex", flexDirection: "row",
        gap: "20px",
        marginTop: "16px",
          width:"80%"
      }}>
        
        <Grid container spacing={2}  >
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Job Title"
              name="title"
              value={selectedJob?.title || ""}
              onChange={handleChange}
              error={Boolean(formErrors.title)}
                helperText={formErrors.title}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Company name"
              name="companyId"
              value={selectedJob?.companyId}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Salary Min"
              type="text"
              name="salaryMin"
              value={selectedJob?.salaryMin}
              onChange={handleSalaryMinChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Salary Max"
              type="number"
              name="salaryMax"
              value={selectedJob?.salaryMax}
              onChange={handleSalaryMaxChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Application Link"
              name="applicationLink"
              value={selectedJob?.applicationLink}
              onChange={handleChange}
              error={Boolean(formErrors.applicationLink)}
              helperText={formErrors.applicationLink}
            />
         </Grid>
                      
         <Grid item xs={6}>
            <Autocomplete
                fullWidth
                options={['Full-time', 'Part-time', 'Hybrid', 'Contract', 'Temporary', 'Freelance']}
                value={selectedJob?.jobType}
                onChange={(event, newValue) => {
                    selectedJob((prevData) => ({
                        ...prevData,
                        jobType: newValue,
                    }));
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Job Type"
                    />
                )}
            />
         </Grid>
        <Grid item xs={6}>
            <TextField
                fullWidth
                label="Job Location"
                name="jobLocation"
                value={selectedJob?.jobLocation}
                onChange={handleChange}
            />
        </Grid>
        
        <Grid item xs={12}>
                <Autocomplete
                  fullWidth
                  options={careers.map(career => career)}
                  getOptionLabel={(option) => option.career_name}
                  value={selectedCareer}
                  onChange={handleCareerChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Career Name"
                      name="careerName"
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  freeSolo
                  fullWidth
                  options={selectedCareer ? selectedCareer.required_skills.split(', ') : [...new Set(careers.flatMap(career => career.required_skills.split(', ')))]}
                  value={jobFormData.skillsRequired}
                  onChange={handleSkillsChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Skills Required"
                      name="skillsRequired"
                      error={Boolean(formErrors.skillsRequired)}
                      helperText={formErrors.skillsRequired}
                    />
                  )}
                />
              </Grid>

               {/* Deadline */}
               <Grid item xs={12}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    renderInput={(props) => <TextField {...props} />}
                    label="Deadline Date and Time"
                    value={formValues.endsAt}
                    onChange={(newValue) =>
                      handleDateChange(newValue, "endsAt")
                    }
                    inputFormat="MM/dd/yyyy hh:mm a"
                    className='w-full'
                    sx={{ width: "100%" }}
                  />
                </LocalizationProvider>
              </Grid>
                      
          <Grid item xs={12}>

            <ReactQuill
              value={selectedJob?.description}
              onChange={handleQuillChange}
              placeholder="Enter job description here..."
              modules={modules}
              formats={formats}
              error={Boolean(formErrors.description)}
              style={{ height: '150px', fontSize: '1rem'}}
              helperText={formErrors.description}
            />

            
          </Grid>
         
          <Grid display={'flex'} justifyContent={'space-between'} mt={4} item xs={12}>
            <FormControlLabel
              control={<Checkbox 
              className='mode-icon-color'
              checked={selectedJob?.hiringMultipleCandidate} onChange={handleCheckChange} name="hiringMultipleCandidate" />}
              label="Hiring Multiple Candidates"
              />
           
          </Grid>
        </Grid>

        </Container>
       
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSave} variant="contained" color="primary">Save Changes</Button>
          </DialogActions>
        </Dialog>
            </div>
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
          </Snackbar>
        </ThemeProvider>
    );
};

export default UserPostedJobs;
