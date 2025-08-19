// Home.js
import React from 'react';
import { Typography, Button, Grid, Card, CardContent, CardMedia } from '@mui/material';
// import AnimatedBackground from '../Components/AnimatedBackground';
import LandingPage from './landing-page/LandingPage';

function Home({mode}) {
    const userName = ""; 
  
    return (
       <LandingPage mode={mode} />
    );
  }
  
  export default Home;