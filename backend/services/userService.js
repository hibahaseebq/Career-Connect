// const sequelize = require('../config/db');



// async function showAllTables() {
//     try {
//         // Execute a raw SQL query to fetch all table names
//         const [results, metadata] = await sequelize.query("SHOW TABLES");
        
//         // Extract table names from results
//         const tables = results.map(result => result.jobconnects);
        
//         return tables;
//     } catch (error) {
//         console.error('Error showing all tables:', error);
//         throw error;
//     }
// }



// async function checkUserTableExists() {
//     try {
//         // Execute a raw SQL query to check if the table exists
//         const [results, metadata] = await sequelize.query("SHOW TABLES LIKE 'users'");
        
//         // If results array is not empty, the table exists
//         if (results.length > 0) {
//             return true;
//         } else {
//             return false;
//         }
//     } catch (error) {
//         console.error('Error checking if user table exists:', error);
//         throw error;
//     }
// }


// async function getUserByEmail(email) {
//     try {
//         const [rows] = await sequelize.query('SELECT * FROM users WHERE emailAddress = ?', {
//             replacements: [email],
//             type: sequelize.QueryTypes.SELECT
//         });
//         return rows[0];
//     } catch (error) {
//         console.error('Error getting user by email:', error);
//         throw error;
//     }
// }


// async function createUser(user) {
//     try {
//         await sequelize.query('INSERT INTO users SET ?', user);
//     } catch (error) {
//         console.error('Error creating user:', error);
//         throw error;
//     }
// }


// module.exports = { createUser, getUserByEmail, checkUserTableExists,showAllTables };
