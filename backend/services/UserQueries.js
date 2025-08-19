// // userModel.js

const db = require('../config/db.js');
const { promisify } = require('util');

// // Promisify the query method of the database connection
// const queryAsync = promisify(db.query).bind(db);

// // Function to fetch user by username
// async function getUserByUsername(username) {
//     const sql = 'SELECT * FROM users WHERE username = ?';
//     try {
//         const rows = await queryAsync(sql, [username]);
//         return rows.length ? rows[0] : null; // Return the first row if found, or null if not found
//     } catch (error) {
//         console.error('Error fetching user by username:', error);
//         throw error; // Re-throw the error to handle it in the controller
//     }
// }

// // Function to fetch user by email
// async function getUserByEmail(email) {
//     const sql = 'SELECT * FROM users WHERE email = ?';
//     try {
//         const rows = await queryAsync(sql, [email]);
//         return rows.length ? rows[0] : null; // Return the first row if found, or null if not found
//     } catch (error) {
//         console.error('Error fetching user by email:', error);
//         throw error; // Re-throw the error to handle it in the controller
//     }
// }

// // Function to create a new user
// async function createUser(user) {
//     const { fullName, email, password, country, region, district, userType, isStudent, collegeOrUniversity, employmentType, companyName } = user;

//     const sql = `
//         INSERT INTO users (fullName, email, password, country, region, district, userType, isStudent, collegeOrUniversity, employmentType, companyName)
//         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//     `;
//     const values = [fullName, email, password, country, region, district, userType, isStudent, collegeOrUniversity, employmentType, companyName];

//     try {
//         const result = await queryAsync(sql, values);
//         return result.insertId; // Return the ID of the inserted user
//     } catch (error) {
//         console.error('Error creating user:', error);
//         throw error; // Re-throw the error to handle it in the controller
//     }
// }

// module.exports = {
//     getUserByUsername,
//     getUserByEmail,
//     createUser
// };


async function getUserByEmail(email) {
    try {
        const [rows] = await db.query('SELECT * FROM users WHERE emailAddress = ?', [email]);
        return rows[0];
    } catch (error) {
        console.error('Error getting user by email:', error);
        throw error;
    }
}

async function createUser(user) {
    try {
        await db.query('INSERT INTO users SET ?', user);
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
}

module.exports = {
        getUserByUsername,
        getUserByEmail,
        createUser
    };
    
    