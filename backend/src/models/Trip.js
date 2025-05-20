const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const User = require('./User');

const Trip = sequelize.define('Trip', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  fecha_salida: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  origen: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  destino: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ruta_mapa: {
    type: DataTypes.STRING(2048),
    allowNull: true,
  },
});

// Relación: un usuario puede crear muchos viajes
User.hasMany(Trip, { foreignKey: 'creadorId', as: 'viajesCreados' });
Trip.belongsTo(User, { foreignKey: 'creadorId', as: 'creador' });

// Relación muchos a muchos: participantes
Trip.belongsToMany(User, { through: 'TripParticipants', as: 'participantes' });
User.belongsToMany(Trip, { through: 'TripParticipants', as: 'viajes' });

module.exports = Trip; 