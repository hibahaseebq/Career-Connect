// services/EmailServices 

const nodemailer = require('nodemailer');
require('dotenv').config();


// Function to generate random verification code
const generateVerificationCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Function to send email verification email
const sendEmailVerificationEmail = (email, verificationCode) => {
  return new Promise((resolve, reject) => {
      try {
      const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
      });
      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Email Verification',
        text: `Your verification code is: ${verificationCode}. This code will expire in 30 minutes.`
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email verification email:', error);
          reject(new Error('Failed to send email verification email.'));
        } else {
          console.log('Email verification email sent successfully.');
          resolve('info');
        }
      });
    } catch (error) {
      console.error('Error sending email verification email:', error);
      reject(new Error('Failed to send email verification email.'));
    }
  });
};







module.exports={generateVerificationCode, sendEmailVerificationEmail};