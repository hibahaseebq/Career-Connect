// Import necessary modules
const db = require('../../config/db');

// GroupPost 
class GroupPostModel {
    constructor(groupId, postId) {
        this.groupId = groupId;
        this.postId = postId;
    }
    // Add your static methods to interact with the database here...
}

module.exports = GroupPostModel;
