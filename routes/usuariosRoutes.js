const express = require('express');
const router = express.Router();
const {
  createUsuario,
  getUsuarios,
  getUsuarioById,
  updateUsuario,
  deleteUsuario,
  authenticateUsuario
} = require('../controllers/usuariosController');
const upload = require('../middleware/upload');

// Auth
router.post('/auth', authenticateUsuario);

// Rutas CRUD
router.post('/', upload.single('ImagenPerfil'), createUsuario);
router.get('/', getUsuarios); // Obtener todos los usuarios
router.get('/:id', getUsuarioById); // Obtener usuario por ID
router.put('/:id', upload.single('ImagenPerfil'), updateUsuario); // Actualizar usuario
router.delete('/:id', deleteUsuario); // Eliminar usuario

module.exports = router;