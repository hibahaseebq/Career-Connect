// Backedend/server.js 
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoute.js');
const jobRoutes = require('./routes/jobRoute.js');
const db = require('./models');
const profileRoutes = require('./routes/profileRoute.js');
const peopleRoute = require('./routes/peopleRoute.js');
const forumRoute = require('./routes/forumRoute.js');
const isAdmin = require('./middleware/isAdmin.js');
const  AdminRoutes  = require('./routes/AdminRoutes/adminRoutes.js');
const  CareerRoutes  = require('./routes/CareerRoutes.js');
const  AssessmentsRoutes  = require('./routes/AssessmentsRoutes.js');
const  messageRoutes  = require('./routes/messageRoutes.js');
const  goalRoutes  = require('./routes/goalRoutes.js');





const app = express();



// Database synchronization
(async () => {
  try {
    await db.sequelize.sync();
    // eslint-disable-next-line no-console
    console.log('Database synchronized');
  } catch (error) {
    console.error('Error synchronizing database:', error);
  }
})();


// Middleware
app.use(cors());
app.use(bodyParser.json());

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({message: 'Internal server error. Please try again later.'});
});

// // Global error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   if (!res.headersSent) {
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

// Routes
app.use('/users', userRoutes);
app.use('/jobs', jobRoutes);
app.use('/profile', profileRoutes);
app.use('/people', peopleRoute);
app.use('/forum', forumRoute);
app.use('/careers', CareerRoutes);
app.use('/assessments', AssessmentsRoutes);
app.use('/messages', messageRoutes);
app.use('/goal-section', goalRoutes);
app.use('/admin', isAdmin, AdminRoutes);


// Start the server
const PORT = process.env.PORT || 30360;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
