module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('users', {
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    emailAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
   
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'roles',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    emailVerified: {
      type: DataTypes.BOOLEAN
    },
    
    verificationCode: {
      type: DataTypes.STRING
    }
  });

  User.associate = (models) => {
    // User.hasOne(models.UserPreferences, {
    //   foreignKey: 'userId',
    //   onDelete: 'CASCADE'
    // });

    User.hasOne(models.Profile, {
      foreignKey: 'userId',
      as: 'profile',
      onDelete: 'CASCADE'
    });
    
    User.belongsToMany(models.UserConnection, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });

    User.hasMany(models.ForumPost, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });

    User.hasMany(models.ForumReply, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });

    User.hasMany(models.AssessmentResult, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });

    User.hasMany(models.Consultation, {
      foreignKey: 'student_id',
      as: 'studentConsultations',
      onDelete: 'CASCADE'
    });

    User.hasMany(models.Consultation, {
      foreignKey: 'counsellor_id',
      as: 'counsellorConsultations',
      onDelete: 'CASCADE'
    });
  };



  return User;
};
