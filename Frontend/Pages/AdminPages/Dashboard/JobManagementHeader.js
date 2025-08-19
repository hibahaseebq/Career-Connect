import { Box, Button, Container } from '@mui/material'
import React, {useEffect, useState} from 'react'
import { useNavigate, useLocation  } from 'react-router-dom';
import { paths } from '../Paths';


const JobManagementHeader = ({mode}) => {

  const [activeButton, setActiveButton] = useState('job-list');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === `/admin/${paths.dashboard.job}`) {
      setActiveButton('job-list');
    } else if (location.pathname === `/admin/${paths.dashboard.job}/requests`) {
      setActiveButton('requests');
    }
  }, [location.pathname]);

  const handleButtonClick = (button) => {
    setActiveButton(button);
    if (button === 'job-list') {
      navigate(`/admin/${paths.dashboard.job}`);
    } else if (button === 'requests') {
      navigate(`/admin/${paths.dashboard.job}/requests`);
    }
  };
  return (

    <Container style={{marginTop:"32px"}} className='admin-page-main-container'>
    <div style={{ width: '100%', margin: '0 auto' }}>
      
      <Box
        display="flex"
      bgcolor={'#121621'}
        borderRadius={'6px'}
        padding={'20px'}
        gap={1.5}
        justifyContent="left"
      >
        <Button
          variant={mode === 'light' ? 'outlined' : 'contained'}
          size="small"
          onClick={() => handleButtonClick('job-list')}
          sx={{
            bgcolor:
              activeButton === 'job-list'
                ? mode === 'light'
                  ? 'primary.light'
                  : 'primary.dark'
                : mode === 'light'
                ? 'third.light'
                : 'gray',
            color:
              activeButton === 'job-list'
                ? mode === 'light'
                  ? 'white'
                  : 'light'
                : mode === 'light'
                ? 'primary.main'
                : 'light',
            '&:hover': {
              bgcolor: mode === 'light' ? 'primary.light' : 'primary.dark',
            },
          }}
        >
          Job Lists
        </Button>
        <Button
          variant={mode === 'light' ? 'outlined' : 'contained'}
          size="small"
          onClick={() => handleButtonClick('requests')}
          sx={{
            bgcolor:
              activeButton === 'requests'
                ? mode === 'light'
                  ? 'primary.light'
                  : 'primary.dark'
                : mode === 'light'
                ? 'third.light'
                : 'gray',
            color:
              activeButton === 'requests'
                ? mode === 'light'
                  ? 'white'
                  : 'light'
                : mode === 'light'
                ? 'primary.main'
                : 'light',
            '&:hover': {
              bgcolor: mode === 'light' ? 'primary.light' : 'primary.dark',
            },
          }}
        >
          Job Requests
        </Button>
        
      </Box>
    </div>
</Container>
  )
}

export default JobManagementHeader;