import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Box, Typography, List, ListItem, ListItemText, CircularProgress, Button, Snackbar, Alert, RadioGroup, FormControlLabel, Radio, Grid } from '@mui/material';
import './AdminPages/Dashboard/Dashboard.css';
import './AdminPages/Dashboard/Assessment.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import getLPTheme from './landing-page/getLPTheme';
import api from '../Api/Api';
import AssessmentResultDisplay from './AssessmentResultDisplay';

const TakeAssessment = ({ token, mode }) => {
  const { assessment_id } = useParams();
  const [assessment, setAssessment] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  console.log("🚀 ~ TakeAssessment ~ questions:", questions)
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const LPtheme = createTheme(getLPTheme(mode));
  const defaultTheme = createTheme({ palette: { mode } });
  const [showCustomTheme, setShowCustomTheme] = useState(true);


  const fetchAssessmentResult = async (assessment_id, token) => {
    try {
      const response = await api.get(`assessments/${assessment_id}/result`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("🚀 ~ fetchAssessmentResult ~ response:", response)
      setResult(response.data)
      return response.data;
    } catch (error) {
      console.error('Error fetching assessment result:', error);
      return null;
    }
  };
  useEffect(() => {
  fetchAssessmentResult(assessment_id, token);
}, [assessment_id, token]);





  const fetchQuestions = async (assessment_id, token) => {
    console.log("🚀 ~ fetchQuestions ~ assessment_id:", assessment_id)
    try {
      const response = await api.get(`assessments/${assessment_id}/questions`);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching questions:', error);
      throw error;
    }
  };

  // fetch details of assessment
  useEffect(() => {
    const fetchAssessmentDetails = async () => {
      try {
        const response = await api.get(`assessments/${assessment_id}`);
        const assessmentDetails = response?.data || [];
        setAssessment(assessmentDetails);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching assessment details:', error);
        setLoading(false);
      }
    };

    const fetchAssessmentQuestions = async () => {
      try {
        const questions = await fetchQuestions(assessment_id, token);
        setQuestions(questions);
      } catch (error) {
        console.error('Error fetching questions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessmentDetails();
    fetchAssessmentQuestions();
  }, [assessment_id, token]);

  const handleOptionChange = (question_id, option_id) => {
    setAnswers({
      ...answers,
      [question_id]: option_id,
    });
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length !== questions.length) {
      setSnackbarSeverity('warning');
      setSnackbarMessage('Please answer all questions before submitting.');
      setSnackbarOpen(true);
      return;
    }
    
    try {
      const response = await api.post(`assessments/${assessment_id}/submit`, { answers }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("🚀 ~ handleSubmit ~ response:", response.data)
      setResult(response.data);
      setSubmitted(true);
      setSnackbarSeverity('success');
      setSnackbarMessage('Assessment submitted successfully');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error submitting assessment:', error);

    let errorMessage = 'Failed to submit assessment';
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error response data:', error.response.data);
      errorMessage = error.response.data.message || errorMessage;
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Error request data:', error.request);
      errorMessage = 'Network error: Failed to submit assessment';
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error message:', error.message);
      errorMessage = error.message;
    }

    setSnackbarSeverity('error');
    setSnackbarMessage(errorMessage);
    setSnackbarOpen(true);
    }
  };





  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!assessment) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography variant="h6">No details available for this assessment.</Typography>
      </Box>
    );
  }


  if (submitted || result) {
    return (
      <ThemeProvider theme={showCustomTheme ? LPtheme : defaultTheme}>
        <Container style={{color:`${mode==='light'? 'black':'white'}`, paddingTop: "100px" }}>
          <Box sx={{ my: 4, textAlign: 'left' }}>
            <Typography  variant="h4" gutterBottom>
              Results of {assessment.assessment_type}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              {assessment.description}
            </Typography>
           <AssessmentResultDisplay result={result} mode={mode} questions={questions} />
          </Box>
        </Container>
      </ThemeProvider>
    );
  }


  return (
    <ThemeProvider theme={showCustomTheme ? LPtheme : defaultTheme}>
      <div className={`${mode === "light" ? "light-container" : "dark-container"}`} id="assessment-listing-page-container">
        <Container style={{ paddingTop: "100px" }}>
          <Box style={{color:`${mode==='light'? 'black':'white'}`}} sx={{ my: 4 }}>
            <Typography variant="h4" gutterBottom>
              {assessment.assessment_type}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              {assessment.description}
            </Typography>
            <List style={{ boxShadow: "0px 1px 2px 1px rgba(0, 0, 0, 0.08)", marginTop: "26px", borderTop: "1px solid #8080804a", padding: "0px", borderRadius: "5px" }}>
              {Array.isArray(questions) && questions?.map((question, index) => (
                <ListItem style={{ borderBottom: "1px solid #8080804a" }} key={index}>
                  <ListItemText
                    className='question-text'
                    primary=
                    {<Typography 
                      style={{fontSize:"1.1rem"}}
                      variant="subtitle1" gutterBottom>
                    {`Q${index + 1}: ${question.question_text}`}
                  </Typography>}
                  
                    secondary={
                      <RadioGroup
                        value={answers[question.question_id] || ''}
                        onChange={(e) => handleOptionChange(question.question_id, e.target.value)}
                      >
                        {Array.isArray(question.options) && question.options.map((option, i) => (
                          <FormControlLabel
                            key={i}
                            value={option.option_id}
                            control={<Radio />}
                            label={option.option_text}
                          />
                        ))}
                      </RadioGroup>
                    }
                  />
                </ListItem>
              ))}
            </List>
            <Grid container >
              {token ? (

            <Button
              style={{ marginTop: "20px", marginLeft:"auto"}}
              variant="contained"
              color="primary"
              onClick={handleSubmit}
            >
              Submit Assessment
            </Button>) :
            
            (<Button
              style={{ marginTop: "20px", marginLeft:"auto"}}
              variant="contained"
              color="primary"
              href='/user-signIn'
            >
              Sign in to submit assessment
            </Button>
              )}
            </Grid>
            {submitted && result && (
              <Box mt={4}>
                <Typography variant="h5" gutterBottom>
                  Assessment Results
                </Typography>
                <Typography variant="body1">
                  {result.analysis}
                </Typography>
              </Box>
            )}
          </Box>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={() => setSnackbarOpen(false)}
          >
            <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </Container>
      </div>
    </ThemeProvider>
  );
};

export default TakeAssessment;
