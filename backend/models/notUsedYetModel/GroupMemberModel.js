// Import necessary modules
const db = require('../../config/db');

// GroupMember 
class GroupMemberModel {
    constructor(groupId, userId) {
        this.groupId = groupId;
        this.userId = userId;
    }
    // Add your static methods to interact with the database here...
}

module.exports = GroupMemberModel;
