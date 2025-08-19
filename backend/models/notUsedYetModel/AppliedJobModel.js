// Import necessary modules
const db = require('../../config/db');

// AppliedJob Model
class AppliedJobModel {
    constructor(appliedJobId, userId, jobId, applicationTimestamp) {
        this.appliedJobId = appliedJobId;
        this.userId = userId;
        this.jobId = jobId;
        this.applicationTimestamp = applicationTimestamp;
    }
    // Add your static methods to interact with the database here...
}

module.exports = AppliedJobModel;
