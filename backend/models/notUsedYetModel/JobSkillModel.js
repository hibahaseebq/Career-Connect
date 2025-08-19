// Import necessary modules
const db = require('../../config/db');

// JobSkill 
class JobSkillModel {
    constructor(jobId, skillId) {
        this.jobId = jobId;
        this.skillId = skillId;
    }
    // Add your static methods to interact with the database here...
}

module.exports = JobSkillModel;
