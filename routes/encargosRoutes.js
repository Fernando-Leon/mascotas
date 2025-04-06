const express = require('express');
const router = express.Router();
const {
  createEncargo,
  getEncargos,
  getEncargosByUsuarioId,
  getEncargosExcludingUsuarioId,
  getEncargoById,
  updateEncargo,
  deleteEncargo,
  acceptEncargo,
} = require('../controllers/encargosController');

// Rutas para los encargos
router.post('/', createEncargo); // Crear un encargo
router.get('/', getEncargos); // Obtener todos los encargos
router.get('/usuario/:usuarioId', getEncargosByUsuarioId); // Obtener encargos de un usuario
router.get('/excluir/:usuarioId', getEncargosExcludingUsuarioId); // Obtener encargos excluyendo los del usuario
router.get('/:id', getEncargoById); // Obtener un encargo por ID
router.put('/:id', updateEncargo); // Editar un encargo
router.delete('/:id', deleteEncargo); // Eliminar un encargo
router.post('/:id/aceptar', acceptEncargo); // Aceptar un encargo

module.exports = router;