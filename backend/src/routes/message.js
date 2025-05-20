const express = require('express');
const auth = require('../middleware/auth');
const Message = require('../models/Message');
const User = require('../models/User');

const router = express.Router();

// Obtener mensajes del chat general
router.get('/general', auth, async (req, res) => {
  try {
    const messages = await Message.findAll({
      where: { tipo: 'general' },
      include: [{ model: User, attributes: ['id', 'nombre', 'email'] }],
      order: [['createdAt', 'ASC']],
      limit: 100,
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los mensajes.', error });
  }
});

// Obtener mensajes del chat de un viaje
router.get('/trip/:tripId', auth, async (req, res) => {
  try {
    const messages = await Message.findAll({
      where: { tipo: 'viaje', tripId: req.params.tripId },
      include: [{ model: User, attributes: ['id', 'nombre', 'email'] }],
      order: [['createdAt', 'ASC']],
      limit: 100,
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los mensajes.', error });
  }
});

module.exports = router; 