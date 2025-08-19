const { body, validationResult } = require('express-validator');

exports.validateGoal = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').optional().isString(),
  body('deadline').optional().isISO8601().toDate(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

exports.validateProgress = [
  body('goal_id').notEmpty().isInt().withMessage('Goal ID is required'),
  body('status').notEmpty().withMessage('Status is required'),
  body('description').optional().isString(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
