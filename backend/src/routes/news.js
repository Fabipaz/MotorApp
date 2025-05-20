const express = require('express');
const News = require('../models/News');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

// Listar todas las noticias
router.get('/', async (req, res) => {
  try {
    const news = await News.findAll({ order: [['fecha', 'DESC']] });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener noticias', error });
  }
});

// Crear noticia (protegido)
router.post('/', auth, admin, async (req, res) => {
  try {
    const { titulo, contenido, imagen, enlace, fecha } = req.body;
    const noticia = await News.create({ titulo, contenido, imagen, enlace, fecha });
    res.status(201).json(noticia);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear noticia', error });
  }
});

// Ver una noticia
router.get('/:id', async (req, res) => {
  try {
    const noticia = await News.findByPk(req.params.id);
    if (!noticia) return res.status(404).json({ message: 'Noticia no encontrada' });
    res.json(noticia);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener noticia', error });
  }
});

// Actualizar noticia (protegido)
router.put('/:id', auth, admin, async (req, res) => {
  try {
    const noticia = await News.findByPk(req.params.id);
    if (!noticia) return res.status(404).json({ message: 'Noticia no encontrada' });
    await noticia.update(req.body);
    res.json(noticia);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar noticia', error });
  }
});

// Eliminar noticia (protegido)
router.delete('/:id', auth, admin, async (req, res) => {
  try {
    const noticia = await News.findByPk(req.params.id);
    if (!noticia) return res.status(404).json({ message: 'Noticia no encontrada' });
    await noticia.destroy();
    res.json({ message: 'Noticia eliminada' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar noticia', error });
  }
});

module.exports = router; 