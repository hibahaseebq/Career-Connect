const dbConfig = require('../config/db');
const Sequelize = require('sequelize');

const sequelize = new Sequelize(
  dbConfig.DATABASE,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    HOST: dbConfig.HOST, 
    dialect: dbConfig.DIALECT
  });

const db = {};
db.sequelize = sequelize;

db.models = {};
db.models.User = require('./UserModel')(sequelize, Sequelize.DataTypes, db.models);
// db.models.UserPreferences = require('./UserPreferencesModel')(sequelize, Sequelize.DataTypes, db.models);

db.models.Profile = require('./profileModel')(sequelize, Sequelize.DataTypes, db.models);
db.models.UserConnection = require('./UserConnectionModel')(sequelize, Sequelize.DataTypes, db.models);
db.models.Roles = require('./RolesModel')(sequelize, Sequelize.DataTypes, db.models);


db.models.ForumPost = require('./ForumPostModel')(sequelize, Sequelize.DataTypes, db.models);
db.models.ForumReply = require('./ForumReplyModel')(sequelize, Sequelize.DataTypes, db.models);
db.models.Consultation = require('./ConsultationModel')(sequelize, Sequelize.DataTypes, db.models);

db.models.Assessment = require('./AssessmentModel')(sequelize, Sequelize.DataTypes, db.models);
db.models.AssessmentOption = require('./AssessmentOptionModel')(sequelize, Sequelize.DataTypes, db.models);
db.models.AssessmentQuestion = require('./AssessmentQuestionModel')(sequelize, Sequelize.DataTypes, db.models);
db.models.AssessmentResult = require('./AssessmentResultModel')(sequelize, Sequelize.DataTypes, db.models);


db.models.CourseResourceModel = require('./CourseResourceModel')(sequelize, Sequelize.DataTypes, db.models);
db.models.CareerRecommendationModel = require('./CareerRecommendationModel')(sequelize, Sequelize.DataTypes, db.models);
db.models.Job = require('./JobModel')(sequelize, Sequelize.DataTypes, db.models);
db.models.ResultRecommendationModel = require('./ResultRecommendationModel')(sequelize, Sequelize.DataTypes, db.models);
db.models.CareerRecommendationAssessment = require('./CareerRecommendationAssessment')(sequelize, Sequelize.DataTypes, db.models);

// messages 
db.models.Message = require('./MessageModel')(sequelize, Sequelize.DataTypes, db.models);
db.models.Conversation = require('./ConversationModel')(sequelize, Sequelize.DataTypes, db.models);


// set Goals
db.models.Goal = require('./GoalModel')(sequelize, Sequelize.DataTypes, db.models);
db.models.Progress = require('./ProgressModel')(sequelize, Sequelize.DataTypes, db.models);

module.exports = db;
