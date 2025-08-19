module.exports = (sequelize, DataTypes) => {
    const UserNotification = sequelize.define('UserNotification', {
      body: {
        type: DataTypes.STRING,
        allowNull: false
      },
      from: {
        type: DataTypes.STRING,
        allowNull: false
      },
      to: {
        type: DataTypes.STRING,
        allowNull: false
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: 'not_read'
      },
      time: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      type: {
        type: DataTypes.STRING
      }
    });
  
    return UserNotification;
  };
  