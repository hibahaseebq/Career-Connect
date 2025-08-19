// Import necessary modules
const db = require('../../config/db');

// AccountSettingsModel Model
class AccountSettingsModel {
    constructor(accountSettingsId, userId, languagePreference, timezone, themePreference, emailSubscription, twoFactorAuthentication, lastLogin) {
        this.accountSettingsId = accountSettingsId;
        this.userId = userId;
        this.languagePreference = languagePreference;
        this.timezone = timezone;
        this.themePreference = themePreference;
        this.emailSubscription = emailSubscription;
        this.twoFactorAuthentication = twoFactorAuthentication;
        this.lastLogin = lastLogin;
    }
    // Add your static methods to interact with the database here...
}

module.exports = AccountSettingsModel;
