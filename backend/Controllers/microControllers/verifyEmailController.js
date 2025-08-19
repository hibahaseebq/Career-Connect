// Controller/microControllers/verifyEmailController.js
const jwt = require('jsonwebtoken');
const JSONParser = require('jsonparser');

const verifyEmailController = {};
const JWT_SECRET='e67e1b471d09e2ce28955d6cf510fa3c10115079dbf51d945a21cbdfce271552';
const {models: {User}} = require('../../models');

verifyEmailController.verifyEmail = async (req, res) => {
  try {
    const {verificationCode} = req.body;
    console.log('🚀 ~ verifyEmailController.verifyEmail= ~ verificationCode:', verificationCode);
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    console.log('🚀 ~ verifyEmailController.verifyEmail= ~ token:', token);
    if (!token) {
      return res.status(401).send('Unauthorized - No token provided');
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET); 
      const userId = decoded.userId;
      if (!userId) {
        return res.status(404).json({message: 'Verification code is invalid or expired'});
      }
  
      const user = await User.findOne({where: {userId: userId}});
      if (!user) {
        return res.status(404).json({message: 'User not found'});
      }
  
      if (user.emailVerified) {
        user.emailVerified = false;
      await user.save();

        return res.status(400).json({message: 'Email already verified for this user'});
      } 
      if (user.verificationCode!==verificationCode){
        return res.status(404).json({message: 'Verification code is invalid or expired'});
      }
      user.emailVerified = true;
      user.verificationCode = null;
      await user.save();

      return res.status(200).json({message: 'Email verification successful'});
      
      
    } catch (err) {
      console.error(' ~ Error verifying token:', err);

      return res.status(401).json({message: 'Invalid authorization token'});
    }
  } catch (error) {
    console.error('Error verifying email:', error);
    res.status(500).json({message: 'Internal server error'});
  }
};

module.exports = verifyEmailController;
