import * as React from 'react';
import PropTypes from 'prop-types';
import  '../../../Pages/styles/AppBar.css';
import eventEmitter from '../../../Components/eventEmitter';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import {IconButton, Menu, MenuItem, TextField, Tooltip} from '@mui/material';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import { ToggleColorMode } from './ToggleColorMode';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import BrandLogo from '../../../Components/jobConnectLogo.png'
import { DarkCareerIcon, LightCareerIcon, LightAssessmentIcon, DarkAssessmentIcon, LightHomeIcon, DarkHomeIcon, LightWorkIcon, DarkWorkIcon, LightPeopleIcon, DarkPeopleIcon, LightMessageIcon, DarkMessageIcon,  ProfileAvatar, LightPostIcon, DarkPostIcon, LightForumIcon, DarkForumIcon } from './subComp/AppbarIcons';
import './subComp/AppbarIcons.css';
import { jwtDecode } from 'jwt-decode';




const logoStyle = {
  width: '140px',
  height: 'auto',
  cursor: 'pointer',
};

function AppAppBar({ mode, toggleColorMode, userProfile, jobListing,notificationData, profilePic }) {
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const activeColor = 'gray';
  const [token, setToken] = React.useState(sessionStorage.getItem('token')); 


  const isUser = true;
  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const scrollToSection = (sectionId) => {
    const sectionElement = document.getElementById(sectionId);
    const offset = 128;
    if (sectionElement) {
      const targetScroll = sectionElement.offsetTop - offset;
      sectionElement.scrollIntoView({ behavior: 'smooth' });
      window.scrollTo({
        top: targetScroll,
        behavior: 'smooth',
      });
      setOpen(false);
    }
  };


  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    const handleClick = () => {
      handleClickProfile(); // Call the parent function to handle menu opening
    };
  };
  const handleClickProfile = (event) => {
    React.startTransition(() => {
      const { currentTarget } = event;
      setAnchorEl(currentTarget);
    });
  };

  const handleClose = () => {
    setAnchorEl(null);
  };


  const handleSearchChange = (event) => {
  };


  
  const navigate = useNavigate();
  const handleSignOut = () => {
    sessionStorage.removeItem('token'); 
    // sessionStorage.removeItem('imageUrl');
    // eventEmitter.emit('userSignedOut');

    sessionStorage.setItem('imageUrl', 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.shutterstock.com%2Fsearch%2Fdefault-user&psig=AOvVaw38MvdNDGd9-aGtvhsH93ba&ust=1718377700554000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCKjlk_ft2IYDFQAAAAAdAAAAABAJ');

    eventEmitter.emit('imageUrl', 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.shutterstock.com%2Fsearch%2Fdefault-user&psig=AOvVaw38MvdNDGd9-aGtvhsH93ba&ust=1718377700554000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCKjlk_ft2IYDFQAAAAAdAAAAABAJ');

    eventEmitter.emit('profilePictureUpdate', null);
    eventEmitter.emit('tokenChange', null);
    setToken(null);  
    handleClose()
    navigate('/');
  };
// ///////////////////////////////////////////////

React.useEffect(() => {
  const handleTokenChange = (newToken) => {
    console.log("🚀 ~ appbar ~ newToken:", newToken)
    setToken(newToken);
  };

  eventEmitter.on('tokenChange', handleTokenChange);

  return () => {
    eventEmitter.off('tokenChange', handleTokenChange);
  };
}, []);

React.useEffect(() => {
  if (token) {
    try {
      const decoded = jwtDecode(token);
      console.log(decoded.userId);
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }
}, [token]);

let userId = null;
if (token) {
  try {
    const decoded = jwtDecode(token);
    userId = decoded.userId;
  } catch (error) {
    console.error("Error decoding token:", error);
  }
}


  return (
    <div>
      <AppBar
        position="fixed"
        sx={{
          boxShadow: 0,
          bgcolor: 'transparent',
          backgroundImage: 'none',
          mt: 2,
        }}
      >
        <Container maxWidth="lg">
          <Toolbar
            variant="regular"
            sx={(theme) => ({
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexShrink: 0,
              borderRadius: !jobListing ? '999px' : '9px',
              bgcolor:
                mode === 'light'
                  ? 'rgba(255, 255, 255, 0.4)'
                  : 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(24px)',
              maxHeight: 40,
              border: '1px solid',
              borderColor: 'divider',
              boxShadow:
                theme.palette.mode === 'light'
                  ? `0 0 1px rgba(85, 166, 246, 0.1), 1px 1.5px 2px -1px rgba(85, 166, 246, 0.15), 4px 4px 12px -2.5px rgba(85, 166, 246, 0.15)`
                  : '0 0 1px rgba(2, 31, 59, 0.7), 1px 1.5px 2px -1px rgba(2, 31, 59, 0.65), 4px 4px 12px -2.5px rgba(2, 31, 59, 0.65)',
            })}
          >

            {/* appBar top left content  */}
            
            <Box
              sx={{
                flexGrow: 2,
                display: 'flex',
                alignItems: 'center',
                ml: '-18px',
                px: 1.6,
              }}
            >
              <Link to={'/'} style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
              <img
                src={BrandLogo}
                style={logoStyle}
                alt="logo of jobConnect"
              />
            </Link>
              {!jobListing ?
                (<Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                <MenuItem
                  onClick={() => scrollToSection('features')}
                  sx={{ py: '6px', px: '12px' }}
                >
                  <Typography variant="body2" color="text.primary">
                    Features
                  </Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => scrollToSection('testimonials')}
                  sx={{ py: '6px', px: '12px' }}
                >
                  <Typography variant="body2" color="text.primary">
                    Testimonials
                  </Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => scrollToSection('highlights')}
                  sx={{ py: '6px', px: '12px' }}
                >
                  <Typography variant="body2" color="text.primary">
                    Highlights
                  </Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => scrollToSection('pricing')}
                  sx={{ py: '6px', px: '12px' }}
                >
                  <Typography variant="body2" color="text.primary">
                    Pricing
                  </Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => scrollToSection('faq')}
                  sx={{ py: '6px', px: '12px' }}
                >
                  <Typography variant="body2" color="text.primary">
                    FAQ
                  </Typography>
                </MenuItem>
                </Box>) :
              
                (
                  <Box style={{marginLeft:"30px"}} sx={{ display: { xs: 'none', md: 'flex' } }}>
                  
                    <TextField
                     id="search"
                      className={`${mode==="light"? "light-m-input-field":"dark-m-input-field"} appBarSearch`}
                    label="Search"
                    variant="outlined"
                    size="small" 
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
                
                </Box>
              )
              
              }
            </Box>

            {/* appBar top right content  */}
            {!jobListing && !isUser && !token ? (
              <Box
                sx={{
                  display: { xs: 'none', md: 'flex' },
                  gap: 0.5,
                  alignItems: 'center',
                }}
              >
                <ToggleColorMode mode={mode} toggleColorMode={toggleColorMode} />
                <Button
                  color="primary"
                  variant="text"
                  size="small"
                  component="a"
                  href="/user-signIn"
                >
                  Sign in
                </Button>
                <Button
                  color="primary"
                  variant="contained"
                  size="small"
                  component="a"
                  href="/user-registration"
                >
                  Sign up
                </Button>
              </Box>) : (
                <Box
                  id="appBarIcons"
                  sx={{
                    display:"flex",
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    gap: '30px',
                  }}
                >
                  <IconButton>
                  <Tooltip title="Find Jobs" placement="bottom">
                    <NavLink className={`${mode === 'light' ? 'lightMode-link' : 'darkMode-link'}`} activeClassName="active-link" to="/job-listings">
                      {mode === 'light' ? <LightWorkIcon mode="light"/> : <DarkWorkIcon mode="dark"/>}
                      </NavLink>
                     </Tooltip>
                  </IconButton>


                  <IconButton>
                  <Tooltip title="Find and ask questions" placement="bottom">
                    <NavLink className={`${mode === 'light' ? 'lightMode-link' : 'darkMode-link'}`} activeClassName="active-link" to="/Forum">
                      {mode === 'light' ? <LightForumIcon mode="light"/> : <DarkForumIcon  mode="dark"/>}
                      </NavLink>
                     </Tooltip>
                  </IconButton>
                  

                  <IconButton>
                  <Tooltip title="Post a Job" placement="bottom">
                    <NavLink className={`${mode === 'light' ? 'lightMode-link' : 'darkMode-link'}`} activeClassName="active-link" to="/post-job">
                      {mode === 'light' ? <LightPostIcon mode="light"/> : <DarkPostIcon mode="dark"/>}
                    </NavLink>
                     </Tooltip>
                  </IconButton>



          <IconButton>
          <Tooltip title="Talk with a Counselors" placement="bottom">
              <NavLink className={`${mode === 'light' ? 'lightMode-link' : 'darkMode-link'}`} activeClassName="active-link" to="/conversation">
                {mode === 'light' ? <LightMessageIcon/> : <DarkMessageIcon/>}
              </NavLink>
          </Tooltip>
            </IconButton>



              <IconButton>
                  <Tooltip title="Social Network" placement="bottom">
                    <NavLink className={`${mode === 'light' ? 'lightMode-link' : 'darkMode-link'}`} activeClassName="active-link" to="/peoples">
                      {mode === 'light' ? <LightPeopleIcon/> : <DarkPeopleIcon/>}
                      </NavLink>
                  </Tooltip>
            </IconButton>


            <IconButton>
                  <Tooltip title="Explore Careers" placement="bottom">
                    <NavLink className={`${mode === 'light' ? 'lightMode-link' : 'darkMode-link'}`} activeClassName="active-link" to="/careers">
                      {mode === 'light' ? <LightCareerIcon/> : <DarkCareerIcon/>}
                      </NavLink>
                  </Tooltip>
            </IconButton>

            <IconButton>
                  <Tooltip title="Explore Assessments" placement="bottom">
                    <NavLink className={`${mode === 'light' ? 'lightMode-link' : 'darkMode-link'}`} activeClassName="active-link" to="/assessments">
                      {mode === 'light' ? <LightAssessmentIcon/> : <DarkAssessmentIcon/>}
                      </NavLink>
                  </Tooltip>
            </IconButton>

            

            

             

            <IconButton style={{border:"1px solid blue",}} onClick={handleClickProfile}>
                      <ProfileAvatar style={{ padding: "4px" }} userProfile={userProfile} profilePic={profilePic} />
            </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
              {userId ? (<NavLink style={{textDecoration:"none"}} className={`${mode === 'light' ? 'lightMode-link' : 'darkMode-link'}`} activeClassName="active-link" to={`/profile/${userId}`}>
                      <MenuItem onClick={handleClose}>Visit My Profile</MenuItem>
                  </NavLink>)
                   :
                  (<NavLink style={{textDecoration:"none"}} className={`${mode === 'light' ? 'lightMode-link' : 'darkMode-link'}`} activeClassName="active-link" to={`/user-signIn`}>
                  <MenuItem onClick={handleClose}>Visit My Profile</MenuItem>
              </NavLink>)
              }


            {userId ? (<NavLink style={{textDecoration:"none"}} className={`${mode === 'light' ? 'lightMode-link light-m-text-second-color' : 'darkMode-link light-m-text-second-color'}`} activeClassName="active-link" to={`/user-posted-jobs/${userId}`}>
                      <MenuItem onClick={handleClose}>My Posted Jobs</MenuItem>
                  </NavLink>)
                   :
                  (<NavLink style={{textDecoration:"none"}} className={`${mode === 'light' ? 'lightMode-link light-m-text-second-color' : 'darkMode-link light-m-text-second-color'}`} activeClassName="active-link" to={`/user-signIn`}>
                  <MenuItem onClick={handleClose}>My Posted Jobs</MenuItem>
              </NavLink>)
              }

                {userId ? (<NavLink style={{textDecoration:"none"}} className={`${mode === 'light' ? 'lightMode-link light-m-text-second-color' : 'darkMode-link light-m-text-second-color'}`} activeClassName="active-link" to={`/set-goals/${userId}`}>
                      <MenuItem onClick={handleClose}>Set Goals</MenuItem>
                  </NavLink>)
                   :
                  (<NavLink style={{textDecoration:"none"}} className={`${mode === 'light' ? 'lightMode-link light-m-text-second-color' : 'darkMode-link light-m-text-second-color'}`} activeClassName="active-link" to={`/user-signIn`}>
                  <MenuItem onClick={handleClose}>Sign in Set Goals</MenuItem>
              </NavLink>)
              }

                    {/* <MenuItem onClick={handleClose}>Settings</MenuItem> */}
                    {userId ? (<MenuItem onClick={handleSignOut}>Sign Out</MenuItem>):(
                      
                      <NavLink color={mode === "light" ? "black" : "white"} style={{textDecoration:"none"}} className={`${mode === 'light' ? 'lightMode-link' : 'darkMode-link'}`} activeClassName="active-link" to={`/user-signIn`}>
                  <MenuItem onClick={handleClose}>Sign in</MenuItem>
              </NavLink>

                    )}
                    
                  </Menu>

              <ToggleColorMode onClick={handleClick} mode={mode} toggleColorMode={toggleColorMode} />
          
              </Box>
              )}

              
{/* for sm screen  */}

            <Box  sx={{ display: { sm: '', md: 'none' } }}>
              <Button
                variant="text"
                color="primary"
                aria-label="menu"
                onClick={toggleDrawer(true)}
                sx={{ minWidth: '30px', p: '4px' }}
              >
                <MenuIcon />
              </Button>
              <Drawer  anchor="right" open={open} onClose={toggleDrawer(false)}>
                <Box
                  sx={{
                    minWidth: '60dvw',
                    p: 2,
                    backgroundColor: mode==='light'? "background.paper": "#171719",
                    flexGrow: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'row-reverse',
                      alignItems: 'center',
                      justifyContent:"space-between",
                      flexGrow: 1,
                      padding:"10px 0px",
                    }}
                  >
                     <IconButton style={{border:"1px solid blue",}} onClick={handleClickProfile}>
                      <ProfileAvatar style={{ padding: "4px" }} profilePic={profilePic} />
            </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
              {userId ? (<NavLink style={{textDecoration:"none"}} className={`${mode === 'light' ? 'lightMode-link' : 'darkMode-link'}`} activeClassName="active-link" to={`/profile/${userId}`}>
                      <MenuItem onClick={handleClose}>Visit My Profile</MenuItem>
                  </NavLink>)
                   :
                  (<NavLink style={{textDecoration:"none"}} className={`${mode === 'light' ? 'lightMode-link' : 'darkMode-link'}`} activeClassName="active-link" to={`/user-signIn`}>
                  <MenuItem onClick={handleClose}>Visit My Profile</MenuItem>
              </NavLink>
              )
              }

{userId ? (<NavLink  style={{textDecoration:"none",}} className={`${mode === 'light' ? 'lightMode-link light-m-text-second-color ' : 'darkMode-link light-m-text-second-color'}`} activeClassName="active-link" to={`/user-posted-jobs/${userId}`}>
                      <MenuItem onClick={handleClose}>My Posted Jobs</MenuItem>
                  </NavLink>)
                   :
                  (<NavLink style={{textDecoration:"none"}} className={`${mode === 'light' ? 'lightMode-link light-m-text-second-color ' : 'darkMode-link light-m-text-second-color'}`} activeClassName="active-link" to={`/user-signIn`}>
                  <MenuItem onClick={handleClose}>My Posted Jobs</MenuItem>
              </NavLink>)
              }


{userId ? (<NavLink style={{textDecoration:"none"}} className={`${mode === 'light' ? 'lightMode-link light-m-text-second-color' : 'darkMode-link light-m-text-second-color'}`} activeClassName="active-link" to={`/set-goals/${userId}`}>
                      <MenuItem onClick={handleClose}>Set Goals</MenuItem>
                  </NavLink>)
                   :
                  (<NavLink style={{textDecoration:"none"}} className={`${mode === 'light' ? 'lightMode-link light-m-text-second-color' : 'darkMode-link light-m-text-second-color'}`} activeClassName="active-link" to={`/user-signIn`}>
                  <MenuItem onClick={handleClose}>Sign in Set Goals</MenuItem>
              </NavLink>)
              }


                    {/* <MenuItem onClick={handleClose}>Settings</MenuItem> */}
                    <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
                  </Menu>

                  
                    <ToggleColorMode mode={mode} toggleColorMode={toggleColorMode} />
                  </Box>
                  <Divider />

                  <Box style={{marginTop:"10px", gap:"10px", display:"flex", justifyContent:"center", flexDirection:"column", padding:"10px 0px", }}>

                  <IconButton style={{borderRadius:"12px"}}>
                  <Tooltip title="Find Jobs" placement="bottom">
                    <NavLink id="sm-navLinks"   className={`${mode === 'light' ? 'lightMode-link' : 'darkMode-link dark-m-text-second-color'}`} activeClassName="active-link" to="/job-listings">
                      {mode === 'light' ? <LightWorkIcon mode="light"/> : <DarkWorkIcon mode="dark"/>} <span >Find Jobs</span>
                      </NavLink>
                     </Tooltip>
                  </IconButton>

                  <IconButton>
                  <Tooltip title="Find and ask questions" placement="bottom">
                    <NavLink id="sm-navLinks" className={`${mode === 'light' ? 'lightMode-link' : 'darkMode-link'}`} activeClassName="active-link" to="/Forum">
                      {mode === 'light' ? <LightForumIcon mode="light"/> : <DarkForumIcon  mode="dark"/>}
                      <span >Forums</span>
                      </NavLink>
                     </Tooltip>
                  </IconButton>
                  

                  <IconButton style={{borderRadius:"12px"}}>
                  <Tooltip title="Post a Job" placement="bottom">
                    <NavLink id="sm-navLinks" className={`${mode === 'light' ? 'lightMode-link' : 'darkMode-link dark-m-text-second-color'}`} activeClassName="active-link" to="/post-job">
                      {mode === 'light' ? <LightPostIcon mode="light"/> : <DarkPostIcon mode="dark"/>} <span>Post a Job</span>
                    </NavLink>
                     </Tooltip>
                  </IconButton>

          
                  <IconButton>
              <NavLink id="sm-navLinks" className={`${mode === 'light' ? 'lightMode-link' : 'darkMode-link'}`} activeClassName="active-link" to="/conversation">
                {mode === 'light' ? <LightMessageIcon/> : <DarkMessageIcon/>}
                <span>messages</span>
              </NavLink>
            </IconButton>






              <IconButton style={{borderRadius:"12px"}}>
                  <Tooltip title="Social Network" placement="bottom">
                    <NavLink id="sm-navLinks" className={`${mode === 'light' ? 'lightMode-link' : 'darkMode-link dark-m-text-second-color'}`} activeClassName="active-link" to="/peoples">
                      {mode === 'light' ? <LightPeopleIcon/> : <DarkPeopleIcon/>}
                      <span>Social Network</span>
                      </NavLink>
                  </Tooltip>
              </IconButton>




            <IconButton>
                  <Tooltip title="Explore Careers" placement="bottom">
                    <NavLink id="sm-navLinks" className={`${mode === 'light' ? 'lightMode-link' : 'darkMode-link'}`} activeClassName="active-link" to="/careers">
                      {mode === 'light' ? <LightCareerIcon/> : <DarkCareerIcon/>}
                      <span>Careers</span>
                      </NavLink>
                  </Tooltip>
            </IconButton>

            <IconButton>
                  <Tooltip title="Explore Assessments" placement="bottom">
                    <NavLink id="sm-navLinks" className={`${mode === 'light' ? 'lightMode-link' : 'darkMode-link'}`} activeClassName="active-link" to="/assessments">
                      {mode === 'light' ? <LightAssessmentIcon/> : <DarkAssessmentIcon/>}
                      <span>Assessments</span>
                      </NavLink>
                  </Tooltip>
            </IconButton>
           

             

           

                  </Box>

                  <Divider />
                  { !jobListing && !isUser && !token
                   ? (
              <Box
              style={{marginTop:"10px", gap:"10px", display:"flex", justifyContent:"center", flexDirection:"column"}}
                sx={{
                  gap: 0.5,
                }}
              >
                <Button
                  color="primary"
                  variant="outlined"
                  size="small"
                  component="a"
                  href="/user-signIn"
                >
                  Sign in
                </Button>
                <Button
                  color="primary"
                  variant="contained"
                  size="small"
                  component="a"
                  href="/user-registration"
                >
                  Sign up
                </Button>
              </Box>) : (

                  <Box
                  style={{marginTop:"10px", gap:"10px", display:"flex", justifyContent:"center", flexDirection:"column", padding:"10px 0px"}}
                    sx={{
                      gap: 0.5,
                    }} >
                <Button
                  color="primary"
                  variant="contained"
                  size="small"
                  component="a"
                  onClick={handleSignOut}>
                  Sign Out
                </Button>
                </Box>

                )}
                </Box>
              </Drawer>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </div>
  );
}

AppAppBar.propTypes = {
  mode: PropTypes.oneOf(['dark', 'light']).isRequired,
  toggleColorMode: PropTypes.func.isRequired,
};

export default AppAppBar;