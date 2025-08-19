module.exports = (sequelize, DataTypes) => {
  const Consultation = sequelize.define('Consultation', {
    consultation_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users', 
        key: 'userId'
      },
      onDelete: 'CASCADE'
    },
    counsellor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users', 
        key: 'userId'
      },
      onDelete: 'CASCADE'
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'consultations'
  });
  
  // Define associations
  Consultation.associate = (models) => {
    Consultation.belongsTo(models.User, {
      as: 'student',
      foreignKey: 'student_id',
      onDelete: 'CASCADE'
    });
  
    Consultation.belongsTo(models.User, {
      as: 'counsellor',
      foreignKey: 'counsellor_id',
      onDelete: 'CASCADE'
    });
  };
  
  return Consultation;
};
  