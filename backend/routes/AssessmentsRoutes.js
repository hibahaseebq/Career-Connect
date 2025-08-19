// CareerRoutes.js
const express = require('express');
const router = express.Router();
const {Assessment} = require('../Controllers/index');


router.get('/:assessment_id/result', Assessment.AssessmentResult);


router.get('/get-all-assessments', Assessment.getAssessments);
router.get('/:assessment_id', Assessment.getAssessmentsById);
router.get('/:assessment_id/questions', Assessment.getQuestions);
router.get('/:assessment_id/questions/:question_id', Assessment.getQuestionById);

// submission of assessment 
router.post('/:assessment_id/submit', Assessment.submitAssessment);


module.exports = router;