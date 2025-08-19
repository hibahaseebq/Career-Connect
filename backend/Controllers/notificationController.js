// const db = require('../models');
// const {models: {User}} = require('../models');
// const {models: {Notification}} = require('../models');
// exports.getNotifications = async (req, res) => {
//   try {
//     const notifications = await db.models.Notification.findAll({
//       order: [['createdAt', 'DESC']]
//     });
// // also implement join with user to get their profile url 
//     const connectionIds = [...new Set(notifications.map(notification => notification.connectionId))];

//     const connectionDetails = await db.models.User.findAll({
//       where: {
//         id: connectionIds
//       },
//       attributes: ['id', 'fullName', 'emailAddress'] 
//     });

//     const connectionDetailsMap = connectionDetails.reduce((map, user) => {
//       map[user.id] = user;

//       return map;
//     }, {});

//     const notificationsWithConnectionDetails = notifications.map(notification => ({
//       ...notification.toJSON(),
//       connectionDetails: connectionDetailsMap[notification.connectionId]
//     }));


    
//     res.json({notifications});
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({error: 'Error fetching notifications'});
//   }
// };


// exports.markAsRead = async (req, res) => {
//   const {id} = req.params;

//   try {
//     await db.models.Notification.update({status: 'read'}, {where: {id}});
//     res.status(200).json({message: 'Notification marked as read'});
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({error: 'Error marking notification as read'});
//   }
// };

// exports.deleteNotification = async (req, res) => {
//   const {id} = req.params;

//   try {
//     await db.models.Notification.destroy({where: {id}});
//     res.status(200).json({message: 'Notification deleted'});
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({error: 'Error deleting notification'});
//   }
// };


// exports.sendFriendRequest = async (req, res) => {
//   const {from, to} = req.body;

//   try {
//     await db.models.Notification.create({
//       body: `${from} has sent you a friend request!`,
//       userId: to, // Assuming 'to' is the recipient user ID
//       connectionId: from, // Assuming 'from' is the sender user ID
//       status: 'not_read',
//       time: new Date(),
//       type: 'req' // Assuming this is a friend request notification
//     });

//     res.status(200).json({message: 'Friend request sent successfully'});
//   } catch (error) {
//     console.error('Error sending friend request:', error);
//     res.status(500).json({error: 'Internal server error'});
//   }
// };
