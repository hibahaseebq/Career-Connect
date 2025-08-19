// CareerRoutes.js
const express = require('express');
const router = express.Router();
const {MessagesController} = require('../Controllers/index');
const {people} = require('../Controllers/index');

router.get('/conversations', MessagesController.getConversations);

router.get('/conversations/:conversation_id/messages', MessagesController.getMessages);
router.get('/messages/unread', MessagesController.getUnreadMessages);
router.get('/messages/unread/count', MessagesController.getUnreadMessageCount);


router.delete('/messages/:message_id', MessagesController.deleteMessage);

router.put('/messages/:message_id/read', MessagesController.markMessageAsRead);
router.put('/messages/read/all', MessagesController.markAllMessagesAsRead);


// ok
router.get('/users', people.listUsers);
router.get('/conversations/user', MessagesController.getConversationsByUser);
router.post('/conversations', MessagesController.createConversation);
router.delete('/conversations/:conversation_id', MessagesController.deleteConversation);
router.get('/conversations/:conversation_id', MessagesController.getConversationsById);
router.post('/conversations/:conversation_id', MessagesController.createMessage);
router.get('/conversations/:conversation_id/messages', MessagesController.getMessagesByUser);

router.post('/conversations/:conversation_id/mark-as-read', MessagesController.markMessageAsRead);

module.exports = router;