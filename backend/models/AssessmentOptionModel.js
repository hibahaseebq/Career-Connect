module.exports = (sequelize, DataTypes) => {
  const AssessmentOption = sequelize.define('AssessmentOption', {
    option_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    question_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'assessment_questions',
        key: 'question_id'
      },
      onDelete: 'CASCADE'
    },
    option_text: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    is_correct: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'assessment_options',
    timestamps: false
  });
  
  AssessmentOption.associate = (models) => {
    AssessmentOption.belongsTo(models.AssessmentQuestion, {
      foreignKey: 'question_id',
      onDelete: 'CASCADE'
    });
  };
  
  return AssessmentOption;
};
