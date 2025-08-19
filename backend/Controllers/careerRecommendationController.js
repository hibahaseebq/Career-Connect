const {models: {CareerRecommendationModel, CourseResourceModel, CareerRecommendationAssessment, AssessmentResult}, sequelize} = require('../models');
const JWT_SECRET='e67e1b471d09e2ce28955d6cf510fa3c10115079dbf51d945a21cbdfce271552';
const jwt = require('jsonwebtoken');
// Controller methods
exports.getCareerRecommendations = async (req, res) => {
  try {
    const careers = await CareerRecommendationModel.findAll();
    res.status(200).json(careers);
  } catch (error) {
    console.error('Error fetching career recommendations:', error);
    res.status(500).json({message: 'Internal server error'});
  }
};

// Controller method to get recommended careers for a user
exports.getRecommendedCareers = async (req, res) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.status(401).send('Unauthorized - No token provided');
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    // Fetch the user's assessment results
    const assessmentResults = await AssessmentResult.findAll({
      where: {userId},
      attributes: ['assessment_id', 'score']
    });

    if (!assessmentResults || assessmentResults.length === 0) {
      return res.status(404).json({message: 'No assessment results found for user'});
    }

    // Prepare a map of assessment results
    const userScores = {};
    assessmentResults.forEach(result => {
      userScores[result.assessment_id] = parseFloat(result.score);
    });
    console.log('🚀 ~ exports.getRecommendedCareers= ~ assessmentResults:', assessmentResults);

    // Fetch all career recommendations with associated assessments using a raw SQL query
    const careers = await sequelize.query(
      `SELECT 
           cr.career_id, 
           cr.career_name, 
           cr.description, 
           cr.required_skills, 
           cr.created_at, 
           cr.min_score, 
           cr.max_score, 
           cra.assessment_id
       FROM career_recommendations cr
       JOIN career_recommendation_assessment cra ON cr.career_id = cra.career_id
       ORDER BY cr.career_name`,
      {
        type: sequelize.QueryTypes.SELECT
      }
    );

    console.log('🚀 ~ exports.getRecommendedCareers= ~ careers:', careers);


    // Group the careers by career_id
    const careerMap = {};
    careers.forEach(career => {
      if (!careerMap[career.career_id]) {
        careerMap[career.career_id] = {
          career_id: career.career_id,
          career_name: career.career_name,
          description: career.description,
          required_skills: career.required_skills,
          created_at: career.created_at,
          assessments: []
        };
      }
      careerMap[career.career_id].assessments.push({
        assessment_id: career.assessment_id,
        min_score: career.min_score,
        max_score: career.max_score
      });
    });



    // Convert careerMap to an array
    const careerArray = Object.values(careerMap);

    // Filter careers based on user scores
    const recommendedCareers = careerArray.filter(career => {
      return career.assessments.every(assessment => {
        const userScore = userScores[assessment.assessment_id];
        
        return userScore !== undefined && userScore >= assessment.min_score && userScore <= assessment.max_score;
      });
    });

    res.status(200).json(
      recommendedCareers
    );
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      res.status(401).json({message: 'Unauthorized - Invalid token'});
    } else if (error.name === 'TokenExpiredError') {
      res.status(401).json({message: 'Unauthorized - Token expired'});
    } else {
      console.error('Error fetching career recommendations:', error);
      res.status(500).json({message: 'Internal server error'});
    }
  }
};



exports.getCareerRecommendationById = async (req, res) => {
  const {career_id} = req.params;
  try {
    const career = await CareerRecommendationModel.findByPk(career_id);
    console.log(career);
    if (!career) {
      return res.status(404).json({message: 'Career recommendation not found'});
    }

    

    // Fetch associated assessments
    const assessmentsQuery = `
     SELECT a.assessment_id, a.assessment_type, a.description, a.created_at
     FROM assessments a
     JOIN career_recommendation_assessment cra ON a.assessment_id = cra.assessment_id
     WHERE cra.career_id = :career_id
   `;
    const assessments = await sequelize.query(assessmentsQuery, {
      replacements: {career_id},
      type: sequelize.QueryTypes.SELECT
    });
    console.log('🚀 ~ exports.getCareerRecommendationById= ~ assessments:', assessments);

    res.status(200).json({career, assessments});
  } catch (error) {
    console.error('Error fetching career recommendation:', error);
    res.status(500).json({message: 'Internal server error'});
  }
};

exports.createCareerRecommendation = async (req, res) => {
  const {career_name, description, required_skills, min_score, max_score} = req.body;
  console.log('🚀 ~ exports.createCareerRecommendation= ~ req.body:', req.body);
  try {
    const newCareer = await CareerRecommendationModel.create({career_name, description, required_skills});
    res.status(201).json({message: 'Career recommendation created successfully', career: newCareer});
  } catch (error) {
    console.error('Error creating career recommendation:', error);
    res.status(500).json({message: 'Internal server error'});
  }
};

exports.updateCareerRecommendation = async (req, res) => {
  const {career_id} = req.params;
  const {career_name, description, required_skills, min_score, max_score, assessments} = req.body;
  
  try {
    const career = await CareerRecommendationModel.findByPk(career_id);

    if (!career) {
      return res.status(404).json({message: 'Career recommendation not found'});
    }

    career.career_name = career_name;
    career.description = description;
    career.required_skills = required_skills;
    career.min_score = min_score;
    career.max_score = max_score;

    await career.save();

    // Update associated assessments
    await CareerRecommendationAssessment.destroy({
      where: {career_id}});

    if (assessments && Array.isArray(assessments)) {
      const careerAssessmentData = assessments.map(assessment_id => ({
        career_id,
        assessment_id
      }));
      await CareerRecommendationAssessment.bulkCreate(careerAssessmentData);
    }

    res.status(200).json({message: 'Career recommendation updated successfully', career});
  } catch (error) {
    console.error('Error updating career recommendation:', error);
    res.status(500).json({message: 'Internal server error'});
  }
};

exports.deleteCareerRecommendation = async (req, res) => {
  const {career_id} = req.params;
  try {
    // Start a transaction
    await sequelize.transaction(async (t) => {
      // Delete associated resources first
      await CourseResourceModel.destroy({where: {career_id}}, {transaction: t});
      
      // Delete the career recommendation
      await CareerRecommendationModel.destroy({where: {career_id}}, {transaction: t});
    });

    res.status(200).json({message: 'Career recommendation and associated resources deleted successfully'});
  } catch (error) {
    console.error('Error deleting career recommendation and associated resources:', error);
    res.status(500).json({message: 'Internal server error'});
  }
};

