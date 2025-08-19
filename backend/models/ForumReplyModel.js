
// models/ForumReplyModel.js
module.exports = (sequelize, DataTypes) => {
  const ForumReply = sequelize.define('ForumReply', {
    
    reply_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'forum_posts',
        key: 'post_id'
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'userId'
      }
    },
  
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    tableName: 'forum_replies'
  });
  
  // Define associations
  ForumReply.associate = (models) => {
    ForumReply.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });

    ForumReply.belongsTo(models.ForumPost, { 
      foreignKey: 'post_id',
      onDelete: 'CASCADE'
    });
  };


  return ForumReply;
};
  