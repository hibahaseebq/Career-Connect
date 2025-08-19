import React, { useEffect, useState } from 'react';
import {jwtDecode } from 'jwt-decode'
import { TextField, Select, MenuItem, Button, Typography, Grid,  FormControl,   InputLabel,  Container, Snackbar, Alert,  } from '@mui/material';
import eventEmitter from "../Components/eventEmitter";
import './styles/UserRegistration.css'
import api from '../Api/Api' 
import {  Link, useNavigate } from 'react-router-dom';
import Loader from '../Components/Loader';

const setEmailConfirmationStatusInSession = (status) => {
  sessionStorage.setItem('emailConfirmed', status);
};

const getEmailConfirmationStatusFromSession = () => {
  return sessionStorage.getItem('emailConfirmed') === 'true';
};


const UserRegistration = () => {
  
  const [emailConfirmed, setEmailConfirmed] = useState(getEmailConfirmationStatusFromSession());
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [token, setToken] = useState(sessionStorage.getItem('token')); 
  const [loading, setLoading] = useState(false);
  const [userIdFromToken, setUserIdFromToken] = useState(null);
  const [verificationCode, setVerificationCode] = useState('');

  const navigate = useNavigate();
  
  const getUserIdFromToken = (token) => {
    const decodedToken = jwtDecode(token);
    const userIdIs = decodedToken.userId;
    setUserIdFromToken(userIdIs); 
  }

  useEffect(() => {
    const storedToken = sessionStorage.getItem('token');
    if(storedToken){
    setToken(storedToken);
    getUserIdFromToken(storedToken);
    } 
  }, []);

  useEffect(() => {
    setEmailConfirmationStatusInSession(emailConfirmed);
}, [emailConfirmed]);

  const [firstFormData, setFirstFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    country: '',
    region: '',
    district: '',
    userType: 'student',
  });
 
  


  const handleGoBack = async () => {
    setLoading(true); 
    try {
      console.log("🚀 ~ handleGoBack ~ token:", token)

      const response = await api.delete('/users/delete', { headers: { Authorization: `Bearer ${token}` } });
      showSnackbar(response?.data?.message);
      console.log("🚀 ~ handleGoBack ~ response:", response)
      setEmailConfirmed(false);
      sessionStorage.removeItem('token');
      setToken(null);
    } catch (error) {
      console.error('Error:', error);
      if (error.response) {
        const errorMessage = error.response.data.message || 'Failed to Go back. Please try again later.';
        showSnackbar(errorMessage, 'error');
      } else if (error.request) {
        showSnackbar('No response received from server. Please try again later.', 'error');
      } else {
        showSnackbar('An unexpected error occurred. Please try again later.', 'error');
      }
    } finally {
      setLoading(false); 
    }
  }


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFirstFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleInputChangeEmailCode = (e) => {
    const { value } = e.target;
    setVerificationCode(value);
  };

  
  


  const handleSubmitFirstStep = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { email, password, fullName, country, region, district, userType, collegeOrUniversity, isStudent,  education, startDate, endDate } = firstFormData;
    
    // Check if required fields are empty
    if (!email || !password || !fullName || !country || !region || !district || !userType ||
      // (isStudent === false && (!employmentType || !companyName)) ||
      (isStudent === true && (!education || !startDate || !endDate || collegeOrUniversity))) {
        setLoading(false);
    showSnackbar('Please fill in all required fields.', 'error');
    return;
  }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setLoading(false);
      showSnackbar('Please enter a valid email address.', 'error');
      return;
    }
  
    if (password.length < 6 || password.length > 20) {
      setLoading(false);
      showSnackbar('Password must be between 6 and 20 characters.', 'error');
      return;
    }

    if (fullName.length < 1 || fullName.length > 30) {
      setLoading(false);
      showSnackbar('fullName must be between 2 and 20 characters.', 'error');
      return;
    }

    try {
      const response = await api.post('/users/signup', firstFormData);
      const { token } = response.data;
      const backendUserId = jwtDecode(token).userId; 
      const isUserIdMatched = userIdFromToken === backendUserId;
      if (isUserIdMatched) {
        setEmailConfirmed(true);
      } else {
        setEmailConfirmed(false);
      }
      sessionStorage.setItem('token', token);
      eventEmitter.emit('tokenChange', token);
      setToken(sessionStorage.getItem('token'))
      showSnackbar(response?.data?.message);
    } catch (error) {
      console.error('Error:', error);
      if (error.response) {
        const errorMessage = error.response.data.message || 'Failed to register user. Please try again later.';
        showSnackbar(errorMessage, 'error');
      } else if (error.request) {
        showSnackbar('No response received from server. Please try again later.', 'error');
      } else {
        showSnackbar('An unexpected error occurred. Please try again later.', 'error');
      }
    } finally {
      setLoading(false); 
    }
  }

  
  const handleSubmitEmailVerification = async (e) => {
    e.preventDefault();
    setLoading(true); 
    if (!verificationCode) {
      showSnackbar('Please Enter your Email Verification code.', 'error');
      setLoading(false); 
      return;
    }
   
    if (verificationCode.length < 5 || verificationCode.length > 20) {
      showSnackbar('VerificationCode must be between 5 and 20 characters.', 'error');
      setLoading(false); 
      return;
    }
    
    try {
      const response = await api.post('/users/verify-email', { verificationCode },{headers: {
        Authorization: `Bearer ${token}` 
      }});
      
      console.log(response?.data?.message, "response?.data?.message")
      showSnackbar(response?.data?.message, 'success');
      setEmailConfirmed(true);
      navigate('/job-listings'); 
    } catch (error) {
      console.error('Error:', error);
      if (error.response) {
        
        if (error.response?.data?.message==="Email already verified for this user"){
          setSnackbarOpen(true);
          showSnackbar(error.response.data.message, 'info');
          navigate('/job-listings'); 
          }

        const errorMessage = error.response.data.message || 'Failed to register user. Please try again later.';
        showSnackbar(errorMessage, 'error');
      } else if (error.request) {
        showSnackbar('No response received from server. Please try again later.', 'error');
      } else {
        showSnackbar('An unexpected error occurred. Please try again later.', 'error');
      }
    } finally{
      setLoading(false); 
    }
  }


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


  const renderFirstSteps = () => {
    return (
      <>
        
        <Typography
            variant="h1"
            sx={{
              flexDirection: { xs: 'column', md: 'row' },
              alignSelf: 'center',
              textAlign: 'center',
              fontSize: 'clamp(1.5rem, 10vw, 2.5rem)',
              marginTop: "120px",
              mb:"30px"
            }}>
            Register&nbsp;
            <Typography
              component="span"
              variant="h1"
              sx={{
                fontSize: 'clamp(1.5rem, 10vw, 2.5rem)',
                color: (theme) =>
                  theme.palette.mode === 'light' ? 'primary.main' : 'primary.light',
              }}
            >
              Here!
            </Typography>
          </Typography>

      
        <Container lg={10} style={{
        display: "flex", flexDirection: "column",
        gap: "20px",
        marginTop: "16px",
          width:"80%"
      }}>
        
        <Grid container spacing={2}  >
          <Grid item xs={12} display={'flex'} gap={2}>
            <Grid item xs={12}>
              <TextField
              required 
                fullWidth
                label="Full Name"
                name="fullName"
                value={firstFormData.fullName}
                onChange={handleInputChange}
              />
            </Grid>
                
            <Grid item xs={12}>
              <TextField
              required 
                fullWidth
                label="Email"
                name="email"
                value={firstFormData.email}
                onChange={handleInputChange}
              />
            </Grid>
            </Grid>
            <Grid item xs={12}>
              <TextField
              required 
                fullWidth
                type="password"
                label="Password"
                name="password"
                value={firstFormData.password}
                onChange={handleInputChange}
              />
            </Grid>
                  
           
            <Grid item xs={12} display={'flex'} gap={2}>
              <Grid item xs={12}>
                <TextField
                required 
                  fullWidth
                  label="Country"
                  name="country"
                  value={firstFormData.country}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                required 
                  fullWidth
                  label="Region"
                  name="region"
                  value={firstFormData.region}
                  onChange={handleInputChange}
                />
            </Grid>
          </Grid>
          
            <Grid item xs={12}>
              <TextField
              required 
                fullWidth
                label="District"
                name="district"
                value={firstFormData.district}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
              
                

        <Grid container spacing={2}>
          <Grid item xs={12}>
              <Select
                  required
                  fullWidth
                  label="User Type"
                  name="userType"
                  value={firstFormData.userType}
                  onChange={handleInputChange}
                >
                  <MenuItem value="student">Student</MenuItem>
                  <MenuItem value="counsellor">Counsellor</MenuItem>
                </Select>
            </Grid>
            
          </Grid>
        </Container>

        <Container lg={10} style={{
        display: "flex", flexDirection: "row", justifyContent:"space-between",
        gap: "20px",
        marginTop: "20px",
          width:"80%",
          alignItems:"flex-end"
        }}>
        <Button onClick={handleSubmitFirstStep} variant="contained" color="primary">
          <Link style={{textDecoration:"none", fontSize:"14px", color:"white"}} to={'/user-signIn'}>Already have account? Sign in</Link>
          </Button>
          <Button onClick={handleSubmitFirstStep} variant="contained" color="primary">
          {loading ? <Loader color="white" /> : 'Submit details'}
      </Button>
      </Container>
        </>
          );
        };  
    
  const renderEmailVerificationStep = () => {
    
        return (
          <>
            <Typography
            variant="h1"
            sx={{
              flexDirection: { xs: 'column', md: 'row' },
              alignSelf: 'center',
              textAlign: 'center',
              fontSize: 'clamp(1rem, 10vw, 2rem)',
              marginTop: "120px",
              mb:"30px"
            }}>
            Verify your&nbsp;
            <Typography
              component="span"
              variant="h1"
              sx={{
                fontSize: 'clamp(1rem, 10vw, 2rem)',
                color: (theme) =>
                  theme.palette.mode === 'light' ? 'primary.main' : 'primary.light',
              }}
            >
              email here!
            </Typography>
          </Typography>

      
        <Container lg={10} style={{
        display: "flex", flexDirection: "row",
        gap: "20px",
        marginTop: "16px",
          width:"60%"
      }}>
        
        <Grid container spacing={2}  >
            
              <Grid item xs={12}>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email Confirmation Code"
                  name="emailConfirmation"
                  value={verificationCode}
                  onChange={handleInputChangeEmailCode}
                  required
                />
              </Grid>
              
                <Grid style={{ display: "flex", justifyContent: "space-between" }} item xs={12}>
                <Button onClick={handleGoBack} variant="contained" color="primary">
                Go back{/* {loading ? <Loader color="white" /> : 'Go back'} */}
                </Button>

                <Button onClick={handleSubmitEmailVerification} variant="contained" color="primary">
                  Verify Email
                </Button>
            </Grid>
              </Grid>
          </Container>
            </>
          );
        };


 


  return (
    <Grid container justifyContent="center">
      {!token && !emailConfirmed ? (
        <form style={{ width: "80%" }} onSubmit={handleSubmitFirstStep}>
        {renderFirstSteps()}
      </form>
      ) : (
        <form style={{ width: "80%" }} onSubmit={handleSubmitEmailVerification}>
        {renderEmailVerificationStep()}
      </form>
      )}

    <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Grid>
  );
  }

export default UserRegistration;
