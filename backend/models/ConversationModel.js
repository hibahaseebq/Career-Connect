module.exports = (sequelize, DataTypes) => {
    const Conversation = sequelize.define('Conversation', {
      conversation_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      participant1_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'userId'
        },
        onDelete: 'CASCADE'
      },
      participant2_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'userId'
        },
        onDelete: 'CASCADE'
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    }, {
      tableName: 'conversations',
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ['participant1_id', 'participant2_id']
        }
      ],
      hooks: {
        beforeValidate: (conversation, options) => {
          // Ensure participant1_id is always less than participant2_id
          if (conversation.participant1_id > conversation.participant2_id) {
            [conversation.participant1_id, conversation.participant2_id] = 
              [conversation.participant2_id, conversation.participant1_id];
          }
        }
      }
    });
    
    Conversation.associate = (models) => {
      Conversation.belongsTo(models.User, {
        foreignKey: 'participant1_id',
        as: 'participant1'
      });
      Conversation.belongsTo(models.User, {
        foreignKey: 'participant2_id',
        as: 'participant2'
      });
      Conversation.hasMany(models.Message, {
        foreignKey: 'conversation_id',
        as: 'messages',
        onDelete: 'CASCADE'
      });
    };
    
    return Conversation;
  };