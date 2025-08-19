/* eslint-disable no-unused-vars */
import MessagingPage from './Pages/MessagingPage';
import Peoples from './Pages/Peoples';
import React, { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, Navigate, useLocation, useNavigate  } from 'react-router-dom';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import PropTypes from 'prop-types';
import './App.css';
// Lazy load components
// const UserRegistration = lazy(() => import('./Pages/UserRegistration'));
import UserRegistration from './Pages/UserRegistration'; // Adjust the path if necessary
import HomePage from './Pages/HomePage';
import SignIn from './Pages/AuthPages/SignIn';
import JobDetails from './Pages/JobDetails';
import { Box,  ToggleButton, ToggleButtonGroup } from '@mui/material';
import AppAppBar from './Pages/landing-page/components/AppAppBar';
import NotificationPage from './Pages/NotificationPage';
import JobPosting from './Pages/JobPosting';
import ProfilePage from './Pages/ProfilePage';
import CareerDetails from './Pages/CareerDetails';
import ExploreCareers from './Pages/ExploreCareers';
import CareerList from './Pages/CareerList';
import RecommendedCareers from './Pages/RecommendedCareers';
import NotFound from './Pages/NotFound'
import ErrorBoundary from './Components/ErrorBoundary';
import Loader from './Components/Loader';
import UserPostedJobs from './Pages/UserPostedJobs';
import eventEmitter from './Components/eventEmitter';
import ForumPage from './Pages/ForumPage';
import AdminRoutes from './Pages/AdminPages/AdminRoutes';
import api from './Api/Api';
import ExploreAssessments from './Pages/ExploreAssessments';
import AssessmentsList from './Pages/AssessmentsList';
import TakeAssessment from './Pages/TakeAssessment';
import SetGoals from './Pages/SetGoals';
const JobSearch = lazy(() => import('./Pages/JobSearch'));
const JobListingsPage = lazy(() => import('./Pages/JobListingsPage'));
// Lazy load components
// const UserRegistration = lazy(() => import('./Pages/UserRegistration'));
const ApplicationProcess = lazy(() => import('./Pages/ApplicationProcess'));


function ToggleCustomTheme({ showCustomTheme, toggleCustomTheme }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100dvw',
        position: 'fixed',
        bottom: 24,
      }}
    >

      <ToggleButtonGroup
        color="primary"
        exclusive
        value={showCustomTheme}
        onChange={toggleCustomTheme}
        aria-label="Platform"
        sx={{
          backgroundColor: 'background.default',
          '& .Mui-selected': {
            pointerEvents: 'none',
          },
        }}
      >
        <ToggleButton value>
          <AutoAwesomeRoundedIcon sx={{ fontSize: '20px', mr: 1 }} />
          Custom theme
        </ToggleButton>
        <ToggleButton value={false}>Material Design 2</ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}
ToggleCustomTheme.propTypes = {
  showCustomTheme: PropTypes.shape({
    valueOf: PropTypes.func.isRequired,
  }).isRequired,
  toggleCustomTheme: PropTypes.func.isRequired,
};
function AppAppBarConditional({ jobListing, profilePic, userProfile, notificationData, mode, toggleColorMode }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isAdminRouteSec = location.pathname.startsWith('/Admin');


  if (isAdminRoute) {
    return null;
  }
  if (isAdminRouteSec) {
    return null;
  }

  return (
    <AppAppBar
      jobListing={jobListing}
      profilePic={profilePic}
      userProfile={userProfile}
      notificationData={notificationData}
      mode={mode}
      toggleColorMode={toggleColorMode}
    />
  );
}
AppAppBarConditional.propTypes = {
  jobListing: PropTypes.array.isRequired,
  profilePic: PropTypes.string.isRequired,
  notificationData: PropTypes.array.isRequired,
  mode: PropTypes.string.isRequired,
  toggleColorMode: PropTypes.func.isRequired,
};




function App() {
  const [mode, setMode] = useState('light');
  const [jobListing, setJobListing] = useState([]); 
  const [notificationData, setNotificationData] = useState([]);
  const [token, setToken] = useState(sessionStorage.getItem('token')); 
  console.log("🚀 ~ App ~ token:", token)
  const [profilePic, setProfilePic] = useState(sessionStorage.getItem('imageUrl') || '');
  const [userProfile, setUserProfile] = useState(sessionStorage.getItem('imageUrl') || '');

  useEffect(() => {
    const storedToken = sessionStorage.getItem('token');
    setToken(storedToken); 
  }, []);


  // logic

  const handleProfilePictureUpdate = (newProfilePicture) => {
    setProfilePic(newProfilePicture);
    sessionStorage.setItem('imageUrl', newProfilePicture);
  };

  

  useEffect(() => {
    eventEmitter.on('profilePictureUpdate', handleProfilePictureUpdate);

    return () => {
      eventEmitter.off('profilePictureUpdate', handleProfilePictureUpdate);
    };
  }, []);

 
  // const navigate = useNavigate();


      const fetchProfile = async () => {
        if(!token){
          console.error('no token provided, can not fetch user data')
          return;
        }
        try {
          const response = await api.get(`/admin/main-nav-profile`, {
            headers: { Authorization: `Bearer ${token}` },
          });
            console.log("🚀 ~ fetchProfile ~ token:", token)
          const avatarURL = response.data.profile.avatarURL || 'noProfilePicture';
          setUserProfile(response.data.profile);
          setProfilePic(avatarURL)
          sessionStorage.setItem('imageUrl', avatarURL);
          eventEmitter.emit('profilePictureUpdate', avatarURL); // Emit profile picture update event
        } catch (error) {
          console.error("Error fetching profile data:", error);
        }
      };

    useEffect(() => {
      if (token) {
        fetchProfile();
      }

      const tokenChangeHandler = (newToken) => {
        setToken(newToken);
        fetchProfile();
      };

      // eventEmitter.on('profilePictureUpdate', tokenChangeHandler);
      eventEmitter.on('tokenChange', tokenChangeHandler);
  
      return () => {
        // eventEmitter.off('profilePictureUpdate', tokenChangeHandler);
        eventEmitter.off('tokenChange', tokenChangeHandler);
      };
    }, [token]);

    useEffect(() => {
      if(!token){
        setProfilePic(null)
        setUserProfile(null)
      }
    }, [])
    








const handleSignOut = () => {
  sessionStorage.removeItem('token');
    sessionStorage.removeItem('imageUrl');
    setToken(null);
    setUserProfile(null);
    setProfilePic('');
    eventEmitter.emit('tokenChange', null);
  // navigate('user_signIn');
};
  
  const toggleColorMode = () => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };
  return (
    <BrowserRouter>
      <AppAppBarConditional
        jobListing={jobListing}
        profilePic={profilePic}
        userProfile={userProfile?.avatarURL}
        notificationData={notificationData}
        mode={mode}
        toggleColorMode={toggleColorMode}
      />
      <div style={{ backgroundColor: mode === 'dark' ? '#171719' : '#ffffff', minHeight:"100vh" }}>
      <div style={{ backgroundColor: mode === 'dark' ? '#171719' : '#ffffff' }}>
      <ErrorBoundary>
    <Routes>
      {/* <Layout> */}
        {/* <Suspense fallback={<div>Loading...</div>}> */}
        <Route path="/" element={<HomePage mode={mode} />} />
            <Route path="/user-signIn"element={<SignIn/>}/>
            <Route path="/user-registration"element={<UserRegistration />}  />
            <Route path="/job-search" element={JobSearch} />
            <Route path="/job-listings" element={
              <Suspense fallback={<Loader/>}>
              <JobListingsPage jobListing={jobListing} mode={mode} />
              </Suspense>
            } />
            <Route path="/post-job" element={<JobPosting jobListing={jobListing} mode={mode} />} />
          <Route path="/job-details/:jobId" element={<JobDetails mode={mode} />} />
          <Route path="/peoples" element={<Peoples mode={mode}/>} />
          <Route path="/Forum" element={<ForumPage mode={mode} />} />
          <Route path="/profile/:userId" element={<ProfilePage mode={mode}/>} />
          <Route path="/user-posted-jobs/:userId" element={<UserPostedJobs mode={mode}/>} />
          <Route path="/set-goals/:userId" element={<SetGoals tokens={token} mode={mode}/>} />


        
        
           <Route path="/conversation" element={<MessagingPage tokens={token} mode={mode}/>} />


          <Route path="/conversation/:conversationId" element={<MessagingPage tokens={token} mode={mode} />} />
            
        
          <Route path='/careers' element={<ExploreCareers token={token} />}>
                <Route index element={<CareerList token={token} mode={mode}/>} />
                <Route path='recommended' element={<RecommendedCareers token={token} mode={mode}/>} />
                <Route path=':career_id' element={<CareerDetails mode={mode} token={token}/>}/>
        </Route>

        <Route path='/assessments' element={<ExploreAssessments token={token} />}>
                <Route index element={<AssessmentsList token={token} mode={mode}/>} />
                <Route path=':assessment_id' element={<TakeAssessment mode={mode} token={token}/>}/>
        </Route>
         

            <Route path="/application-process" element={ApplicationProcess} />
           
            <Route path="/admin/*" element={<AdminRoutes mode={mode} />} />
              <Route path="/unauthorized" element={<div>Unauthorized</div>} />
            <Route path="/not-found" element={<NotFound/>} />
            <Route path="*" element={<Navigate to="/not-found" />} />
            {/* <Route exact path="/">
              
            </Route> */}
            
        {/* </Suspense> */}
      {/* </Layout> */}
        </Routes>
        </ErrorBoundary>
        </div>
        
        </div>
      </BrowserRouter>

  );
}

export default App;
