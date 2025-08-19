// Import necessary modules
const db = require('../../config/db');

// NotificationPreferencesModel
class NotificationPreferencesModel {
    constructor(notificationPreferencesId, userId, emailNotifications, pushNotifications, inAppNotifications, notificationFrequency) {
        this.notificationPreferencesId = notificationPreferencesId;
        this.userId = userId;
        this.emailNotifications = emailNotifications;
        this.pushNotifications = pushNotifications;
        this.inAppNotifications = inAppNotifications;
        this.notificationFrequency = notificationFrequency;
    }
    // Add your static methods to interact with the database here...
}

module.exports = NotificationPreferencesModel;
