const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const User = require('./User');
const Trip = require('./Trip');

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  contenido: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  tipo: {
    type: DataTypes.ENUM('general', 'viaje'),
    allowNull: false,
    defaultValue: 'general',
  }
}, {
  timestamps: true,
});

// Relación: cada mensaje pertenece a un usuario
User.hasMany(Message, { foreignKey: 'userId' });
Message.belongsTo(User, { foreignKey: 'userId' });

// Relación: cada mensaje puede pertenecer a un viaje (opcional)
Trip.hasMany(Message, { foreignKey: 'tripId' });
Message.belongsTo(Trip, { foreignKey: 'tripId' });

module.exports = Message; 