import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Button, Container, Grid } from '@mui/material';

const NotFound = () => {
  return (
    <Container maxWidth="sm">
      <Grid container spacing={2} justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
        <Grid item xs={12} textAlign="center">
          <Typography variant="h1" color="primary" gutterBottom>
            Oops!
          </Typography>
          <Typography variant="h2" color="textPrimary" gutterBottom>
            404 Not Found
          </Typography>
          <Typography variant="body1" color="textSecondary" paragraph>
            The requested page was not found.
          </Typography>
          <Button variant="contained" color="primary" component={Link} to="/">
            Go Home
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default NotFound;
