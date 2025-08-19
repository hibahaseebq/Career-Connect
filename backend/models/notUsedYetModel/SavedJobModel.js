// Import necessary modules
const db = require('../../config/db');

// SavedJob Model
class SavedJobModel {
    constructor(savedJobId, userId, jobId, timestamp) {
        this.savedJobId = savedJobId;
        this.userId = userId;
        this.jobId = jobId;
        this.timestamp = timestamp;
    }
    // Add your static methods to interact with the database here...
}

module.exports = SavedJobModel;
