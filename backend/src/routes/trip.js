const express = require('express');
const auth = require('../middleware/auth');
const Trip = require('../models/Trip');
const User = require('../models/User');

const router = express.Router();

// Crear viaje
router.post('/', auth, async (req, res) => {
  try {
    const { titulo, descripcion, fecha_salida, origen, destino, ruta_mapa } = req.body;
    const trip = await Trip.create({
      titulo,
      descripcion,
      fecha_salida,
      origen,
      destino,
      ruta_mapa,
      creadorId: req.user.id,
    });
    // El creador se agrega como participante automáticamente
    const user = await User.findByPk(req.user.id);
    await trip.addParticipante(user);
    res.status(201).json(trip);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el viaje.', error });
  }
});

// Listar viajes
router.get('/', auth, async (req, res) => {
  try {
    const trips = await Trip.findAll({
      include: [
        { model: User, as: 'creador', attributes: ['id', 'nombre', 'email'] },
        { model: User, as: 'participantes', attributes: ['id', 'nombre', 'email'], through: { attributes: [] } },
      ],
      order: [['fecha_salida', 'ASC']],
    });
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: 'Error al listar los viajes.', error });
  }
});

// Ver detalles de un viaje
router.get('/:id', auth, async (req, res) => {
  try {
    const trip = await Trip.findByPk(req.params.id, {
      include: [
        { model: User, as: 'creador', attributes: ['id', 'nombre', 'email'] },
        { model: User, as: 'participantes', attributes: ['id', 'nombre', 'email'], through: { attributes: [] } },
      ],
    });
    if (!trip) return res.status(404).json({ message: 'Viaje no encontrado.' });
    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el viaje.', error });
  }
});

// Unirse a un viaje
router.post('/:id/join', auth, async (req, res) => {
  try {
    const trip = await Trip.findByPk(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Viaje no encontrado.' });
    const user = await User.findByPk(req.user.id);
    await trip.addParticipante(user);
    res.json({ message: 'Te has unido al viaje.' });
  } catch (error) {
    res.status(500).json({ message: 'Error al unirse al viaje.', error });
  }
});

// Salirse de un viaje
router.post('/:id/leave', auth, async (req, res) => {
  try {
    const trip = await Trip.findByPk(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Viaje no encontrado.' });
    const user = await User.findByPk(req.user.id);
    await trip.removeParticipante(user);
    res.json({ message: 'Has salido del viaje.' });
  } catch (error) {
    res.status(500).json({ message: 'Error al salir del viaje.', error });
  }
});

module.exports = router; 