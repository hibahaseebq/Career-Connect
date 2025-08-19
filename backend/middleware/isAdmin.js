// middleware/isAdmin.js
const jwt = require('jsonwebtoken');
const JWT_SECRET='e67e1b471d09e2ce28955d6cf510fa3c10115079dbf51d945a21cbdfce271552';
const {models: {User}} = require('../models');
const {models: {Roles}} = require('../models');
const {sequelize} = require('../models');

const isAdmin = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token && token===null) {
    return res.status(401).json({ message: 'Unauthorized access' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await sequelize.query(
        `SELECT u.userId, u.fullName, u.emailAddress, r.role_name AS role_name
         FROM users u
         LEFT JOIN roles r ON u.role_id = r.id
         WHERE u.userId = :userId`,
        {
          replacements: { userId: decoded.userId },
          type: sequelize.QueryTypes.SELECT,
          plain: true
        }
      );

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    if (user.role_name !== 'admin') {
      return res.status(403).json({ message: 'Forbidden access' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Error verifying admin access:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = isAdmin;
