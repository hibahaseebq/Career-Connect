// const {Assessment} = require('../models');
// const {AssessmentQuestion} = require('../models');
// const {AssessmentOption} = require('../models');
// const {AssessmentResult} = require('../models');
const {models: {AssessmentResult, Assessment, AssessmentQuestion, AssessmentOption}} = require('../models');
const jwt = require('jsonwebtoken');
const JWT_SECRET='e67e1b471d09e2ce28955d6cf510fa3c10115079dbf51d945a21cbdfce271552';



const sequelize = require('../models').sequelize;


const getQuestionsWithOptions = async (assessment_id) => {
  const results = await sequelize.query(
    `SELECT 
          q.question_id, 
          q.question_text, 
          o.option_id, 
          o.option_text, 
          o.is_correct 
      FROM assessment_questions q
      LEFT JOIN assessment_options o ON q.question_id = o.question_id
      WHERE q.assessment_id = ?`,
    {replacements: [assessment_id], type: sequelize.QueryTypes.SELECT}
  );

  // Process results to group options under questions
  const questions = [];
  const questionMap = {};

  results.forEach(row => {
    if (!questionMap[row.question_id]) {
      questionMap[row.question_id] = {
        question_id: row.question_id,
        question_text: row.question_text,
        options: []
      };
      questions.push(questionMap[row.question_id]);
    }

    if (row.option_id) {
      questionMap[row.question_id].options.push({
        option_id: row.option_id,
        option_text: row.option_text,
        is_correct: row.is_correct
      });
    }
  });

  return questions;
};



module.exports = {
  getAssessments: async (req, res) => {
    try {
      const assessments = await sequelize.query(
        `SELECT *
        FROM assessments`,
        {
          type: sequelize.QueryTypes.SELECT
        }
      );
      res.status(200).json(assessments);
    } catch (error) {
      console.error('Error fetching assessments:', error);
      res.status(500).json({message: 'Internal server error'});
    }
  },

  getAssessmentsById: async (req, res) => {
    try {
      const {assessment_id} = req.params;
      console.log('🚀 ~ getAssessmentsById: ~ assessment_id:', assessment_id);
      const assessments = await sequelize.query(
        `SELECT * FROM assessments WHERE assessment_id = ${assessment_id}`,
        {
          replacements: {assessment_id},
          type: sequelize.QueryTypes.SELECT
        }
      );
      console.log('🚀 ~ getAssessmentsById: ~ assessments:', assessments);
      if (assessments.length === 0) {
        return res.status(404).json({message: 'Assessment not found'});
      }
      res.status(200).json(assessments[0]);
    } catch (error) {
      console.error('Error fetching assessments:', error);
      res.status(500).json({message: 'Internal server error'});
    }
  },

  createAssessment: async (req, res) => {
    const {assessment_type, description} = req.body;
    try {
      const newAssessment = await sequelize.query(
        'INSERT INTO assessments (assessment_type, description, created_at) VALUES (?, ?, NOW())',
        {
          replacements: [assessment_type, description],
          type: sequelize.QueryTypes.INSERT
        }
      );
      res.status(201).json({message: 'Assessment created successfully', assessment: newAssessment});
    } catch (error) {
      console.error('Error creating assessment:', error);
      res.status(500).json({message: 'Internal server error'});
    }
  },

  updateAssessment: async (req, res) => {
    const {assessment_id} = req.params;
    const {assessment_type, description} = req.body;

    try {
      const [results] = await sequelize.query(
        'SELECT * FROM assessments WHERE assessment_id = ?',
        {replacements: [assessment_id], type: sequelize.QueryTypes.SELECT}
      );

      if (results.length === 0) {
        return res.status(404).json({message: 'Assessment not found'});
      }

      await sequelize.query(
        'UPDATE assessments SET assessment_type = ?, description = ? WHERE assessment_id = ?',
        {replacements: [assessment_type, description, assessment_id], type: sequelize.QueryTypes.UPDATE}
      );

      const [updatedAssessment] = await sequelize.query(
        'SELECT * FROM assessments WHERE assessment_id = ?',
        {replacements: [assessment_id], type: sequelize.QueryTypes.SELECT}
      );

      res.status(200).json({message: 'Assessment updated successfully', assessment: updatedAssessment});
    } catch (error) {
      console.error('Error updating assessment:', error);
      res.status(500).json({message: 'Internal server error'});
    }
  },

  deleteAssessment: async (req, res) => {
    const {assessment_id} = req.params;
    let transaction;
  
    try {
      // Start a transaction
      transaction = await sequelize.transaction();
  
      const [results] = await sequelize.query(
        'SELECT * FROM assessments WHERE assessment_id = ?',
        {replacements: [assessment_id], type: sequelize.QueryTypes.SELECT, transaction}
      );
  
      if (results.length === 0) {
        if (transaction) {await transaction.rollback()}

        return res.status(404).json({message: 'Assessment not found'});
      }
  
      // Delete all options related to questions of the assessment
      await sequelize.query(
        `DELETE ao FROM assessment_options ao
         JOIN assessment_questions aq ON ao.question_id = aq.question_id
         WHERE aq.assessment_id = ?`,
        {replacements: [assessment_id], type: sequelize.QueryTypes.DELETE, transaction}
      );
  
      // Delete all questions related to the assessment
      await sequelize.query(
        'DELETE FROM assessment_questions WHERE assessment_id = ?',
        {replacements: [assessment_id], type: sequelize.QueryTypes.DELETE, transaction}
      );
  
      // Delete the assessment
      await sequelize.query(
        'DELETE FROM assessments WHERE assessment_id = ?',
        {replacements: [assessment_id], type: sequelize.QueryTypes.DELETE, transaction}
      );
  
      // Commit the transaction
      await transaction.commit();
  
      res.status(200).json({message: 'Assessment deleted successfully'});
    } catch (error) {
      // If any error occurs, rollback the transaction
      if (transaction) {await transaction.rollback()}
      console.error('Error deleting assessment:', error);
      res.status(500).json({message: 'Internal server error'});
    }
  },

  // Question-related functions
  
  getQuestions: async (req, res) => {
    const {assessment_id} = req.params;
    try {
      const questions = await getQuestionsWithOptions(assessment_id);
      res.status(200).json(questions);
    } catch (error) {
      console.error('Error fetching questions:', error);
      res.status(500).json({message: 'Internal server error', error: error.message});
    }
  },

  getQuestionById: async (req, res) => {
    try {
      const {question_id} = req.params;
      const question = await sequelize.query(
        'SELECT * FROM assessment_questions WHERE question_id = ?',
        {replacements: [question_id], type: sequelize.QueryTypes.SELECT}
      );
      if (question.length === 0) {
        return res.status(404).json({message: 'Question not found'});
      }
      res.status(200).json(question[0]);
    } catch (error) {
      console.error('Error fetching question:', error);
      res.status(500).json({message: 'Internal server error'});
    }
  },

  createQuestion: async (req, res) => {
    const {assessment_id} = req.params;
    const {text, options} = req.body;
    console.log('🚀 ~ createQuestion: ~ assessment_id:', assessment_id);
    console.log('🚀 ~ createQuestion: ~ req.body:', req.body);

    let transaction;

    try {
      // Start a transaction
      transaction = await sequelize.transaction();

      // Create the question
      const [result] = await sequelize.query(
        'INSERT INTO assessment_questions (assessment_id, question_text) VALUES (?, ?)',
        {
          replacements: [assessment_id, text],
          type: sequelize.QueryTypes.INSERT,
          transaction
        }
      );

      const newQuestionId = result;

      // Create the options
      for (const option of options) {
        await sequelize.query(
          'INSERT INTO assessment_options (question_id, option_text, is_correct) VALUES (?, ?, ?)',
          {
            replacements: [newQuestionId, option.option_text, option.is_correct],
            type: sequelize.QueryTypes.INSERT,
            transaction
          }
        );
      }

      // Commit the transaction
      await transaction.commit();


      // Fetch the newly created question along with its options
      const newQuestionData = await sequelize.query(
        `SELECT 
            q.question_id, 
            q.question_text, 
            o.option_id, 
            o.option_text, 
            o.is_correct 
         FROM assessment_questions q
         LEFT JOIN assessment_options o ON q.question_id = o.question_id
         WHERE q.question_id = ?`,
        {replacements: [newQuestionId], type: sequelize.QueryTypes.SELECT}
      );


      // Group options under the new question
      const questionWithOptions = {
        question_id: newQuestionData[0].question_id,
        question_text: newQuestionData[0].question_text,
        options: newQuestionData.map(row => ({
          option_id: row.option_id,
          option_text: row.option_text,
          is_correct: row.is_correct
        }))
      };



      res.status(201).json({message: 'Question created successfully', question: questionWithOptions});
    } catch (error) {
      if (transaction) {
        await transaction.rollback();
      }
      console.error('Error creating question:', error);
      res.status(500).json({message: 'Internal server error', error: error.message});
    }
  },

  updateQuestion: async (req, res) => {
    const {question_id} = req.params;
    const {text, options} = req.body;
    console.log('🚀 ~ updateQuestion: ~ question_id:', question_id);
    console.log('🚀 ~ updateQuestion: ~ req.body:', req.body);
  
    let transaction;
  
    try {
      // Start a transaction
      transaction = await sequelize.transaction();
  
      // Update the question
      const result =  await sequelize.query(
        'UPDATE assessment_questions SET question_text = ? WHERE question_id = ?',
        {
          replacements: [text, question_id],
          type: sequelize.QueryTypes.UPDATE,
          transaction
        }
      );
  
      // Delete existing options
      await sequelize.query(
        'DELETE FROM assessment_options WHERE question_id = ?',
        {
          replacements: [question_id],
          type: sequelize.QueryTypes.DELETE,
          transaction
        }
      );
  
      // Create the new options
      for (const option of options) {
        await sequelize.query(
          'INSERT INTO assessment_options (question_id, option_text, is_correct) VALUES (?, ?, ?)',
          {
            replacements: [question_id, option.option_text, option.is_correct],
            type: sequelize.QueryTypes.INSERT,
            transaction
          }
        );
      }
  
      // Commit the transaction
      await transaction.commit();
  
      // Fetch the updated question along with its options
      const updatedQuestionData = await sequelize.query(
        `SELECT 
            q.question_id, 
            q.question_text, 
            o.option_id, 
            o.option_text, 
            o.is_correct 
         FROM assessment_questions q
         LEFT JOIN assessment_options o ON q.question_id = o.question_id
         WHERE q.question_id = ?`,
        {replacements: [question_id], type: sequelize.QueryTypes.SELECT}
      );
  
      // Group options under the updated question
      const questionWithOptions = {
        question_id: updatedQuestionData[0].question_id,
        question_text: updatedQuestionData[0].question_text,
        options: updatedQuestionData.map(row => ({
          option_id: row.option_id,
          option_text: row.option_text,
          is_correct: row.is_correct
        }))
      };
      console.log('🚀 ~ updateQuestion ~ questionWithOptions:', questionWithOptions);
  
      res.status(200).json({message: 'Question updated successfully', question: questionWithOptions});
    } catch (error) {
      if (transaction) {
        await transaction.rollback();
      }
      console.error('Error updating question:', error);
      res.status(500).json({message: 'Internal server error', error: error.message});
    }
  },

  deleteQuestion: async (req, res) => {
    const {question_id} = req.params;
    let transaction;
    try {
      // Start a transaction
      transaction = await sequelize.transaction();

      const question = await sequelize.query(
        'SELECT * FROM assessment_questions WHERE question_id = ?',
        {replacements: [question_id], type: sequelize.QueryTypes.SELECT}
      );

      if (question.length === 0) {
        return res.status(404).json({message: 'Question not found'});
      }

      await sequelize.query(
        'DELETE FROM assessment_questions WHERE question_id = ?',
        {replacements: [question_id], type: sequelize.QueryTypes.DELETE, transaction}
      );

      await sequelize.query(
        'DELETE FROM assessment_options WHERE question_id = ?',
        {replacements: [question_id], type: sequelize.QueryTypes.DELETE, transaction}
      );

      // Commit the transaction
      await transaction.commit();

      res.status(200).json({message: 'Question deleted successfully'});
    } catch (error) {
      // If any error occurs, rollback the transaction
      if (transaction) {
        await transaction.rollback();
      }
      console.error('Error deleting question:', error);
      res.status(500).json({message: 'Internal server error', error: error.message});
    }
  },





  // submission of assessment 
  submitAssessment: async (req, res) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).send('Unauthorized - No token provided');
    }
  
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const userId = decoded.userId;
      const { assessment_id } = req.params;
      const { answers } = req.body;
  
      // Delete existing results for the user and assessment
      await AssessmentResult.destroy({
        where: {
          userId: userId,
          assessment_id: assessment_id
        }
      });
  
      if (!assessment_id || !userId || !answers || typeof answers !== 'object') {
        return res.status(400).json({ message: 'Invalid input data' });
      }
  
      // Fetch all questions and corresponding correct options for the assessment
      const questionsQuery = `
        SELECT q.question_id, o.option_id AS correct_option_id
        FROM assessment_questions q
        LEFT JOIN assessment_options o ON q.question_id = o.question_id AND o.is_correct = TRUE
        WHERE q.assessment_id = ?
      `;
  
      const questions = await sequelize.query(questionsQuery, {
        replacements: [assessment_id],
        type: sequelize.QueryTypes.SELECT
      });
  
      if (!questions.length) {
        return res.status(404).json({ message: 'Assessment not found' });
      }
  
      // Calculate the results
      let correctAnswersCount = 0;
      const totalQuestions = questions.length;
  
      questions.forEach(question => {
        if (question.correct_option_id && Number(answers[question.question_id]) === question.correct_option_id) {
          correctAnswersCount++;
        }
      });
  
      // Calculate the score
      const score = (correctAnswersCount / totalQuestions) * 100;
  
      // Save the result to the database
      const resultInsertQuery = `
        INSERT INTO assessment_results (userId, assessment_id, score, selected_options, created_at, updated_at)
        VALUES (?, ?, ?, ?, NOW(), NOW())
      `;
  
      await sequelize.query(resultInsertQuery, {
        replacements: [userId, assessment_id, score, JSON.stringify(answers)],
        type: sequelize.QueryTypes.INSERT
      });
  
      // Fetch the result for the response
      const resultsQuery = `
        SELECT 
          ar.score,
          ar.selected_options AS selectedOptions,
          DATE_FORMAT(ar.created_at, '%Y-%m-%d %H:%i:%s') AS createdAt,
          a.assessment_type,
          a.description,
          (
            SELECT AVG(ar2.score) 
            FROM assessment_results ar2 
            WHERE ar2.assessment_id = ar.assessment_id
          ) AS averageScore
        FROM assessment_results ar
        JOIN assessments a ON ar.assessment_id = a.assessment_id
        WHERE ar.assessment_id = :assessmentId AND ar.userId = :userId
      `;
  
      const results = await sequelize.query(resultsQuery, {
        replacements: { assessmentId: assessment_id, userId: userId },
        type: sequelize.QueryTypes.SELECT
      });
  
      if (!results.length) {
        return res.status(404).json({ message: 'No results found for this assessment.' });
      }
  
      const result = results[0];

      console.log(result.selectedOptions, "result.selectedOptions")
  
      // Fetch selected option texts
      const selectedOptions = result.selectedOptions;
      const selectedOptionIds = Object.values(selectedOptions).map(Number);
  
      const selectedOptionsQuery = `
        SELECT ao.option_id, ao.option_text
        FROM assessment_options ao
        WHERE ao.option_id IN (:selectedOptionIds)
      `;
  
      const selectedOptionDetails = await sequelize.query(selectedOptionsQuery, {
        replacements: { selectedOptionIds },
        type: sequelize.QueryTypes.SELECT
      });
  
      const selectedOptionMap = selectedOptionDetails.reduce((map, option) => {
        map[option.option_id] = option.option_text;
        return map;
      }, {});
  
      // Calculate correct answers for selected options
      correctAnswersCount = 0;
      questions.forEach(question => {
        if (question.correct_option_id && Number(selectedOptions[question.question_id]) === question.correct_option_id) {
          correctAnswersCount++;
        }
      });
  
      res.status(200).json({
        score,
        selectedOptions,
        selectedOptionTexts: selectedOptionMap,
        createdAt: result.createdAt,
        assessmentType: result.assessment_type,
        description: result.description,
        totalQuestions,
        correctAnswers: correctAnswersCount,
        analysis: `You answered ${correctAnswersCount} out of ${totalQuestions} questions correctly.`,
        averageScore: result.averageScore
      });
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        console.error('Duplicate entry error:', error);
        res.status(409).json({ message: 'Assessment result for this user and assessment already exists.' });
      } else {
        console.error('Error submitting assessment:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }
,  
  AssessmentResult: async (req, res) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).send('Unauthorized - No token provided');
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const userId = decoded.userId;
      const {assessment_id} = req.params;

      const resultsQuery = `
      SELECT 
        ar.score,
        ar.selected_options AS selectedOptions,
        DATE_FORMAT(ar.created_at, '%Y-%m-%d %H:%i:%s') AS createdAt,
        a.assessment_type,
        a.description,
        (
          SELECT AVG(ar2.score) 
          FROM assessment_results ar2 
          WHERE ar2.assessment_id = ar.assessment_id
        ) AS averageScore
      FROM assessment_results ar
      JOIN assessments a ON ar.assessment_id = a.assessment_id
      WHERE ar.assessment_id = :assessmentId AND ar.userId = :userId
    `;

      const results = await sequelize.query(resultsQuery, {
        replacements: {assessmentId: assessment_id, userId: userId},
        type: sequelize.QueryTypes.SELECT
      });

      if (!results.length) {
        return res.status(404).json({message: 'No results found for this assessment.'});
      }

      const [result] = results;

      const questionsQuery = `
      SELECT q.question_id, o.option_id AS correct_option_id
      FROM assessment_questions q
      LEFT JOIN assessment_options o ON q.question_id = o.question_id AND o.is_correct = TRUE
      WHERE q.assessment_id = ?
    `;

      const questions = await sequelize.query(questionsQuery, {
        replacements: [assessment_id],
        type: sequelize.QueryTypes.SELECT
      });
      if (!questions.length) {
        return res.status(404).json({message: 'Assessment not found'});
      }

      const selectedOptions = result.selectedOptions;

      const selectedOptionIds = Object.values(selectedOptions).map(Number);

      const selectedOptionsQuery = `
      SELECT ao.option_id, ao.option_text
      FROM assessment_options ao
      WHERE ao.option_id IN (:selectedOptionIds)
    `;

      const selectedOptionDetails = await sequelize.query(selectedOptionsQuery, {
        replacements: {selectedOptionIds},
        type: sequelize.QueryTypes.SELECT
      });

      const selectedOptionMap = selectedOptionDetails.reduce((map, option) => {
        map[option.option_id] = option.option_text;
        
        return map;
      }, {});

      // Calculate the results
      let correctAnswersCount = 0;
      questions.forEach(question => {
        if (question.correct_option_id && Number(selectedOptions[question.question_id]) === question.correct_option_id) {
          correctAnswersCount++;
        }
      });

      const totalQuestions = questions.length;

      res.status(200).json({
        score: result.score,
        selectedOptions: selectedOptions,
        selectedOptionTexts: selectedOptionMap,
        createdAt: result.createdAt,
        assessmentType: result.assessment_type,
        description: result.description,
        totalQuestions: totalQuestions,
        correctAnswers: correctAnswersCount
      });
    } catch (error) {
      console.error('Error fetching assessment results:', error);
      res.status(500).json({message: 'Internal server error'});
    }
  }
};
