// Import necessary modules
const db = require('../../config/db');

// Group 
class GroupModel {
    constructor(groupId, name, description) {
        this.groupId = groupId;
        this.name = name;
        this.description = description;
    }
    // Add your static methods to interact with the database here...
}

module.exports = GroupModel;
