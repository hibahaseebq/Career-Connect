// Import necessary modules
const db = require('../../config/db');

// Participant Model
class ParticipantModel {
    constructor(conversationId, userId) {
        this.conversationId = conversationId;
        this.userId = userId;
    }
    // Add your static methods to interact with the database here...
}

module.exports = ParticipantModel;
