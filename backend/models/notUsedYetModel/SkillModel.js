// Import necessary modules
const db = require('../../config/db');

// Skill 
class SkillModel {
    constructor(skillId, name, category, description) {
        this.skillId = skillId;
        this.name = name;
        this.category = category;
        this.description = description;
    }
    // Add your static methods to interact with the database here...
}

module.exports = SkillModel;
