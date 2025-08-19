import React, { useState, useEffect } from "react";
import { Container, Typography, Grid, Avatar, Paper, Box, Divider,  Chip, Link, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Badge, Tooltip, FormControlLabel, Switch,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useLocation } from 'react-router-dom';
import api from '../../../Api/Api'
import { jwtDecode } from "jwt-decode";
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import { useParams } from 'react-router-dom';
import { Phone } from "@mui/icons-material";
import '../../styles/ProfilePage.css'
import eventEmitter from "../../../Components/eventEmitter";
import Footer from "../../landing-page/components/Footer";
import Loader from "../../../Components/Loader";



const ProfileManagement = ({profilePic, handleProfilePicChange, token }) => {
    let mode = 'light'
//   const [token, setToken] = useState(sessionStorage.getItem('token'));
  const [role, setRole] = useState(null); 

  const [editOpen, setEditOpen] = useState(false);
  const [profileData, setProfileData] = useState({ id: null, userId: null, fullName: null, first_name: null, last_name: null, userType: null, description: null, address: null, profilePicture: null, bannerPicture: null, summary: null, skills: null, education: null, experience: null, certifications: null, languages: null, interests: null, accomplishments: null, country: null, region: null, district: null, collegeOrUniversity: null, employmentType: null, companyName: null, phoneNumber: null, headline: null, bio: null, avatarURL: null, socialLinks: null, contactInfo: null, websiteLink: null, connections: null, selfEmployed: null,  createdAt: null, updatedAt: null,
  });

//   useEffect(() => {
  console.log("🚀 ~ ProfileManagement ~ profileData:", profileData)
//     const storedToken = sessionStorage.getItem('token');
//     setToken(storedToken); 
//   }, []);

 

//   const location = useLocation(); 
//   const handleRedirect = () => {
//     const redirectUrl = location.pathname + location.search;
//     sessionStorage.setItem('redirectUrl', redirectUrl); 
//   };
let tokenUserId = null
if (token){
   tokenUserId = jwtDecode(token).userId; 
}
const updateSessionStorageAndEmit = (avatarURL) => {
  sessionStorage.setItem('profilePictureUpdate', avatarURL);
  eventEmitter.emit('profilePictureUpdate', avatarURL);
};
  const  userProfileId  = useParams();
  
  useEffect(() => {
    fetchProfileData();
  }, [userProfileId]);

  const fetchProfileData = async () => {
    try {
      const userId = Number(userProfileId.userId);
      const response = await api.get(`/admin/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = response.data;
      const {profile, user, role}=userData;
      
      if (tokenUserId===userId) {
        updateSessionStorageAndEmit(profile.avatarURL);
      }
      setRole(role)
     
      setProfileData({
        // Include all fields from both profile and user objects
        id: profile.id,
        userId: profile.userId,
        fullName: user.fullName,
        first_name: profile.first_name,
        last_name: profile.last_name,
        description: profile.description,
        address: profile.address,
        profilePicture: profile.profilePicture,
        bannerPicture: profile.bannerPicture,
        summary: profile.summary,
        skills: profile.skills,
        education: profile.education,
        experience: profile.experience,
        certifications: profile.certifications,
        languages: profile.languages,
        interests: profile.interests,
        country: profile.country,
        region: profile.region,
        district: profile.district,
        collegeOrUniversity: profile.collegeOrUniversity,
        employmentType: profile.employmentType,
        companyName: profile.companyName,
        phoneNumber: profile.phoneNumber,
        headline: profile.headline,
        bio: profile.bio,
        avatarURL: profile.avatarURL,
        socialLinks: profile.socialLinks,
        contactInfo: profile.contactInfo,
        websiteLink: profile.websiteLink,
        connections: profile.connections,
        selfEmployed: profile.selfEmployed,
        emailAddress: user.emailAddress,
        userType: user.userType,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  const handleEditOpen = () => {
    setEditOpen(true);
  };

  const handleCall = (phoneNumber) => {
    window.location.href = `tel:${phoneNumber}`;
};
const handleSelfEmployedChange = (event) => {
  setProfileData({ ...profileData, selfEmployed: event.target.checked });
};

  const handleEditClose = () => {
    setEditOpen(false);
  };

  const handleSaveProfile = async () => {
    try {
      await api.put(`/admin/profile/update`, profileData, {headers: {
        Authorization: `Bearer ${token}` 
      }});
      eventEmitter.emit('tokenChange', token);
      handleEditClose();
    } catch (error) {
      console.error("Error saving profile data:", error);
    }
  };
const skills = profileData.skills ? profileData.skills.split(',') : [];
  return (
  <>
    {!token ?
      (
        <Container className='admin-page-main-container'>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, my:4 }} className={`${mode==="light"? "":"dark-m-bg-second-color"}`} elevation={3} >
        {/* <Box
          sx={{
            backgroundImage: 'url("https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/3bb5f691632079.5e372adaa9f70.png")',
            backgroundSize: 'cover',
            height: '200px',
            borderRadius: '8px',
            marginBottom: '16px',
          }}>
            <Avatar
            src="https://st3.depositphotos.com/3431221/13621/v/450/depositphotos_136216036-stock-illustration-man-avatar-icon-hipster-character.jpg"
            alt="Profile Picture"
            sx={{
              width: 120,
              height: 120,
              border: '3px solid white',
              backgroundColor: 'white',
              position: 'relative',
              bottom: '-115px',
              left: '20px',
            }}
          />
           
        </Box> */}
        <Loader/>
        </Box>
        <Paper style={{display:"flex", justifyContent:"end", padding:"0px", boxShadow:"none"}}>
          <Button 
            color="primary"
            variant="contained"
            size="small"
            component="a"
            href="/user-signIn"
            // onClick={handleRedirect}
          >
            Sign in to view profile
            </Button>
          </Paper>
        </Container>
      ):( 
      
      <Container className='admin-page-main-container'>
      
      <Paper id='profile-page-container' className={`${mode==="light"? "":"dark-m-bg-second-color"}`}  sx={{ py: 4, px: 3, marginTop:'32px'  }}>
        {/* Profile Banner */}

        <Box
          sx={{
            backgroundImage: profileData.bannerPicture ? `url(${profileData.bannerPicture})` : 'url("https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/3bb5f691632079.5e372adaa9f70.png")',
            backgroundSize: "cover",
            height: "200px",
            borderRadius: "8px",
            marginBottom: "16px",
            position: "relative",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat"
          }}
        >
           {!profileData.bannerPicture && profileData.userId === tokenUserId && <Typography style={{ opacity: "0.4", position:"absolute", top:"50%",textWrap:"nowrap", margin:"0px 27vw", transform:"translate(0, -50%)" }} variant="h4" fontWeight="bold" mb={2}>
                 please upload you banner
           </Typography>}

       <IconButton
            style={{
              position: "absolute",
              top: "8px",
              right: "8px",
              color: "white",
              zIndex:"1000",
              backgroundColor:"#a8a7a71a",
            
            }}
            aria-label="edit"
            onClick={handleEditOpen}
          >
            <EditIcon  />
          </IconButton>

            <div style={{position:"relative"}}>
           
            <Avatar
              src={profileData.avatarURL? profileData.avatarURL: "https://st3.depositphotos.com/3431221/13621/v/450/depositphotos_136216036-stock-illustration-man-avatar-icon-hipster-character.jpg"}
              alt="Profile Picture"
              sx={{
                width: 120,
                height: 120,
                border: "3px solid white",
                backgroundColor: "white",
                bottom: "-115px",
                left: "20px",
                position:"relative"
              }} />
               <Badge
                 sx={{
                  backgroundColor: "#4CAF50",
                  bottom: "-85px",
                  left: "100px",
                  position:"relative",
                  borderRadius: "15px",
                  padding:"1px 6px",
                  fontSize:"12px",
                  color:"white",
                  border:"3px solid white",
                  textWrap:"nowrap"
                }} 
              overlap="circular"
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
            >
              {role}
          </Badge>
        </div>

        </Box>

        <Container style={{ padding: "0px" }} maxWidth="lg">
          <Box
            color={`${mode === "light" ? "" : "white"}`}
            className={`${mode === "light" ? "" : "dark-m-bg-third-color"}`}
            sx={{
              py: 4,
              px: 3,
              mb: 2,
              border: "1px solid #d4d4d4",
              borderRadius: "10px",
            }}
          >
            <div className="naming-section">
              <div style={{flex:"2"}}>
                <Typography
                  style={{
                    display: "flex",
                    gap: "30px",
                    alignItems: "center",
                    marginBottom: "0px",
                  }}
                  variant="h6"
                  fontWeight="bold"
                  mb={0}
                >
                  {profileData.first_name} {profileData.last_name}
                  <Typography
                    style={{ marginBottom: "0px" }}
                    variant="body2"
                    fontWeight={"bold"}
                    mb={0}
                  >
                    {/* <Link className="badge-button-shape">382 connections</Link> */}
                  </Typography>
                </Typography>
                <Typography style={{ opacity: "0.9" }} variant="body1" mb={2}>
                  {profileData.headline}
                </Typography>
                <Typography
                  style={{ opacity: "0.9" }}
                  variant="body2"
                  mt={1}
                  mb={0}
                >
                   {profileData.district}, {profileData.region}, {profileData.country}
                </Typography>
           

                    {/* website link  */}
                   {profileData.websiteLink &&<Typography style={{textDecoration:"none"}} mt={1} variant="body2" fontWeight={"bold"} mb={2}>
                        <Link href={`${profileData.websiteLink}`} style={{display:"flex", alignItem:"center"}}>
                            visit my website 
                            <span >
                        <li-icon  aria-hidden="true" type="link-external" className="text-view-model__external-hyperlink-icon" size="small"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" data-supported-dps="16x16" fill="currentColor" class="mercado-match" width="16" height="16" focusable="false">
                            <path d="M15 1v6h-2V4.41L7.41 10 6 8.59 11.59 3H9V1zm-4 10a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1h2V3H5a3 3 0 00-3 3v5a3 3 0 003 3h5a3 3 0 003-3V9h-2z"></path>
                            </svg>
                            </li-icon> 
                            </span>
                        </Link>
                    </Typography>} 

              </div>
               <ul className='college-employment-list'>              
               {profileData.selfEmployed && <li>
                    <Typography variant="body2" style={{fontWeight:"bold"}} mb={2}>
                    <WorkIcon  style={{fontSize:"18px",  marginRight:"10px", color:'#1976d2cf' }}/>Self Employed
                    </Typography>
                </li>}

                {profileData.collegeOrUniversity?.trim() && (
                  <li>
                    <Typography  style={{fontWeight: "bold",  }} variant="body2"  mb={2}>
                    <SchoolIcon style={{fontSize:"18px",marginRight:"10px", color:'#1976d2cf' }}/>{profileData.collegeOrUniversity}
                    </Typography>
                  </li>
                )}
            </ul>
            </div>
          </Box>


        {profileData.summary &&  <Box
            color={`${mode === "light" ? "" : "white"}`}
            className={`${mode === "light" ? "" : "dark-m-bg-third-color"}`}
            sx={{
              py: 4,
              px: 3,
              mb: 2,
              border: "1px solid #d4d4d4",
              borderRadius: "10px",
            }}
          >
            <Typography
              variant="subtitle1"
              style={{ fontWeight: "bold" }}
              mb={1}
            >
              Summary
            </Typography>
            <Typography style={{ opacity: "0.9" }} variant="body2" mb={0}>
              {profileData.summary}
            </Typography>
          </Box>}


            
          {profileData.description &&     <Box
                        color={`${mode === "light" ? "" : "white"}`}
                        className={`${mode === "light" ? "" : "dark-m-bg-third-color"}`}
                        sx={{
                          py: 4,
                          px: 3,
                          mb: 2,
                          border: "1px solid #d4d4d4",
                          borderRadius: "10px",
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          style={{ fontWeight: "bold" }}
                          mb={1}
                        >
                          About
                        </Typography>
                        <Typography style={{ opacity: "0.9" }} variant="body2" mb={0}>
                          {profileData.description} 
                        </Typography>
                      </Box>
}
          


          {/* Experience Section */}
          {profileData.experience &&      <Box
            color={`${mode === "light" ? "" : "white"}`}
            className={`${mode === "light" ? "" : "dark-m-bg-third-color"}`}
            sx={{
              py: 4,
              px: 3,
              mb: 2,
              border: "1px solid #d4d4d4",
              borderRadius: "10px",
            }}
          >
            <Typography
              variant="subtitle1"
              style={{ fontWeight: "bold" }}
              mb={1}
            >
              Experience
            </Typography>
            <Typography style={{ opacity: "0.9" }} variant="body2" mb={0}>
              {profileData.experience} 
            </Typography>
          </Box>}

          {/* Skills & Endorsements Section */}
         {skills && skills.length!==0 && <Box
            color={`${mode === "light" ? "" : "white"}`}
            className={`${mode === "light" ? "" : "dark-m-bg-third-color"}`}
            sx={{
              py: 4,
              px: 3,
              mb: 4,
              border: "1px solid #d4d4d4",
              borderRadius: "10px",
            }}
          >
            <Typography
              variant="subtitle1"
              style={{ fontWeight: "bold" }}
              mb={1}
            >
              Skills
            </Typography>
            {/* Skills List */}
            <Grid container spacing={2}>
            {skills.map((skill, index) => (
                <Grid item key={index}>
                    <Chip style={{
                      color: mode === 'dark' ? "#d8d8d8" : "#272727"}} label={skill.trim()} variant="outlined" />
                </Grid>
            ))}
            </Grid>
          </Box>
          }
        </Container>
      </Paper>


      


      <Dialog open={editOpen} onClose={handleEditClose}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Full Name (unique)"
            fullWidth
            variant="outlined"
            value={profileData.fullName || ''}
            onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
          />
          <TextField
            margin="dense"
            label="First Name"
            fullWidth
            variant="outlined"
            value={profileData.first_name || ''}
            onChange={(e) => setProfileData({ ...profileData, first_name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Last Name"
            fullWidth
            variant="outlined"
            value={profileData.last_name || ''}
            onChange={(e) => setProfileData({ ...profileData, last_name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Headline"
            fullWidth
            variant="outlined"
            value={profileData.headline || ''}
            onChange={(e) => setProfileData({ ...profileData, headline: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Website Link"
            fullWidth
            variant="outlined"
            value={profileData.websiteLink || ''}
            onChange={(e) => setProfileData({ ...profileData, websiteLink: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Banner url"
            fullWidth
            variant="outlined"
            value={profileData.bannerPicture || ''}
            onChange={(e) => setProfileData({ ...profileData, bannerPicture: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Avatar url"
            fullWidth
            variant="outlined"
            value={profileData.avatarURL || ''}
            onChange={(e) => setProfileData({ ...profileData, avatarURL: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Bio"
            fullWidth
            variant="outlined"
            value={profileData.bio || ''}
            onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Summary"
            fullWidth
            variant="outlined"
            value={profileData.summary || ''}
            onChange={(e) => setProfileData({ ...profileData, summary: e.target.value })}
          />

          <TextField
            margin="dense"
            label="About"
            fullWidth
            variant="outlined"
            value={profileData.description || ''}
            onChange={(e) => setProfileData({ ...profileData, description: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Address"
            fullWidth
            variant="outlined"
            value={profileData.address || ''}
            onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Skills (comma separated)"
            fullWidth
            variant="outlined"
            value={profileData.skills || ''}
            onChange={(e) => setProfileData({ ...profileData, skills: e.target.value })}
          />
          
          <TextField
            margin="dense"
            label="Education"
            fullWidth
            variant="outlined"
            value={profileData.education || ''}
            onChange={(e) => setProfileData({ ...profileData, education: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Experience"
            fullWidth
            variant="outlined"
            value={profileData.experience || ''}
            onChange={(e) => setProfileData({ ...profileData, experience: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Certifications"
            fullWidth
            variant="outlined"
            value={profileData.certifications || ''}
            onChange={(e) => setProfileData({ ...profileData, certifications: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Languages"
            fullWidth
            variant="outlined"
            value={profileData.languages || ''}
            onChange={(e) => setProfileData({ ...profileData, languages: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Interests"
            fullWidth
            variant="outlined"
            value={profileData.interests || ''}
            onChange={(e) => setProfileData({ ...profileData, interests: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Country"
            fullWidth
            variant="outlined"
            value={profileData.country || ''}
            onChange={(e) => setProfileData({ ...profileData, country: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Region"
            fullWidth
            variant="outlined"
            value={profileData.region || ''}
            onChange={(e) => setProfileData({ ...profileData, region: e.target.value })}
          />
          <TextField
            margin="dense"
            label="District"
            fullWidth
            variant="outlined"
            value={profileData.district || ''}
            onChange={(e) => setProfileData({ ...profileData, district: e.target.value })}
          />
          <TextField
            margin="dense"
            label="College/University"
            fullWidth
            variant="outlined"
            value={profileData.collegeOrUniversity || ''}
            onChange={(e) => setProfileData({ ...profileData, collegeOrUniversity: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Employment Type"
            fullWidth
            variant="outlined"
            value={profileData.employmentType || ''}
            onChange={(e) => setProfileData({ ...profileData, employmentType: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Company Name"
            fullWidth
            variant="outlined"
            value={profileData.companyName || ''}
            onChange={(e) => setProfileData({ ...profileData, companyName: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Phone Number"
            fullWidth
            variant="outlined"
            value={profileData.phoneNumber || ''}
            onChange={(e) => setProfileData({ ...profileData, phoneNumber: e.target.value })}
          />

      <FormControlLabel
      control={
        <Switch
          checked={profileData.selfEmployed || false}
          onChange={handleSelfEmployedChange}
        />
      }
      label="Self Employed ?"
    />
          
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} color="primary">Cancel</Button>
          <Button onClick={handleSaveProfile} color="primary">Save</Button>
        </DialogActions>
      </Dialog>


    </Container>)}
     
                {/* Phone  */}
                {token && profileData.phoneNumber && profileData.userId !== tokenUserId && (
                  <div className="fixed-contact-button">
                     <Tooltip title={`Chat with ${profileData.fullName}`}>
                    <Typography style={{ textDecoration: "none" }} mt={0} variant="body2" fontWeight={"bold"} mb={2}>
                      <Button
                        className="phone-button"
                        variant="contained"
                        color="primary"
                        startIcon={<Phone />}
                        onClick={() => handleCall(profileData.phoneNumber)}
                      >
                       
                      </Button>
                    </Typography>
                    </Tooltip>
                  </div>
                )}

</>
);
};

export default ProfileManagement;
