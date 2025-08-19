module.exports = (sequelize, DataTypes) => {
  const Job = sequelize.define('jobs', {
    // Define your fields here
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'userId'
      }
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
    
    companyId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    deadline: {
      type: DataTypes.DATE,
      allowNull: false
    },
    salaryMin: {
      type: DataTypes.INTEGER
    },
    salaryMax: {
      type: DataTypes.INTEGER
    },
    applicationLink: {
      type: DataTypes.STRING
    },
    hiringMultipleCandidate: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    jobType: {
      type: DataTypes.STRING
    },
    jobLocation: {
      type: DataTypes.STRING
    },
    jobLanguages: {
      type: DataTypes.JSON, 
      allowNull: true,
      defaultValue: []
    },
    skillsRequired: {
      type: DataTypes.JSON, // Store as JSON
      allowNull: true,
      defaultValue: []
    },
    isApproved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });

  Job.associate = (models) => {
    Job.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });

    Job.belongsTo(models.CareerRecommendation, {
      foreignKey: 'career_id',
      onDelete: 'CASCADE'
    });
  };

  return Job;
};
