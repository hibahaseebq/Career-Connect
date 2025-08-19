// models/ForumPostModel.js
module.exports = (sequelize, DataTypes) => {
  const ForumPost = sequelize.define('ForumPost', {
    post_id: {
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
    title: {
      type: DataTypes.STRING,
      allowNull: false
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
    tableName: 'forum_posts'
  });



  // Define associations
  ForumPost.associate = (models) => {
    ForumPost.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });

    ForumPost.hasMany(models.ForumReply, { 
      foreignKey: 'post_id',
      onDelete: 'CASCADE'
    });
  };

  return ForumPost;
};
