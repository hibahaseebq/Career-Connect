module.exports = (sequelize, DataTypes) => {
  const Assessment = sequelize.define('Assessment', {
    assessment_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    assessment_type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'assessments',
    timestamps: false
  });
  
  Assessment.associate = (models) => {
    Assessment.hasMany(models.AssessmentQuestion, {
      foreignKey: 'assessment_id',
      onDelete: 'CASCADE'
    });
  
    Assessment.hasMany(models.AssessmentResult, {
      foreignKey: 'assessment_id',
      onDelete: 'CASCADE'
    });
    Assessment.belongsToMany(models.CareerRecommendation, {
      through: 'CareerRecommendationAssessment',
      foreignKey: 'assessment_id',
      otherKey: 'career_id',
      as: 'careerRecommendations'
    });
  };
  
  return Assessment;
};
  