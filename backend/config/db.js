// const { Sequelize } = require('sequelize');

// const sequelize = new Sequelize('jobconnects', 'root', '123456', {
//   host: '127.0.0.1',
//   dialect: 'mysql'
// });

// // Test the database connection
// sequelize
//   .authenticate()
//   .then(() => {
//     console.log('Connection to the database has been established successfully.');
//   })
//   .catch(err => {
//     console.error('Unable to connect to the database:', err);
//   });

// module.exports = sequelize;


// config/db.js
module.exports = {
  HOST: '127.0.0.1',
  USER: 'root',
  PASSWORD: '123456',
  DATABASE: 'career-connect',
  DIALECT: 'mysql'
};