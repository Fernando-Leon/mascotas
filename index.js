const express = require('express');
const app = express();
const cors = require("cors");
const usuariosRoutes = require('./routes/usuariosRoutes');
const resenasRoutes = require('./routes/resenasRoutes');
const encargosRoutes = require('./routes/encargosRoutes');

require('dotenv').config();

var corsOptions = {
  origin: ["*"]
};

app.use(cors(corsOptions));

app.use(express.json());

// Routes
app.use('/usuarios', usuariosRoutes);
app.use('/resenas', resenasRoutes);
app.use('/encargos', encargosRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});