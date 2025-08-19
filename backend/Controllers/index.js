// /Controller/index.js
const controllers = {};
controllers.user = require('./userController');
controllers.profileDetails = require('./userController');
controllers.verifyEmail = require('./userController');
controllers.deleteUser = require('./userController');


controllers.job = require('./jobController');
controllers.profile = require('./profileController');
controllers.people = require('./peopleController');
controllers.Assessment = require('./assessmentController');
controllers.forum = require('./ForumController');
controllers.CareerRecommendation = require('./careerRecommendationController');
controllers.ResourceController = require('./courseResourceController');
controllers.MessagesController = require('./MessagesController');




// Add notificationController
// controllers.notification = require('./notificationController');


module.exports = controllers;