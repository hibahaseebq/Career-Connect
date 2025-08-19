// Import necessary modules
const db = require('../../config/db');

// Message Model
class MessageModel {
    constructor(messageId, conversationId, senderId, content, timestamp) {
        this.messageId = messageId;
        this.conversationId = conversationId;
        this.senderId = senderId;
        this.content = content;
        this.timestamp = timestamp;
    }
    // Add your static methods to interact with the database here...
}

module.exports = MessageModel;
