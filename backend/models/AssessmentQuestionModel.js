module.exports = (sequelize, DataTypes) => {
  const AssessmentQuestion = sequelize.define('AssessmentQuestion', {
    question_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
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
    question_text: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'assessment_questions',
    timestamps: false
  });
  
  AssessmentQuestion.associate = (models) => {
    AssessmentQuestion.belongsTo(models.Assessment, {
      foreignKey: 'assessment_id',
      onDelete: 'CASCADE'
    });
  
    AssessmentQuestion.hasMany(models.AssessmentOption, {
      foreignKey: 'question_id',
      onDelete: 'CASCADE'
    });
  };
  
  return AssessmentQuestion;
};
  