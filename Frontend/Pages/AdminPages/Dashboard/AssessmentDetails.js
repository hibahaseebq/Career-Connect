import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Snackbar,
  Alert,
  Checkbox,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import api from '../../../Api/Api'; // Adjust the path to your API utility
import './Assessment.css';
import './Dashboard.css';


const AssessmentDetails = ({mode}) => {
  const { assessment_id } = useParams();
  const [assessment, setAssessment] = useState(null);
  console.log("🚀 ~ AssessmentDetails ~ assessment:", assessment)
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(sessionStorage.getItem('token')); 
  const [editQuestion, setEditQuestion] = useState(null);
  console.log("🚀 ~ AssessmentDetails ~ editQuestion:", editQuestion)
  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    const storedToken = sessionStorage.getItem('token');
    setToken(storedToken); 
  }, []);


  const fetchQuestions = async (assessment_id, token) => {
    try {
      const response = await api.get(`/admin/assessments/${assessment_id}/questions`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
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
        const response = await api.get(`/admin/assessments/${assessment_id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
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

  

  const handleEdit = (question) => {
    setEditQuestion({ ...question });
    setOpen(true);
  };
 
// assessment questions
  const handleDelete = async (question_id) => {
    try {
     await api.delete(`/admin/assessments/${assessment_id}/questions/${question_id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setQuestions(questions.filter(q => q.question_id !== question_id));
      setSnackbarSeverity('success');
      setSnackbarMessage('Question deleted successfully');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error deleting question:', error);
      setSnackbarSeverity('error');
      setSnackbarMessage('Failed to delete question');
      setSnackbarOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEditQuestion(null);
  };
    console.log("🚀 ~ assessment_id ~ assessment_id:", assessment_id)


  
  const handleSave = async () => {
    if (!editQuestion.text || !editQuestion.options || editQuestion.options.length === 0) {
      setSnackbarSeverity('error');
      setSnackbarMessage('Question text and options cannot be empty.');
      setSnackbarOpen(true);
      return;
  }

  for (let option of editQuestion.options) {
      if (!option.option_text) {
          setSnackbarSeverity('error');
          setSnackbarMessage('Option text cannot be empty.');
          setSnackbarOpen(true);
          return;
      }
  }


    if (editQuestion.question_id) {
      // Update question
      try {
        const question_id = editQuestion.question_id;
        
const response = await api.put(`/admin/assessments/${assessment_id}/questions/${question_id}`, editQuestion, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

            console.log("🚀 ~ handleSave ~ response:", response)

       
            const updatedQuestion = response.data.question;
            setQuestions(questions.map(q => q.question_id === question_id ? updatedQuestion : q));
        setSnackbarSeverity('success');
        setSnackbarMessage('Question updated successfully');
        setSnackbarOpen(true);
      } catch (error) {
        console.error('Error updating question:', error);
        setSnackbarSeverity('error');
        setSnackbarMessage('Failed to update question');
        setSnackbarOpen(true);
      }
    } else {
      // Create new question
      try {
        const response = await api.post(`/admin/assessments/${assessment_id}/questions`, { ...editQuestion, assessment_id }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log("🚀 ~ handleSave ~ response:", response.data.question)

        const newQuestion = response.data.question;
        setQuestions([...questions, newQuestion]);
        setSnackbarSeverity('success');
        setSnackbarMessage('Question created successfully');
        setSnackbarOpen(true);
      } catch (error) {
        console.error('Error creating question:', error);
        setSnackbarSeverity('error');
        setSnackbarMessage('Failed to create question');
        setSnackbarOpen(true);
      }
    }
    handleClose();
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditQuestion({ ...editQuestion, [name]: value });
  };


  const handleCorrectOptionChange = (index) => {
    const newOptions = editQuestion.options.map((option, i) => ({
      ...option,
      is_correct: i === index
    }));
    setEditQuestion({ ...editQuestion, options: newOptions });
  };


  if (loading) {
    return <CircularProgress />;
  }

  if (!assessment) {
    return <Typography variant="h6">No details available for this assessment.</Typography>;
  }

  return (
    <Container className='admin-page-main-container'>
      <Box  sx={{ my: 4}}>
        <Typography variant="h4" gutterBottom>
          {assessment.assessment_type}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          {assessment.description}
        </Typography>
        <Button
        style={{marginTop:"16px"}}
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditQuestion({ text: '', options: [{ option_text: '', is_correct: false }, { option_text: '', is_correct: false }, { option_text: '', is_correct: false }, { option_text: '', is_correct: false }] });
            setOpen(true);
          }}
        >
          Add Question
        </Button>
        <List style={{boxShadow:"0px 1px 2px 1px rgba(0, 0, 0, 0.08)", marginTop:"26px", borderTop:"1px solid #8080804a", padding:"0px", borderRadius:"5px" }} >
          {Array.isArray(questions) && questions?.map((question, index) => (
            <ListItem style={{borderBottom:"1px solid #8080804a"}} key={index}>
              <ListItemText
              className='question-text'
                primary={`Q${index + 1}: ${question.question_text}`}
                secondary={Array.isArray(question.options) && question.options.map((option, i) => (
                  <div className={`${option.is_correct ? 'correct-option' : 'not-correct'}`} key={i}>{`${String.fromCharCode(65 + i)}. ${option.option_text} ${option.is_correct ? '(Correct)' : ''}`}</div>
                ))}
              />
              <IconButton onClick={() => handleEdit(question)}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => handleDelete(question.question_id)}>
                <DeleteIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>
      </Box>

      <Dialog open={open} onClose={handleClose} fullWidth={true} maxWidth="sm">
    <DialogTitle>{editQuestion && editQuestion.question_id ? 'Edit Question' : 'Add Question'}</DialogTitle>
    <DialogContent>
        <TextField
            autoFocus
            margin="dense"
            name="text"
            label="Question Text"
            type="text"
            fullWidth
            multiline
            value={editQuestion ? editQuestion.text : ''}
            onChange={handleChange}
        />
        <FormControl component="fieldset">
            <RadioGroup
              value={editQuestion?.options?.findIndex(option => option.is_correct)}
              onChange={(e) => handleCorrectOptionChange(Number(e.target.value))}
            >
              {editQuestion && editQuestion.options && editQuestion.options.map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={index}
                  control={<Radio />}
                  label={
                    <TextField
                      margin="dense"
                      name={`option${index}`}
                      label={`Option ${String.fromCharCode(65 + index)}`}
                      type="text"
                      fullWidth
                      value={option.option_text}
                      onChange={(e) => {
                        const newOptions = [...editQuestion.options];
                        newOptions[index].option_text = e.target.value;
                        setEditQuestion({ ...editQuestion, options: newOptions });
                      }}
                    />
                  }
                />
              ))}
            </RadioGroup>
          </FormControl>
    </DialogContent>
    <DialogActions>
        <Button onClick={handleClose} color="primary">
            Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
            Save
        </Button>
    </DialogActions>
</Dialog>


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
  );
};

export default AssessmentDetails;
