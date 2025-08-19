module.exports = (sequelize, DataTypes) => {
  const CourseResource = sequelize.define('CourseResource', {
    resource_id: {
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
      },
      onDelete: 'CASCADE'
    },
    resource_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    resource_link: {
      type: DataTypes.STRING,
      allowNull: true
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
    tableName: 'course_resources',
    timestamps: false
  });
  
  CourseResource.associate = (models) => {
    CourseResource.belongsTo(models.CareerRecommendation, {
      foreignKey: 'career_id',
      onDelete: 'CASCADE'
    });
  };
  
  return CourseResource;
};
  