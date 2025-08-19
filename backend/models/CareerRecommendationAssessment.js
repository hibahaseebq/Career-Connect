module.exports = (sequelize, DataTypes) => {
  const CareerRecommendationAssessment = sequelize.define('CareerRecommendationAssessment', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    career_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'career_recommendations',
        key: 'career_id'
      }
    },
    assessment_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'assessments',
        key: 'assessment_id'
      }
    }
  }, {
    tableName: 'career_recommendation_assessment',
    timestamps: false
  });
  
  CareerRecommendationAssessment.associate = (models) => {
    CareerRecommendationAssessment.belongsTo(models.CareerRecommendation, {
      foreignKey: 'career_id',
      onDelete: 'CASCADE'
    });
  
    CareerRecommendationAssessment.belongsTo(models.Assessment, {
      foreignKey: 'assessment_id',
      onDelete: 'CASCADE'
    });
  };
  
  return CareerRecommendationAssessment;
};
  