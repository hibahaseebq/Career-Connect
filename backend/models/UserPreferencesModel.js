// // models/UserPreferencesModel.js
// module.exports = (sequelize, DataTypes) => {
//   const UserPreferences = sequelize.define('UserPreferences', {
//     id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true
//     },
//     userId: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: 'users',
//         key: 'id'
//       }
//     },
//     emailNotification: {
//       type: DataTypes.BOOLEAN,
//       allowNull: false,
//       defaultValue: false
//     },
//     smsNotification: {
//       type: DataTypes.BOOLEAN,
//       allowNull: false,
//       defaultValue: false
//     },
//     openToJob: {
//       type: DataTypes.BOOLEAN,
//       allowNull: false,
//       defaultValue: false
//     },
    
//     jobPreference: DataTypes.STRING,
//     jobPreferences: DataTypes.TEXT,
//     jobLocations: DataTypes.TEXT,
//     remoteWorkOption: DataTypes.STRING
//   });

//   // Define associations
//   UserPreferences.associate = (models) => {
//     UserPreferences.belongsTo(models.User, {
//       foreignKey: 'userId',
//       onDelete: 'CASCADE'
//     });
//   };

//   return UserPreferences;
// };
