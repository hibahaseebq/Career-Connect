// Import necessary modules
const db = require('../../config/db');

// Conversation Model
class ConversationModel {
    constructor(conversationId, visibility) {
        this.conversationId = conversationId;
        this.visibility = visibility;
    }
    // Add your static methods to interact with the database here...
}

module.exports = ConversationModel;
