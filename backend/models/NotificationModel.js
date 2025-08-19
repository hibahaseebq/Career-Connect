// module.exports = (sequelize, DataTypes) => {
//   const Notification = sequelize.define('Notification', {
//     body: {
//       type: DataTypes.STRING,
//       allowNull: false
//     },
//     userId: {
//       type: DataTypes.INTEGER,
//       allowNull: false
//     },
//     connectionId: {
//       type: DataTypes.INTEGER,
//       allowNull: false
//     },
//     status: {
//       type: DataTypes.ENUM('read', 'not_read'),
//       allowNull: false,
//       defaultValue: 'not_read'
//     },
//     time: {
//       type: DataTypes.DATE,
//       allowNull: false,
//       defaultValue: DataTypes.NOW
//     },
//     type: {
//       type: DataTypes.ENUM('req', 'res'),
//       allowNull: false
//     }
//   });

//   // Define associations
//   Notification.associate = (models) => {
//     Notification.belongsTo(models.User, {foreignKey: 'userId', as: 'user'});
//   };

//   return Notification;
// };
