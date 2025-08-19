import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Alert, IconButton, Link, Snackbar, TextField, Typography, Grid, Box, Container, Grow, Slide } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Api from '../../Api/Api';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../../Components/Loader';
import CloseIcon from '@mui/icons-material/Close';
import { jwtDecode } from "jwt-decode";
import eventEmitter from '../../Components/eventEmitter';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    h5: {
      fontWeight: 600,
    },
  },
});
function SignIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await Api.post('users/signin', formData);
      if (response.status === 200) {
        const { token } = response?.data;
        sessionStorage.setItem('token', token);
         eventEmitter.emit('tokenChange', token);
        const TargetRedirectUrl = sessionStorage.getItem('redirectUrl');
        

        let tokenUserId = null
        if (token){
          tokenUserId = jwtDecode(token).userId; 
        }


        if (TargetRedirectUrl) {
          navigate(TargetRedirectUrl);
          navigate(TargetRedirectUrl, { state: { token } });
          sessionStorage.removeItem('redirectUrl');
        } else {
          navigate(`/profile/${tokenUserId}`);
        }
      } else {
        setSnackbarMessage('Unsuccessful login. Please try again.');
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarOpen(true);
      setSnackbarMessage(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Grow in>
          <Box sx={{ marginTop: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in to Career Connect
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <Slide direction="up" in timeout={500}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  onChange={handleChange}
                />
              </Slide>
              <Slide direction="up" in timeout={600}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  onChange={handleChange}
                />
              </Slide>
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, minHeight: "40px" }}
              >
                {!loading ? 'Sign In' : <Loader style={{ height: "100%" }} color="white" />}
              </Button>
              <Grid container>
                <Grid style={{ display: "flex", justifyContent: "center", width: "100%" }} item>
                  <Link href="/user-registration" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grow>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          message={snackbarMessage}
          action={
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleCloseSnackbar}>
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        />
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 8, mb: 4 }}>
          {'Career Connect is your gateway to a brighter future. '}
          {'Connecting professionals with opportunities.'}
          <br />
          {'Copyright © '}
          <Link color="inherit" href="#">
            CareerConnect
          </Link>
          {' '}
          {new Date().getFullYear()}
          {'.'}
        </Typography>
      </Container>
    </ThemeProvider>
  );
}

export default SignIn;