module.exports = (sequelize, DataTypes) => {
  const Profile = sequelize.define('Profile', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'userId'
      },
      onDelete: 'CASCADE'
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT
    },
    address: {
      type: DataTypes.STRING
    },
    profilePicture: {
      type: DataTypes.STRING
    },
    bannerPicture: {
      type: DataTypes.STRING(1000)
    },
 
    summary: {
      type: DataTypes.TEXT
    },
    skills: {
      type: DataTypes.TEXT
    },
    education: {
      type: DataTypes.TEXT
    },
    experience: {
      type: DataTypes.TEXT
    },
    certifications: {
      type: DataTypes.TEXT
    },
    languages: {
      type: DataTypes.TEXT
    },
    interests: {
      type: DataTypes.TEXT
    },
    
    country: {
      type: DataTypes.STRING
    },
    region: {
      type: DataTypes.STRING
    },
    district: {
      type: DataTypes.STRING
    },
    collegeOrUniversity: {
      type: DataTypes.STRING
    },
    employmentType: {
      type: DataTypes.STRING
    },
    companyName: {
      type: DataTypes.STRING
    },
    
    phoneNumber: {
      type: DataTypes.STRING
    },
    headline: DataTypes.TEXT,
    bio: DataTypes.TEXT,
    avatarURL: DataTypes.STRING(1000),
    socialLinks: {
      type: DataTypes.JSON,
      allowNull: true 
    },
    contactInfo: {
      type: DataTypes.STRING
    },
    websiteLink: {
      type: DataTypes.STRING
    },
    // exclude this field
    connections: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    selfEmployed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
    
  });
  
  Profile.associate = (models) => {
    
    // console.log("🚀 ~ console:", models)
    Profile.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
      onDelete: 'CASCADE'
    });
  };


  return Profile;
};
