import React, { Suspense, useState, useEffect } from 'react';
import { Route, Routes, Navigate, useNavigate,  } from 'react-router-dom';
import Overview from './Dashboard/Overview'; // Example admin page
import Loader from '../../Components/Loader';
import Layout from './Layout/Layout';
import  SignInAdmin  from './Auth/SignInAdmin'; // SignIn page component
import SignUpAdmin from './Auth/SignUpAdmin'; // SignUp page component
import { paths } from './Paths';
import UserManagement from './Dashboard/UserManagement';
import AssessmentManagement from './Dashboard/AssessmentManagement';
import AssessmentDetails from './Dashboard/AssessmentDetails';
import AssessmentList from './Dashboard/AssessmentList';
import ForumManagement from './Dashboard/ForumManagement';
import ProtectedRoute from './ProtectedRoute';
import Unauthorized from './Dashboard/Unauthorized';
import CareerRecommendation from './Dashboard/CareerRecommendation';
import CourseResource from './Dashboard/CourseResource';
import CareerManagement from './Dashboard/CareerManagement';
import CareerDetails from './Dashboard/CareerDetails';
import ProfileManagement from './Dashboard/ProfileManagement';
import api from '../../Api/Api'
import JobList from './Dashboard/JobList';
import JobRequestList from './Dashboard/JobRequestList';
import eventEmitter from '../../Components/eventEmitter';

const AdminRoutes = ({ mode }) => {
  const [token, setToken] = useState(sessionStorage.getItem('token')); 
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    const localStorageToken = localStorage.getItem('token');
    const sessionStorageToken = sessionStorage.getItem('token');
    const storedToken = localStorageToken || sessionStorageToken;
    setToken(storedToken);
    }, []);

    useEffect(() => {
      const fetchProfile = async () => {
        if(!token){
          console.error('no token provided, can not fetch user data')
          return;
        }
        try {
          const response = await api.get(`/admin/main-nav-profile`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log("🚀 ~ fetchProfile ~ response:", response)
          
          const avatarURL = response.data.profile.avatarURL || 'noProfilePicture';
        setUserProfile(response.data.profile);
        sessionStorage.setItem('imageUrl', avatarURL);
        } catch (error) {
          console.error("Error fetching profile data:", error);
        }
      };
  
      if (token) {
        fetchProfile();
      }
  
      const tokenChangeHandler = (newToken) => {
        setToken(newToken);
        fetchProfile();
      };
  
      eventEmitter.on('tokenChange', tokenChangeHandler);
  
      return () => {
        eventEmitter.off('tokenChange', tokenChangeHandler);
      };
    }, [token]);



    const handleSignOut = () => {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('token');
      setToken(null);
      setUserProfile(null);
      navigate(paths.auth.signIn);
    };

  return (
    <Suspense fallback={<Loader />}>
    <Routes>
      <Route path={paths.auth.signIn} element={<SignInAdmin />} />
      <Route path={paths.auth.signUp} element={<SignUpAdmin />} />
      <Route path={paths.errors.unauthorized} element={<Unauthorized />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute redirectPath={paths.auth.signIn}>
            <Layout userProfile={userProfile} onSignOut={handleSignOut}>
              <Routes>
                <Route path={paths.dashboard.overview} element={<Overview mode={mode} />} />
                
                <Route path={paths.dashboard.account} element={<UserManagement token={token} />} />

                <Route path={paths.dashboard.assessmentManagement} element={<AssessmentManagement token={token} />} >
                  <Route index element={<AssessmentList token={token} />} />
                  <Route path={`:assessment_id`} element={<AssessmentDetails token={token} />} />
                </Route>

                <Route path={paths.dashboard.forum} element={<ForumManagement />} />


                <Route path={paths.dashboard.careerRecommendations} element={<CareerManagement token={token} />} >
                  <Route index element={<CareerRecommendation token={token}/>} />
                  <Route path={`:career_id`} element={<CareerDetails token={token} />} />
                </Route>


                <Route path={paths.dashboard.job} element={<CareerManagement token={token} mode={mode}/>} >
                  <Route index element={<JobList token={token} mode={mode}/>} />
                  <Route path={`requests`} element={<JobRequestList token={token} mode={mode} />} />
                </Route>

                {/* <Route path={paths.dashboard.job} element={<div>Job Management Page</div>} /> */}
                <Route path={paths.dashboard.profile} element={<ProfileManagement token={token}/>} />
                <Route path="*" element={<Navigate to={paths.errors.notFound} />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  </Suspense>
  );
};

export default AdminRoutes;
