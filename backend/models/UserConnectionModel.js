// models/UserConnectionModel.js
module.exports = (sequelize, DataTypes) => {
  const UserConnection = sequelize.define('UserConnection', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'userId'
      }
    },
    connectionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'userId'
      }
    },
    status: {
      type: DataTypes.ENUM('connected', 'pending', 'waiting'),
      allowNull: false,
      defaultValue: 'pending'
    }
  });

  // Define associations
  UserConnection.associate = (models) => {
    UserConnection.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  };
  
  return UserConnection;
};
  