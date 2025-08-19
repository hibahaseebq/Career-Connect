const {models: {Progress, Goal}} = require('../models');
const jwt = require('jsonwebtoken');
const {sequelize, Op} = require('../models');

const JWT_SECRET = 'e67e1b471d09e2ce28955d6cf510fa3c10115079dbf51d945a21cbdfce271552';

exports.getAllGoals = async (req, res) => {
  try {
    const goals = await Goal.findAll();
    res.status(200).json(goals);
  } catch (error) {
    res.status(500).json({error: 'Error fetching goals'});
  }
};

exports.createGoal = async (req, res) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  console.log('🚀 ~ exports.createGoal= ~ token:', token);
  if (!token) {
    return res.status(401).json({message: 'No token provided, authorization denied'});
  }
  try {
    const {content, receiver_id, conversation_id} = req.body;
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;
    const {title, description, deadline} = req.body;
    const newGoal = await Goal.create({title, description, deadline, userId});
    console.log('🚀 ~ exports.createGoal= ~ newGoal:', newGoal);
    res.status(201).json(newGoal);
  } catch (error) {
    res.status(500).json({error});
  }
};

exports.getGoalProgress = async (req, res) => {
  try {
    const {goalId} = req.params;
    const progressList = await Progress.findAll({where: {goal_id: goalId}});
    res.status(200).json(progressList);
  } catch (error) {
    res.status(500).json({error: 'Error fetching progress'});
  }
};


exports.createProgress = async (req, res) => {
  try {
    const {goal_id, status, description} = req.body;
    const newProgress = await Progress.create({goal_id, status, description});
    res.status(201).json(newProgress);
  } catch (error) {
    res.status(500).json({error: 'Error creating progress'});
  }
};
