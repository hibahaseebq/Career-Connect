module.exports = (sequelize, DataTypes) => {
  const AssessmentResult = sequelize.define('AssessmentResult', {
    result_id: {
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
      },
      onDelete: 'CASCADE'
    },
    assessment_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'assessments',
        key: 'assessment_id'
      },
      onDelete: 'CASCADE'
    },
    selected_options: {
      type: DataTypes.JSON, // Assuming selected options are stored as JSON
      allowNull: false
    },
    score: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      onUpdate: DataTypes.NOW
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'assessment_results',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['userId', 'assessment_id']
      }
    ]
  });
  
  AssessmentResult.associate = (models) => {
    AssessmentResult.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });

    AssessmentResult.hasMany(models.ResultRecommendation, {
      foreignKey: 'result_id',
      onDelete: 'CASCADE'
    });
  
    AssessmentResult.belongsTo(models.Assessment, {
      foreignKey: 'assessment_id',
      onDelete: 'CASCADE'
    });
  };
  
  return AssessmentResult;
};
  