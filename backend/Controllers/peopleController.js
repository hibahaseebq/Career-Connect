// controllers/peopleController.js
const {sequelize} = require('../models');
const {models: {Profile}} = require('../models');
const {models: {User}} = require('../models');
const {models: {Notification}} = require('../models');
const {models: {UserConnection}} = require('../models');
const {Op, Sequelize, where} = require('sequelize');
const jwt = require('jsonwebtoken');
const JWT_SECRET='e67e1b471d09e2ce28955d6cf510fa3c10115079dbf51d945a21cbdfce271552';

module.exports = {

  listUsers: async (req, res, next) => {
    try {
      const whereCondition = {}; // Initialize empty where condition
      
      const searchTerm = req.query.term;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      
      if (searchTerm) {
        whereCondition.name = {
          [Op.like]: `%${searchTerm?.toLowerCase()}%`
        };
      }
      const resultsQuery = `
      SELECT 
        users.userId, 
        users.fullName, 
        users.emailAddress, 
        users.role_id, 
        users.emailVerified, 
        users.createdAt, 
        users.updatedAt,
        profiles.headline, 
        profiles.country, 
        profiles.region, 
        profiles.district,
        profiles.avatarURL,
        roles.role_name as role_name
      FROM 
        users
      LEFT JOIN 
        profiles ON users.userId = profiles.userId
      LEFT JOIN 
        roles ON users.role_id = roles.id
      ${searchTerm ? 'WHERE LOWER(users.fullName) LIKE :searchTerm' : ''}
      LIMIT :limit OFFSET :offset
    `;

      const results = await sequelize.query(resultsQuery, {
        replacements: {
          searchTerm: `%${searchTerm?.toLowerCase()}%`,
          limit,
          offset
        },
        type: sequelize.QueryTypes.SELECT
      });
      // console.log("🚀 ~ listUsers: ~ results:", results)

      const countQuery = `
        SELECT COUNT(*) AS totalUsers
        FROM users
        ${searchTerm ? 'WHERE LOWER(users.fullName) LIKE :searchTerm' : ''}
      `;

      const totalUsers = await sequelize.query(countQuery, {
        replacements: {
          searchTerm: `%${searchTerm?.toLowerCase()}%`
        },
        type: sequelize.QueryTypes.SELECT
      });

      const totalPages = Math.ceil(totalUsers[0].totalUsers / limit);

      res.json({
        results,
        totalPages
      });
    } catch (error) {
      console.error('Error fetching search results:', error);
      res.status(500).json({error: 'Internal server error'});
    }
  },

  listAllFriends: async (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
      return res.status(401).send('Unauthorized - No token provided');
    }
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const userId = decoded.userId;

      const whereCondition = {}; 
      
      const searchTerm = req.query.term;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      
      if (searchTerm) {
        whereCondition.name = {
          [Op.like]: `%${searchTerm.toLowerCase()}%`
        };
      }


      const results = await sequelize.query(`
      SELECT 
          userconnections.*, 
          users.id AS senderId, 
          users.fullName AS senderFullName, 
          users.emailAddress AS senderEmailAddress, 
          users.userType AS senderUserType, 
          users.emailVerified AS senderEmailVerified, 
          users.verificationCode AS senderVerificationCode, 
          users.createdAt AS senderCreatedAt, 
          users.updatedAt AS senderUpdatedAt,
          profiles.headline AS senderHeadline, 
          profiles.country AS senderCountry, 
          profiles.avatarUrl AS senderAvatarUrl, 
          profiles.region AS senderRegion, 
          profiles.district AS senderDistrict
      FROM 
          userconnections
      LEFT JOIN 
          users ON userconnections.userId = users.id
      LEFT JOIN 
          profiles ON profiles.userId = users.id
      WHERE status='connected' AND
          userconnections.connectionId = ${userId};
    `, {type: sequelize.QueryTypes.SELECT});




      
      //     const resultsQuery = `
      //   SELECT users.*, profiles.headline, profiles.country, profiles.region, profiles.district
      //   FROM users
      //   LEFT JOIN profiles ON users.id = profiles.userId
      //   INNER JOIN userconnections ON users.id = userconnections.connectionId
      //   WHERE userconnections.connectionId = :userId
      //   AND userconnections.status = 'connection'
      //   ${searchTerm ? 'AND LOWER(users.fullName) LIKE :searchTerm' : ''}
      //   LIMIT :limit OFFSET :offset
      // `;

      // const results = await sequelize.query(resultsQuery, {
      //   replacements: {
      //     userId,
      //     searchTerm: `%${searchTerm.toLowerCase()}%`,
      //     limit,
      //     offset
      //   },
      //   type: sequelize.QueryTypes.SELECT
      // });
    
      // const countQuery = `
      //   SELECT COUNT(*) AS totalUsers
      //   FROM users
      //   INNER JOIN userconnections ON users.id = userconnections.connectionId
      //   WHERE userconnections.connectionId = :userId
      //   AND userconnections.status = 'connection'
      //   ${searchTerm ? 'AND LOWER(users.fullName) LIKE :searchTerm' : ''}
      // `;
    
      // const totalUsers = await sequelize.query(countQuery, {
      //   replacements: {
      //     userId,
      //     searchTerm: `%${searchTerm.toLowerCase()}%`
      //   },
      //   type: sequelize.QueryTypes.SELECT
      // });
    
      // const totalPages = Math.ceil(totalUsers[0].totalUsers / limit);
    // fix when not login the people sections
      res.json({
        results
        // totalPages
      });
    } catch (error) {
      console.error('Error fetching search results:', error);
      res.status(500).json({error: 'Internal server error'});
    }
  },

  requestConnection: async (req, res) => {
    const {connectionId} = req.params;
    const token = req.body.headers.Authorization && req.body.headers.Authorization.split(' ')[1];
    
    if (!token) {
      return res.status(401).send('Unauthorized - No token provided');
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const userId = decoded.userId;

      if (!userId) {
        return res.status(404).json({message: 'Verification code is invalid or expired'});
      }

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({message: 'User not found'});
      }

      const connectionUser = await User.findByPk(connectionId);
      if (!connectionUser) {
        return res.status(404).json({message: 'Connection user not found'});
      }

      const existingRequest = await sequelize.query(`
      SELECT 
          userconnections.*, 
          users.id AS senderId, 
          users.fullName AS senderFullName, 
          users.emailAddress AS senderEmailAddress, 
          users.userType AS senderUserType, 
          users.emailVerified AS senderEmailVerified, 
          users.verificationCode AS senderVerificationCode, 
          users.createdAt AS senderCreatedAt, 
          users.updatedAt AS senderUpdatedAt,
          profiles.headline AS senderHeadline, 
          profiles.country AS senderCountry, 
          profiles.avatarUrl AS senderAvatarUrl, 
          profiles.region AS senderRegion, 
          profiles.district AS senderDistrict
      FROM 
          userconnections
      LEFT JOIN 
          users ON userconnections.userId = users.id
      LEFT JOIN 
          profiles ON profiles.userId = users.id
      WHERE status='connected' AND
          userconnections.connectionId = ${userId};
    `, {type: sequelize.QueryTypes.SELECT});


     

      if (existingRequest) {
        return res.status(400).json({message: 'He is already your friend'});
      }

      await UserConnection.create({
        userId,
        connectionId,
        status: 'pending'
      });

      await Notification.create({
        userId: userId,
        connectionId: connectionId,
        body: `${user.fullName} has sent you a friend request!`,
        from: user.emailAddress,
        to: connectionUser.emailAddress,
        status: 'not_read',
        time: new Date(),
        type: 'req'
      });

      return res.status(200).json({message: 'Connection request sent successfully'});
    } catch (error) {
      console.error('Error sending connection request:', error);

      return res.status(500).json({message: 'Internal server error'});
    }
  },



  // Controller function to list all connections of a user
  listAllConnections: async (req, res, next) => {
    try {
      const userEmail = req.query.email;
      const user = await User.findOne({where: {emailAddress: userEmail}});
        
      if (!user) {
        return res.status(404).json({error: 'User not found'});
      }

      // Fetch all users except the current user
      const allUsers = await User.findAll({where: {emailAddress: {[Sequelize.Op.ne]: userEmail}}});

      // Filter out connections
      const connections = allUsers.filter(u => user.connections.includes(u.emailAddress));

      res.status(200).json({connections});
    } catch (error) {
      console.error('Error listing connections:', error);
      res.status(500).json({error: 'Internal server error'});
    }
  },
  // Controller function to send connection request
  // requestConnection: async (req, res, next) => {
  //   try {
  //     const {from, to} = req.body;

  //     // Update 'from' user's waiting list
  //     const fromUser = await User.findOne({where: {emailAddress: from}});
  //     fromUser.waiting.push(to);
  //     await fromUser.save();

  //     // Update 'to' user's pending list
  //     const toUser = await User.findOne({where: {emailAddress: to}});
  //     toUser.pending.push(from);
  //     await toUser.save();

  //     // Create notification
  //     const notification = await Notification.create({
  //       body: `${from} has sent you a friend request!`,
  //       from,
  //       to,
  //       status: 'not_read',
  //       time: Date.now(),
  //       type: 'req'
  //     });

  //     res.status(200).json({notification});
  //   } catch (error) {
  //     console.error('Error sending connection request:', error);
  //     res.status(500).json({error: 'Internal server error'});
  //   }
  // },


  // Controller function to respond to connection request
  rejectRequest: async (req, res, next) => {
    const token = req.body.headers.Authorization && req.body.headers.Authorization.split(' ')[1];

    if (!token) {
      return res.status(401).send('Unauthorized - No token provided');
    }
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const userId = decoded.userId;
      const {requestId} = req.params;
      const toUser = await User.findByPk(userId);
      // toUser is the user currently responding to the request (the one who received the request)
      if (!toUser) {
        return res.status(404).json({message: 'User not found'});
      }
  
      // Find the user connection request
      const userConnection = await UserConnection.findOne({ 
        where: { 
          id: requestId,
          connectionId: userId, 
          status: 'pending' 
        } 
      });
  
      if (!userConnection) {
        return res.status(404).json({message: 'Connection request not found or not in pending status'});
      }
      await UserConnection.update(
        {status: 'waiting'},
        {where: {id: requestId}} 
      );

      res.status(200).json({message: 'Request rejected successfully'});
    } catch (error) {
      console.error('Error responding to connection request:', error);
      if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        return res.status(401).json({error: 'Unauthorized'});
      } else if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({error: error.message});
      }

      return res.status(500).json({error: 'Internal server error'});
    }
  },


  acceptRequest: async (req, res, next) => {
    const token = req.body.headers.Authorization && req.body.headers.Authorization.split(' ')[1];
    if (!token) {
      return res.status(401).send('Unauthorized - No token provided');
    }
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const userId = decoded.userId;
      const {requestId} = req.params;
      const toUser = await User.findByPk(userId);
      // toUser is the user currently responding to the request (the one who received the request)
      if (!toUser) {
        return res.status(404).json({message: 'User not found'});
      }
  
      // Find the user connection request
      const userConnection = await UserConnection.findOne({ 
        where: { 
          id: requestId,
          connectionId: userId, 
          status: 'pending' 
        } 
      });
  
      if (!userConnection) {
        return res.status(404).json({message: 'Connection request not found or not in pending status'});
      }
      // userConnection.status = 'connected';
      // await userConnection.save();

      await UserConnection.update(
        {status: 'connected'},
        {where: {id: requestId}} 
      );



      res.status(200).json({message: 'Request accepted successfully'});
    } catch (error) {
      console.error('Error accepting connection request:', error);
      if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        return res.status(401).json({error: 'Unauthorized'});
      } else if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({error: error.message});
      }
 
      return res.status(500).json({error: 'Internal server error'});
      
    }
  },


  listAllRequest: async (req, res) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
      return res.status(401).send('Unauthorized - No token provided');
    }
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const userId = decoded.userId;
      
      if (!userId) {
        return res.status(404).json({message: 'not Authorized for this action'});
      }
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({message: 'User not found'});
      }
      const allRequests = await sequelize.query(`
      SELECT 
          userconnections.*, 
          users.id AS senderId, 
          users.fullName AS senderFullName, 
          users.emailAddress AS senderEmailAddress, 
          users.userType AS senderUserType, 
          users.emailVerified AS senderEmailVerified, 
          users.verificationCode AS senderVerificationCode, 
          users.createdAt AS senderCreatedAt, 
          users.updatedAt AS senderUpdatedAt,
          profiles.headline AS senderHeadline, 
          profiles.country AS senderCountry, 
          profiles.avatarUrl AS senderAvatarUrl, 
          profiles.region AS senderRegion, 
          profiles.district AS senderDistrict
      FROM 
          userconnections
      LEFT JOIN 
          users ON userconnections.userId = users.id
      LEFT JOIN 
          profiles ON profiles.userId = users.id
      WHERE status='pending' AND
          userconnections.connectionId = ${userId};
    `, {type: sequelize.QueryTypes.SELECT});


      res.status(200).json({allRequests});

    } catch (error) {
      res.status(500).json({error: 'Internal server error'});
    }
  }
};