// CareerRoutes.js
const express = require('express');
const router = express.Router();
const {CareerRecommendation} = require('../Controllers/index');
const {ResourceController} = require('../Controllers/index');




router.get('/get-all-careers', CareerRecommendation.getCareerRecommendations);
router.get('/get-all-careers/recommended', CareerRecommendation.getRecommendedCareers);
router.get('/:career_id', CareerRecommendation.getCareerRecommendationById);
router.get('/:career_id/resources', ResourceController.getResources);




module.exports = router;