const {models: {Profile}} = require('../models');
const {models: {User, Roles}} = require('../models');
const jwt = require('jsonwebtoken');
const {sequelize} = require('../models');

const JWT_SECRET = 'e67e1b471d09e2ce28955d6cf510fa3c10115079dbf51d945a21cbdfce271552';

module.exports = {
  createProfile: async (req, res) => {
    try {
      const {name, description, address, contactInfo, websiteLink, connections, selfEmployed, education, about, experience, skills, } = req.body;
            
      // Extract userId from JWT token
      const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
      if (!token) {
        return res.status(401).send('Unauthorized - No token provided');
      }
      const decoded = jwt.verify(token, JWT_SECRET); 
      const userId = decoded.userId;

      const newProfile = await Profile.create({
        name,
        description,
        address,
        contactInfo,
        websiteLink,
        connections,
        selfEmployed,
        education,
        about,
        experience,
        // skills,
        userId: userId
      });
      res.status(201).json({message: 'Profile created successfully', profile: newProfile});
    } catch (error) {
      console.error('Error creating profile:', error);
      res.status(500).json({message: 'Internal server error'});
    }
  },



  updateProfile: async (req, res) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).send('Unauthorized - No token provided');
    }
    let userId;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    userId = decoded.userId;
  } catch (err) {
    return res.status(401).send('Unauthorized - Invalid token');
  }
    try {
      const {description, address, profilePicture, bannerPicture, summary, skills, education, experience, certifications, languages, interests, country, region, district, collegeOrUniversity, employmentType, companyName,  phoneNumber, headline, bio, avatarURL, socialLinks, contactInfo, websiteLink, connections, selfEmployed, first_name, last_name} = req.body;
      
      const updatedProfile = await Profile.update({
        description, address, profilePicture, bannerPicture, summary, skills, education, experience, certifications, languages, interests, country, region, district, collegeOrUniversity, employmentType, companyName,  phoneNumber, headline, bio, avatarURL, socialLinks, contactInfo, websiteLink, connections, selfEmployed, first_name, last_name
      }, {
        where: {userId: userId}
      });

      
let role_id;
      const {fullName, userType} = req.body;
      if (fullName || userType) {
        if(userType){
          const thisRole = await sequelize.query(
            `SELECT *
            FROM roles where role_name = '${userType}'`,
            {
              type: sequelize.QueryTypes.SELECT
            }
          );
          console.log("🚀 ~ updateProfile: ~ thisRole:", thisRole)
           role_id = thisRole[0].id;
        }
        
        const updatedUser = await User.update({fullName, role_id}, {
          where: {userId: userId}
        });
        console.log("🚀 ~ updateProfile: ~ updatedUser:", updatedUser)
      }

      
      res.status(200).json({message: 'Profile updated successfully', profile: updatedProfile});
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({message: 'Internal server error'});
    }
  },






  deleteProfile: async (req, res) => {
    try {
      const {profileId} = req.params;
      await Profile.destroy({where: {id: profileId}});
      res.status(200).json({message: 'Profile deleted successfully'});
    } catch (error) {
      console.error('Error deleting profile:', error);
      res.status(500).json({message: 'Internal server error'});
    }
  },
  getProfileByAdmin: async (req, res) => {
    const token = req.headers.authorization && req.headers.authorization?.split(' ')[1];
   
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const userId = decoded.userId; 

      if (!userId) {
        return res.status(404).json({message: 'User not authorized'});
      }
      const profile = await Profile.findOne({where: {userId: userId}});
      const user = await User.findByPk(userId);
      let role = await Roles.findByPk(user.role_id);
      role = role.role_name;
      return res.status(200).json({profile, user, role});
    } catch (error) {
      console.error('Error fetching profile:', error);
      
      return res.status(500).json({message: 'Internal server error'});
    }
  },

  getMainNavProfileByAdmin: async (req, res) => {
    const token = req.headers.authorization && req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided, authorization denied' });
  }
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const userId = decoded.userId; 

      if (!userId) {
        return res.status(404).json({message: 'User not authorized'});
      }
      const profile = await Profile.findOne({
        where: { userId: userId },
        attributes: ['avatarURL', 'first_name', 'last_name']
      });
      return res.status(200).json({profile});
    } catch (error) {
      console.error('Error fetching profile:', error);
      
      return res.status(500).json({message: 'Internal server error'});
    }
  },

  
  getProfile: async (req, res) => {

    try {
      const {userId} = req.params;

      if (!userId) {
        return res.status(404).json({message: 'User not authorized'});
      }
      const profile = await Profile.findOne({where: {userId: userId}});
      const user = await User.findByPk(userId);
      let role = await Roles.findByPk(user.role_id);
      role = role.role_name;
      return res.status(200).json({profile, user, role});
    } catch (error) {
      console.error('Error fetching profile:', error);
      
      return res.status(500).json({message: 'Internal server error'});
    }
  },

  getSecureUser: async (req, res) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).send('Unauthorized - No token provided');
    }
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const userId = decoded.userId; 

      if (!userId) {
        return res.status(404).json({message: 'User not authorized'});
      }
      const userQuery = `
      SELECT users.userId, users.fullName, profiles.avatarURL
      FROM users
      LEFT JOIN profiles ON users.userId = profiles.userId
      WHERE users.userId = :userId
    `;

      const [userResult] = await sequelize.query(userQuery, {
        replacements: {userId},
        type: sequelize.QueryTypes.SELECT
      });

      if (!userResult) {
        return res.status(404).json({message: 'User not found'});
      }

      return res.status(200).json(userResult);
    } catch (error) {
      console.error('Error fetching profile:', error);
      
      return res.status(500).json({message: 'Internal server error'});
    }
  }

  
  
};
