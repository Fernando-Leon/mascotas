const express = require('express');
const router = express.Router();
const {
  createResena,
  getResenasByUsuarioId,
  getResenaById,
  updateResena,
  deleteResena,
  getAllResenas
} = require('../controllers/resenasController');

// Rutas para las reseñas
router.post('/', createResena); // Crear una reseña
router.get('/', getAllResenas); // Obtener todas las reseñas
router.get('/usuario/:usuarioId', getResenasByUsuarioId); // Obtener reseñas de un usuario por ID
router.get('/:id', getResenaById); // Obtener una reseña por ID
router.put('/:id', updateResena); // Editar una reseña
router.delete('/:id', deleteResena); // Eliminar una reseña

module.exports = router;