// adminRoutes.js
const express = require('express');
const router = express.Router();
const {user} = require('../../Controllers/index');
const {Assessment} = require('../../Controllers/index');
const {forum} = require('../../Controllers/index');
const {CareerRecommendation} = require('../../Controllers/index');
const {ResourceController} = require('../../Controllers/index');
const {profile} = require('../../Controllers/index');
const {job} = require('../../Controllers/index');


// user routes
router.get('/admin-get-users', user.AdminGetAllUsers);
router.post('/admin-update-user', user.AdminUpdateUser);
router.delete('/admin-delete-user/:userId', user.AdminDeleteUser);


// Routes for assessment routes
router.get('/assessments', Assessment.getAssessments);
router.get('/assessments/:assessment_id', Assessment.getAssessmentsById);
router.post('/assessments', Assessment.createAssessment);
router.post('/assessments/:assessment_id', Assessment.updateAssessment);
router.delete('/assessments/:assessment_id', Assessment.deleteAssessment);

// Routes for Question of assessments routes
router.get('/assessments/:assessment_id/questions', Assessment.getQuestions);
router.get('/assessments/:assessment_id/questions/:question_id', Assessment.getQuestionById);
router.post('/assessments/:assessment_id/questions', Assessment.createQuestion);
router.put('/assessments/:assessment_id/questions/:question_id', Assessment.updateQuestion);
router.delete('/assessments/:assessment_id/questions/:question_id', Assessment.deleteQuestion);


// Routes for admin forum moderation route
router.delete('/posts/:post_id', forum.deletePost);
router.delete('/replies/:reply_id', forum.deleteReply);

// Routes for career management
router.get('/career-recommendations', CareerRecommendation.getCareerRecommendations);
router.get('/career-recommendations/:career_id', CareerRecommendation.getCareerRecommendationById);
router.post('/career-recommendations', CareerRecommendation.createCareerRecommendation);
router.put('/career-recommendations/:career_id', CareerRecommendation.updateCareerRecommendation);
router.delete('/career-recommendations/:career_id', CareerRecommendation.deleteCareerRecommendation);


// Routes for Resources of career management
router.get('/career-recommendations/:career_id/resources', ResourceController.getResources);
router.get('/career-recommendations/:career_id/resources/:resource_id', ResourceController.getResourceById);
router.post('/career-recommendations/:career_id/resources', ResourceController.addCourseResource);
router.put('/career-recommendations/:career_id/resources/:resource_id', ResourceController.updateCourseResource);
router.delete('/career-recommendations/:career_id/resources/:resource_id', ResourceController.deleteCourseResource);

router.get('/profile', profile.getProfileByAdmin);
router.get('/main-nav-profile', profile.getMainNavProfileByAdmin);
router.put('/profile/update', profile.updateProfile);


// jobs
router.get('/get/allJob/requests', job.getAllJobsRequests);
router.get('/get/allJob/accepted', job.getAdminAllAcceptedJobs);
router.post('/action-on-job/:jobId', job.adminActionOnJobs);



module.exports = router;
