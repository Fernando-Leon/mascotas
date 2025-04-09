const express = require('express');
const app = express();
const cors = require("cors");
const usuariosRoutes = require('./routes/usuariosRoutes');
const resenasRoutes = require('./routes/resenasRoutes');
const encargosRoutes = require('./routes/encargosRoutes');
const path = require('path');

require('dotenv').config();

const fs = require('fs');
const uploadsDir = path.join(__dirname, '../uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

var corsOptions = {
  origin: ["*"]
};

app.use(cors(corsOptions));

app.use(express.json());

// 🔐 Servir la carpeta "uploads" como estática
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/usuarios', usuariosRoutes);
app.use('/resenas', resenasRoutes);
app.use('/encargos', encargosRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0',() => {
  console.log(`Server running on port ${PORT}`);
});