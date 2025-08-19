// Import necessary modules
const db = require('../../config/db');

// PrivacySettings Model
class PrivacySettingsModel {
    constructor(privacySettingsId, userId, visibilityProfile, visibilityPosts, visibilityConnections, visibilityEvents, visibilityJobApplications) {
        this.privacySettingsId = privacySettingsId;
        this.userId = userId;
        this.visibilityProfile = visibilityProfile;
        this.visibilityPosts = visibilityPosts;
        this.visibilityConnections = visibilityConnections;
        this.visibilityEvents = visibilityEvents;
        this.visibilityJobApplications = visibilityJobApplications;
    }
    // Add your static methods to interact with the database here...
}

module.exports = PrivacySettingsModel;
