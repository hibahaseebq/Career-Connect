import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Box, Divider, Stack, Typography } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import PeopleIcon from '@mui/icons-material/People';
import Forum from '@mui/icons-material/Forum';
import WorkIcon from '@mui/icons-material/Work';
import SettingsIcon from '@mui/icons-material/Settings';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { paths } from '../Paths';
import './layout.css';
import BrandLogo from '../../../Components/jobConnectLogo.png'
import CareerIcon from '@mui/icons-material/BusinessCenter';
import ResourceIcon from '@mui/icons-material/LibraryBooks';
import People from '@mui/icons-material/People';
import eventEmitter from '../../../Components/eventEmitter';

const logoStyle = {
  width: '65%',
  height: 'auto',
};



const navItems = [
  { key: 'overview', title: 'Overview', href: paths.dashboard.overview, icon: HomeIcon },
  { key: 'account', title: 'Manage Users', href: paths.dashboard.account, icon: PersonIcon },
  { key: 'assessmentManagement', title: 'Assessment Management', href: paths.dashboard.assessmentManagement, icon: WorkIcon },
  { key: 'careerRecommendations', title: 'Career Recommendations', href: paths.dashboard.careerRecommendations, icon: CareerIcon },
  // { key: 'courseResources', title: 'Course Resources', href: paths.dashboard.courseResources, icon: ResourceIcon },
  { key: 'job', title: 'Jobs Management', href: paths.dashboard.job, icon: WorkIcon },
  { key: 'forum', title: 'Forum Management', href: paths.dashboard.forum, icon: Forum },
  { key: 'profile', title: 'Profile Management', href: paths.dashboard.profile, icon: People },
];

const SideNav = ({ isNavOpen }) => {
  console.log("🚀 ~ SideNav ~ isNavOpen:", isNavOpen)
  const location = useLocation();

  const isNavItemActive = (href) => {
    let cleanedPathname = location?.pathname?.replace(/^\/+/, '');
    let cleanedHref = href?.replace(/^\/+/, '');
    
    if (cleanedPathname?.startsWith('admin/')) {
        cleanedPathname = cleanedPathname?.replace(/^admin\//, '');
    }
    
    if (cleanedHref?.startsWith('admin/')) {
        cleanedHref = cleanedHref?.replace(/^admin\//, '');
    }
    if (cleanedHref === '') {
      cleanedHref = 'admin';
    }
    return cleanedPathname === cleanedHref;
};

  return (
    <Box
    className={`side-nav ${isNavOpen ? 'open' : 'close'}`}
      sx={{
        backgroundColor: '#121621',
        color: '#ffffff',
        display: { xs: isNavOpen ? 'flex' : 'none', lg: 'flex' },
        flexDirection: 'column',
        height: '100vh',
        left: 0,
        maxWidth: '100%',
        position: 'fixed',
        top: 0,
        width: '280px',
        zIndex: 1100,
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      <Stack spacing={2} sx={{ p: 3 }}>
        <Box component={Link} to="/admin" sx={{ display: 'inline-flex' }}>
             <Box >
                <img
                  src={BrandLogo}
                  style={logoStyle}
                  alt="logo of sitemark"
                />
              </Box>
        </Box>
        <Box
          sx={{
            alignItems: 'center',
            backgroundColor: '#121621',
            border: '1px solid #707070',
            borderRadius: '12px',
            cursor: 'pointer',
            display: 'flex',
            p: '4px 12px',
          }}
        >
          <Box sx={{ flex: '1 1 auto' }}>
            <Typography color="#b3b9c6" variant="body2">
              Admin Panel
            </Typography>
            <Typography color="inherit" variant="subtitle1">
              Career Connect
            </Typography>
          </Box>
          <ExpandMoreIcon />
        </Box>
      </Stack>
      <Divider sx={{ borderColor: '#707070' }} />
      <Box component="nav" sx={{ flex: '1 1 auto', p: '12px', display: "flex", flexDirection: "column", gap: "8px" }}>
        {navItems.map((item) => (
          <NavItem
            key={item.key}
            href={item.href}
            title={item.title}
            icon={item.icon}
            active={isNavItemActive(item.href)}
          />
        ))}
      </Box>
      <Divider sx={{ borderColor: '#707070' }} />
    </Box>
  );
};

const NavItem = ({ href, icon: Icon, title, active }) => {
  return (
    <li style={{ listStyle: "none" }}>
      <Box
className={`nav-item ${active ? 'active' : ''}`}
        component={Link}
        to={href}
        sx={{
          alignItems: 'center',
          borderRadius: 1,
          color: '#b3b9c6',
          cursor: 'pointer',
          display: 'flex',
          gap: 1,
          p: '6px 16px',
          position: 'relative',
          textDecoration: 'none',
          whiteSpace: 'nowrap',
         
        }}
      >
        <Box sx={{ alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
          {Icon ? <Icon style={{fontSize:"1.2rem"}} /> : null}
        </Box>
        <Box sx={{ flex: '1 1 auto' }}>
          <Typography
            component="span"
            sx={{ color: 'inherit', fontSize: '0.875rem', fontWeight: 500, lineHeight: '28px' }}
          >
            {title}
          </Typography>
        </Box>
      </Box>
    </li>
  );
};

export default SideNav;
