module.exports = (sequelize, DataTypes) => {
  const Progress = sequelize.define('Progress', {
    progress_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    goal_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'goals',
        key: 'goal_id'
      },
      onDelete: 'CASCADE'
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'progress',
    timestamps: true
  });
  
  Progress.associate = (models) => {
    Progress.belongsTo(models.Goal, {
      foreignKey: 'goal_id',
      as: 'goal',
      onDelete: 'CASCADE'
    });
  };
  
  return Progress;
};
  