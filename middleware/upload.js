// filepath: c:\Users\ferna\Documents\ppt\api-mascotas\src\middleware\upload.js
const multer = require('multer');
const path = require('path');

// Configuración de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads')); // Ruta donde se guardarán los archivos
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

module.exports = upload;