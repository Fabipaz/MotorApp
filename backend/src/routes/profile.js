const express = require('express');
const auth = require('../middleware/auth');
const Profile = require('../models/Profile');
const User = require('../models/User');

const router = express.Router();

// Obtener perfil del usuario autenticado
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ where: { userId: req.user.id } });
    if (!profile) {
      return res.status(404).json({ message: 'Perfil no encontrado.' });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el perfil.', error });
  }
});

// Actualizar perfil del usuario autenticado
router.put('/me', auth, async (req, res) => {
  try {
    const { foto, biografia, ciudad, moto, redes_sociales } = req.body;
    let profile = await Profile.findOne({ where: { userId: req.user.id } });
    if (!profile) {
      // Si no existe, lo crea
      profile = await Profile.create({
        userId: req.user.id,
        foto,
        biografia,
        ciudad,
        moto,
        redes_sociales,
      });
    } else {
      await profile.update({ foto, biografia, ciudad, moto, redes_sociales });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el perfil.', error });
  }
});

module.exports = router; 