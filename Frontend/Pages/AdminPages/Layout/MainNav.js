import React from 'react';
import { AppBar, Stack, IconButton, Avatar, Tooltip, Button, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { usePopover } from './usePopover';
import eventEmitter from '../../../Components/eventEmitter';

const MainNav = ({ userProfile, onSignOut }) => {
  const userPopover = usePopover();

  const handleToggleNav = () => {
    eventEmitter.emit('toggleNav');
  };

  return (
    <AppBar position='static' className='main-nav' sx={{ zIndex: 2, boxShadow: "none", borderBottom: "1px solid #dcdfe4", backgroundColor: "white" }}>
      <Stack
        direction="row"
        spacing={2}
        sx={{ display: "flex", alignItems: 'center', justifyContent: 'space-between', minHeight: '64px', px: 2 }}
      >
        <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
          <IconButton
            onClick={handleToggleNav}
            sx={{ display: { lg: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          {/* <Tooltip title="Search">
            <IconButton>
              <SearchIcon />
            </IconButton>
          </Tooltip> */}

          {userProfile && (
          <Typography variant="h6"
          fontWeight={"bold"}
          fontSize={"18px"}
          mb={0} style={{color:"black"}}>{userProfile?.first_name} {userProfile?.last_name}</Typography>
          )}
          
        </Stack>

        <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
          {/* <Tooltip title="Contacts">
            <IconButton>
              <PeopleIcon />
            </IconButton>
          </Tooltip> */}
   
          
          {userProfile && (
            <>
           
          <Tooltip title="your profile">
          <Avatar
            src={userProfile?.avatarURL} sx={{ cursor: 'pointer' }} 
            ref={userPopover.anchorRef}
            onClick={() => window.location.href = '/admin/profile/profile_id'}
          />
          </Tooltip>
          <Button onClick={onSignOut} variant="contained" color="secondary">Sign Out</Button>
            </>
          )}
        </Stack>
      </Stack>
    </AppBar>
  );
};

export default MainNav;
