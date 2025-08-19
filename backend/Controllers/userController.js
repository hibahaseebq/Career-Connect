/* eslint-disable no-console */
// Controller/userController.js
const {models: {User}, sequelize} = require('../models');
const {models: {ForumPost, ForumReply}} = require('../models');
const {models: {Roles}} = require('../models');
const {models: {Profile}} = require('../models');
const {models: {UserPreferences}} = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const {generateVerificationCode, sendEmailVerificationEmail} = require('../services/EmailServices');
const verifyEmailController = require('./microControllers/verifyEmailController');
const JWT_SECRET='e67e1b471d09e2ce28955d6cf510fa3c10115079dbf51d945a21cbdfce271552';
const ADMIN_ACCESS_KEY='e67e1bd71d09e2ce28955dfcf510fg3c1011507hdbf51d945a21cbdfce2715as';

const initializeRoles = async () => {
  const roles = ['student', 'counsellor', 'admin'];
  for (const roleName of roles) {
    const roleExists = await Roles.findOne({where: {role_name: roleName}});
    if (!roleExists) {
      await Roles.create({role_name: roleName});
    }
  }
};

module.exports = {

  create: async (req, res) => {
    const {fullName, email, password, country, region, district, privateKey} = req.body;
    let {userType} = req.body;  
    if (userType === undefined) {
      userType = 'student';
    }
    console.log('🚀 ~ create: ~ req.body:', req.body);
    const emailAddress = email;
    const verificationCode = generateVerificationCode();

    if (userType === 'admin' && privateKey !== ADMIN_ACCESS_KEY) {
      return res.status(401).json({message: 'Unauthorized access'});
    }

    try {
      const existingUser = await User.findOne({where: {emailAddress}});
      if (existingUser) {
        if (existingUser.emailVerified) {
          return res.status(400).json({message: 'Email already exists and is verified'});
        }
 
        return res.status(400).json({message: 'Email already exists'});
      }

      await initializeRoles();
  
      // Send verification email
      await sendEmailVerificationEmail(email, verificationCode);
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Get role ID based on userType or privateKey
      let roleId;
      let roleIs;
      let navigatePath;
      if (privateKey === ADMIN_ACCESS_KEY) {
        const adminRole = await Roles.findOne({where: {role_name: 'admin'}});
        roleId = adminRole.id;
        roleIs='admin';
        navigatePath = '/admin';
      } else {
        const userRole = await Roles.findOne({where: {role_name: userType}});
        roleId = userRole.id;
        navigatePath = '/';
        roleIs=userType;
      }
      // Create a new user instance
      const newUser = await User.create({
        fullName,
        emailAddress,
        password: hashedPassword,
        role_id: roleId,
        verificationCode
      });
      console.log('🚀 ~ create: ~ newUser:', newUser);
  
      // Create a corresponding profile for the user
      const newUserProfile = await Profile.create({
        userId: newUser.userId,
        country,
        region,
        district
      });
  
      // Generate token
      const token = jwt.sign({userId: newUser.userId, role: roleIs}, JWT_SECRET);
  
      // Return success response
      res.status(201).json({
        message: 'Great news! 🎉 Details captured. Check your email for verification. Once confirmed, you are ready to dive in! 😊',
        token, navigate: navigatePath
      });
  
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({message: 'Internal server error'});
    }
  },

  
  verifyEmail: verifyEmailController.verifyEmail,

  signIn: async (req, res) => {
    const {email, password} = req.body;
    const emailAddress = email;
    try {
      const query = `
        SELECT u.userId, u.password, r.role_name 
        FROM users u
        JOIN roles r ON u.role_id = r.id
        WHERE u.emailAddress = ?
      `;
      console.log("🚀 ~ signIn: ~ query:", query)
  
      const [results] = await sequelize.query(query, {
        replacements: [emailAddress],
        type: sequelize.QueryTypes.SELECT
      });
  
      if (results?.length === 0 || results === undefined) {
        return res.status(400).json({message: 'User does not exist'});
      }
  
      const thisUser = results;
  
      // Compare passwords
      const isPasswordValid = await bcrypt.compare(password, thisUser.password);
  
      if (!isPasswordValid) {
        return res.status(401).json({message: 'Incorrect password'});
      }
  
      // Extract role
      const role = thisUser.role_name;
  
      // If password is correct, generate token with role
      const token = jwt.sign({userId: thisUser.userId, role: role}, JWT_SECRET);
  
      // Return success response
      res.status(200).json({message: 'Sign in successful', token});
    } catch (error) {
      console.error('Error signing in:', error);
      res.status(500).json({message: 'Internal server error'});
    }
  },

  //   signOut: async (req, res) => {
  //     const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    
  //     if (!token) {
  //       return res.status(401).send('Unauthorized - No token provided');
  //     }

  //     try {
  //       const decoded = jwt.verify(token, JWT_SECRET); 
  //       const userId = decoded.userId;

  //       if (!userId) {
  //         return res.status(400).json({ success: false, message: 'Invalid token format' });
  //       }

  //       // Clear the authentication token from the client-side storage
  //       // For example, if using cookies:
  //       sessionStorage.removeItem('token');

  //       // For example, if using local storage:
  //       // localStorage.removeItem('authToken');

  //       // Send a success response
  //       res.status(200).json({ success: true, message: 'Sign out successful' });
  //     } catch (error) {
  //       console.error('Error occurred during sign-out:', error);

  //       if (error.name === 'JsonWebTokenError') {
  //         return res.status(401).json({ success: false, message: 'Invalid token. Please sign in again.' });
  //       }

  //       return res.status(500).json({ success: false, message: 'Internal server error' });
  //     }
  //   },

  profileDetails: async (req, res) => {
    const {emailNotification, smsNotification, openToJob, headline, bio, avatarURL, socialLinks, jobPreference, jobPreferences, jobLocations, remoteWorkOption} = req.body;
   

    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
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
            
      let userPreferences = await UserPreferences.findOne({where: {userId}});

     

      if (!userPreferences) {

        Profile.update({
          headline, bio, avatarURL, socialLinks
        }, {
          where: {userId: userId}
        });
  
        // If user preferences doesn't exist, create it
        userPreferences = await UserPreferences.create({
          userId,
          emailNotification,
          smsNotification,
          openToJob,
          jobPreference,
          jobPreferences,
          jobLocations,
          remoteWorkOption
        });
      } else {

        await Profile.update({
          headline, bio, avatarURL, socialLinks
        }, {
          where: {userId: userId}
        });
  
        // If user preferences exist, update them
        await userPreferences.update({
          emailNotification,
          smsNotification,
          openToJob,
          jobPreference,
          jobPreferences,
          jobLocations,
          remoteWorkOption
        });
      }
            
      await userPreferences.save();

      return res.status(200).json({
        message: 'Profile details saved successfully'
        // userProfile: userPreferences
      });
    } catch (error) {
      console.error('Error occurred while saving profile details:', error);

      if (error.name === 'SequelizeValidationError') {
        const validationErrors = error.errors.map(err => err.message);

        return res.status(400).json({message: 'Validation error', errors: validationErrors});
      }

      if (error.name === 'SequelizeDatabaseError') {
        return res.status(500).json({message: 'Database error', error: error.message});
      }

      return res.status(500).json({message: 'Internal server error'});
    }
  },

  deleteUser: async (req, res) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    console.log('🚀 ~ deleteUser: ~ token:', token);
    if (!token) {
      return res.status(401).send('Unauthorized - No token provided');
    }
    try {
      const decoded = jwt.verify(token, JWT_SECRET); 
      console.log('🚀 ~ deleteUser: ~ decoded:', decoded);
      const userId = decoded.userId;
      if (!userId) {
        return res.status(404).json({message: 'Verification code is invalid or expired'});
      }
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({message: 'User not found'});
      }
      if (user.emailVerified === true){
        return res.status(400).json({message: 'Email already verified, cannot delete user, if you want to register again, sign out first.'});
      }
      await Profile.destroy({where: {userId: user.userId}});
      await user.destroy();

      return res.status(200).json({message: 'Gone back successfully, please enter your details to sign up again.'}); 
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({message: 'Internal server error'});
    }
  },


  // admin routes 
  AdminGetAllUsers: async (req, res) => {
    try {
      const users = await sequelize.query(
        `SELECT u.userId, u.fullName, u.emailAddress, r.id As role_id,  r.role_name AS role_name
         FROM users u
         LEFT JOIN roles r ON u.role_id = r.id`,
        {
          type: sequelize.QueryTypes.SELECT
        }
      );
      res.status(200).json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({message: 'Internal server error'});
    }
  },

  AdminUpdateUser: async (req, res) => {
    const {userId, fullName, emailAddress, role_id, role_name} = req.body;

    try {
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({message: 'User not found'});
      }
      const thisRole = await sequelize.query(
        `SELECT *
        FROM roles where role_name = '${role_name}'`,
        {
          type: sequelize.QueryTypes.SELECT
        }
      );
      const upRoleId = thisRole[0].id;
     

      const updatedUser = await user.update({fullName, emailAddress, role_id: upRoleId});
     
      res.status(200).json({message: 'User updated successfully', user: updatedUser});
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({message: 'Internal server error'});
    }
  },

  AdminDeleteUser: async (req, res) => {
    const {userId} = req.params;
    console.log('🚀 ~ AdminDeleteUser: ~ userId:', userId);

    try {
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({message: 'User not found'});
      }
      
      await ForumPost.destroy({where: {userId: userId}});
      await ForumReply.destroy({where: {userId: userId}});
      await Profile.destroy({where: {userId: userId}});
      await user.destroy();

      res.status(200).json({message: 'User deleted successfully'});
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({message: 'Internal server error'});
    }
  }
};