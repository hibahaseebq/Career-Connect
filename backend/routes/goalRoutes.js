const express = require('express');
const router = express.Router();
const GoalsController = require('../controllers/GoalsController.js');
const {validateGoal, validateProgress} = require('../middleware/validationMiddleware');

router.get('/goals', GoalsController.getAllGoals);
router.post('/goals', validateGoal, GoalsController.createGoal);
router.get('/goals/:goalId/progress', GoalsController.getGoalProgress);


router.post('/progress', validateProgress, GoalsController.createProgress);

module.exports = router;