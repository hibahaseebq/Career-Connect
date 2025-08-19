module.exports = (sequelize, DataTypes) => {
  const ResultRecommendation = sequelize.define('ResultRecommendation', {
    recommendation_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    result_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'assessment_results',
        key: 'result_id'
      },
      onDelete: 'CASCADE'
    },
    career_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'career_recommendations',
        key: 'career_id'
      },
      onDelete: 'CASCADE'
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'result_recommendations',
    timestamps: false
  });
  
  ResultRecommendation.associate = (models) => {
    ResultRecommendation.belongsTo(models.AssessmentResult, {
      foreignKey: 'result_id',
      onDelete: 'CASCADE'
    });
  
    ResultRecommendation.belongsTo(models.CareerRecommendation, {
      foreignKey: 'career_id',
      onDelete: 'CASCADE'
    });
  };
  
  return ResultRecommendation;
};
  