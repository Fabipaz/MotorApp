const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const User = require('./User');

const Profile = sequelize.define('Profile', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  foto: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  biografia: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  ciudad: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  moto: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  redes_sociales: {
    type: DataTypes.JSON,
    allowNull: true,
  },
}, {
  timestamps: true,
});

User.hasOne(Profile, { foreignKey: 'userId', onDelete: 'CASCADE' });
Profile.belongsTo(User, { foreignKey: 'userId' });

module.exports = Profile; 