import React, { useEffect, useState } from 'react';
import { Box, Container, GlobalStyles } from '@mui/material';
import MainNav from './MainNav';
import SideNav from './SideNav';
import eventEmitter from '../../../Components/eventEmitter';

const Layout = ({ children, userProfile, onSignOut }) => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  useEffect(() => {
    const toggleNavHandler = () => {
      setIsNavOpen((prev) => !prev);
    };

    eventEmitter.on('toggleNav', toggleNavHandler);

    return () => {
      eventEmitter.off('toggleNav', toggleNavHandler);
    };
  }, []);

  const handleClickOutside = () => {
    if(isNavOpen===true){
      setIsNavOpen(false);
    }
  };

  
  return (
    <>
      <GlobalStyles
        styles={{
          body: {
            '--MainNav-height': '56px',
            '--MainNav-zIndex': 1000,
            '--SideNav-width': '280px',
            '--SideNav-zIndex': 1100,
            '--MobileNav-width': '320px',
            '--MobileNav-zIndex': 1100,
          },
        }}
      />

      <Box sx={{ display: 'flex', minHeight: "100vh", flexDirection: 'column', position: 'relative' }}>
        <SideNav isNavOpen={isNavOpen} />

        <Box sx={{ display: 'flex', flex: '1 1 auto', flexDirection: 'column', pl: { lg: 'var(--SideNav-width)' } }}>

          <main 
          onClick={handleClickOutside}
          >  

          <MainNav  userProfile={userProfile} onSignOut={onSignOut}  />
            <Container maxWidth="xl" sx={{ py: '64px', pt: '20px' }}>
              {children}
            </Container>
          </main>
        </Box>
      </Box>
    </>
  );
};

export default Layout;
