// jobRoutes.js
const express = require('express');
const router = express.Router();
const {job} = require('../Controllers/index');
const {CareerRecommendation} = require('../Controllers/index');

router.post('/create', job.createJob);
router.put('/update/:jobId', job.updateJob);
router.get('/get/byId/:jobId', job.getJob);
router.get('/get/allJob', job.getAllJobs);
router.get('/get/allJobByUser/:userId', job.getUserJobPosts);
router.delete('/delete/:jobId', job.deleteJob);
router.get('/options', job.getJobOptions);
router.get('/career-recommendations', CareerRecommendation.getCareerRecommendations);

module.exports = router;
