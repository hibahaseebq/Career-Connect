import React, { useEffect, useState } from 'react';
import { Grid, Typography, TextField, Button, FormControlLabel, Checkbox, Container, Snackbar, Alert, Autocomplete } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../Api/Api';
import './styles/JobPosting.css'
import Footer from './landing-page/components/Footer';
import getLPTheme from './landing-page/getLPTheme';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
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

const JobPosting = ({ mode }) => {
 
  const initialValues = {
    startedAt: '',
    endsAt: dayjs(),
  };
  const [formValues, setFormValues] = useState(initialValues);

  const handleDateChange = (date, dateType) => {
    setFormValues({ ...formValues, [dateType]: date });
    setJobFormData((prevData) => ({
      ...prevData,
      deadline: date?.format("MMMM DD, YYYY hh:mm A"),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormValues(initialValues);
  };

  const navigate = useNavigate();
  const [token, setToken] = useState(sessionStorage.getItem('token'));
  const [showCustomTheme, setShowCustomTheme] = React.useState(true);
  const LPtheme = createTheme(getLPTheme(mode));
  const defaultTheme = createTheme({ palette: { mode } });
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
    const storedToken = sessionStorage.getItem('token');
    setToken(storedToken);
  }, []);

  const [formErrors, setFormErrors] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setJobFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
  };

  const handleSalaryMinChange = (e) => {
    const { value } = e.target;
    if (!isNaN(value)) {
      setJobFormData((prevData) => ({
        ...prevData,
        salaryMin: value,
      }));
    }
  };

  const handleSalaryMaxChange = (e) => {
    const { value } = e.target;
    if (!isNaN(value)) {
      setJobFormData((prevData) => ({
        ...prevData,
        salaryMax: value,
      }));
    }
  };

  const handleSkillsChange = (event, value) => {
    setJobFormData((prevData) => ({
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

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleSubmitJob = async (e) => {
    e.preventDefault();

     // Validation
  const errors = {};
  if (!jobFormData.title) errors.title = 'Title is required';
  if (!jobFormData.companyId) errors.companyId = 'Company name is required';
  if (!jobFormData.salaryMin) errors.salaryMin = 'Minimum salary is required';
  if (!jobFormData.salaryMax) errors.salaryMax = 'Maximum salary is required';
  if (!jobFormData.applicationLink) errors.applicationLink = 'Application link is required';
  if (!jobFormData.description) errors.description = 'Description is required';
  if (!jobFormData.deadline) errors.deadline = 'Deadline is required';
  setFormErrors(errors);

  if (Object.keys(errors).length > 0) {
    setSnackbarSeverity('error');
    setSnackbarMessage('Please fill in all required fields.');
    setSnackbarOpen(true);
    return;
  }

    const formData = {
      ...jobFormData,
      salaryMin: parseInt(jobFormData.salaryMin),
      salaryMax: parseInt(jobFormData.salaryMax),
    };

    try {
      const response = await api.post('/jobs/create', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSnackbarSeverity('success');
      setSnackbarMessage('Job posted successfully!');
      setSnackbarOpen(true);
      setTimeout(() => {
        navigate('/job-listings');
      }, 2000);
    } catch (error) {
      console.error('Error:', error);
      setSnackbarSeverity('error');
      setSnackbarMessage('Error posting job. Please try again.');
      setSnackbarOpen(true);
    }
  };

  const location = useLocation();

  const handleRedirect = () => {
    const redirectUrl = location.pathname + location.search;
    sessionStorage.setItem('redirectUrl', redirectUrl);
  };

  // reactQuill setting
  const handleQuillChange = (content) => {
    setJobFormData({ ...jobFormData, description: content });
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
    <>
      <Grid container justifyContent="center">
        <form style={{ width: '80%', marginBottom: '100px' }} onSubmit={handleSubmitJob}>
          <Typography
            variant="h1"
            sx={{
              flexDirection: { xs: 'column', md: 'row' },
              alignSelf: 'center',
              textAlign: 'center',
              fontSize: 'clamp(1.5rem, 10vw, 2.5rem)',
              marginTop: '120px',
              mb: '30px',
              color: `${mode === 'light' ? '' : 'white'}`,
            }}
          >
            Post a&nbsp;
            <Typography
              component="span"
              variant="h1"
              sx={{
                fontSize: 'clamp(1.5rem, 10vw, 2.5rem)',
                color: (theme) =>
                  theme.palette.mode === 'light' ? 'primary.main' : 'primary.light',
              }}
            >
              Job!
            </Typography>
          </Typography>

          <Container className={`${mode === 'light' ? 'light-container' : 'dark-container'}`} lg={10} style={{
            display: 'flex', flexDirection: 'row',
            gap: '20px',
            marginTop: '16px',
            width: '80%',
          }}>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Job Title"
                  name="title"
                  value={jobFormData.title}
                  onChange={handleInputChange}
                  error={Boolean(formErrors.title)}
                  helperText={formErrors.title}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Company name"
                  name="companyId"
                  value={jobFormData.companyId}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Salary Min"
                  type="text"
                  name="salaryMin"
                  value={jobFormData.salaryMin}
                  onChange={handleSalaryMinChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Salary Max"
                  type="number"
                  name="salaryMax"
                  value={jobFormData.salaryMax}
                  onChange={handleSalaryMaxChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Application Link"
                  name="applicationLink"
                  value={jobFormData.applicationLink}
                  onChange={handleInputChange}
                  error={Boolean(formErrors.applicationLink)}
                  helperText={formErrors.applicationLink}
                />
              </Grid>

              <Grid item xs={6}>
                <Autocomplete
                  fullWidth
                  options={['Full-time', 'Part-time', 'Hybrid', 'Contract', 'Temporary', 'Freelance']}
                  value={jobFormData.jobType}
                  onChange={(event, newValue) => {
                    setJobFormData((prevData) => ({
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
                  value={jobFormData.jobLocation}
                  onChange={handleInputChange}
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

              <Grid height={200} item xs={12}>
                <ReactQuill
                  value={jobFormData.description}
                  onChange={handleQuillChange}
                  placeholder="Enter job description here..."
                  modules={modules}
                  formats={formats}
                  style={{ height: '200px', fontSize: '1rem' }}
                />
              </Grid>

              
              <Grid mt={8} display={'flex'} justifyContent={'space-between'} item xs={12}>
                <FormControlLabel
                  control={<Checkbox
                    className='mode-icon-color'
                    checked={jobFormData.hiringMultipleCandidate} onChange={handleInputChange} name="hiringMultipleCandidate" />}
                  label="Hiring Multiple Candidates"
                />
                {token ?
                  (<Button type="submit" variant="contained" color="primary">
                    Post Job
                  </Button>) : (
                    <Button
                      color="primary"
                      variant="contained"
                      size="small"
                      component="a"
                      href="/user-signIn"
                      onClick={handleRedirect}
                    >
                      Sign in to Post
                    </Button>
                  )}

              </Grid>
            </Grid>

          </Container>
        </form>
        <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Grid>
      <ThemeProvider theme={showCustomTheme ? LPtheme : defaultTheme}>
        <Footer />
      </ThemeProvider>
    </>
  );
};

export default JobPosting;
