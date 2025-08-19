module.exports = (sequelize, DataTypes) => {
  const CareerRecommendation = sequelize.define('CareerRecommendation', {
    career_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    career_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    required_skills: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    min_score: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    max_score: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'career_recommendations',
    timestamps: false
  });
  
  CareerRecommendation.associate = (models) => {
    CareerRecommendation.hasMany(models.Job, {
      foreignKey: 'career_id',
      onDelete: 'CASCADE'
    });
  
    CareerRecommendation.hasMany(models.CourseResource, {
      foreignKey: 'career_id',
      onDelete: 'CASCADE'
    });

    CareerRecommendation.belongsToMany(models.Assessment, {
      through: 'CareerRecommendationAssessment',
      foreignKey: 'career_id',
      otherKey: 'assessment_id',
      as: 'assessments'
    });
  
    CareerRecommendation.hasMany(models.ResultRecommendation, {
      foreignKey: 'career_id',
      onDelete: 'CASCADE'
    });
  };
  
  return CareerRecommendation;
};
  