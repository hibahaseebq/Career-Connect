// Import necessary modules
const db = require('../../config/db');

// Event Model
class EventModel {
    constructor(eventId, name, organizerId, latitude, longitude, datetime, description) {
        this.eventId = eventId;
        this.name = name;
        this.organizerId = organizerId;
        this.latitude = latitude;
        this.longitude = longitude;
        this.datetime = datetime;
        this.description = description;
    }
    // Add your static methods to interact with the database here...
}

module.exports = EventModel;
