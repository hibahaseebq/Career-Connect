// Import necessary modules
const db = require('../../config/db');

// EventAttendee Model
class EventAttendeeModel {
    constructor(eventId, userId) {
        this.eventId = eventId;
        this.userId = userId;
    }
    // Add your static methods to interact with the database here...
}

module.exports = EventAttendeeModel;
