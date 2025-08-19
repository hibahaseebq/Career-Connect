// routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController.js');

// Route for getting notifications
router.get('/get', notificationController.getNotifications);

// Route for marking a notification as read
router.patch('/:id/read', notificationController.markAsRead);

// Route for deleting a notification
router.delete('/:id', notificationController.deleteNotification);

module.exports = router;
