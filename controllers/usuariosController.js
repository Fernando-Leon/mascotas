const { poolPromise, sql } = require('../database/db');

const authenticateUsuario = async (req, res) => {
  const { Correo, Contrasena } = req.body;

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('Correo', sql.NVarChar, Correo)
      .input('Contrasena', sql.NVarChar, Contrasena)
      .query('SELECT Id, Nombre FROM Usuarios WHERE Correo = @Correo AND Contrasena = @Contrasena');

    if (result.recordset.length === 0) {
      return res.status(401).send('Credenciales inválidas');
    }

    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Crear un usuario
const createUsuario = async (req, res) => {
  const { Nombre, Apellido, Correo, Contrasena } = req.body;
  const ImagenPerfil = req.file ? req.file.path : null; // Ruta de la imagen subida

  try {
    const pool = await poolPromise;
    await pool.request()
      .input('Nombre', sql.NVarChar, Nombre)
      .input('Apellido', sql.NVarChar, Apellido)
      .input('Correo', sql.NVarChar, Correo)
      .input('Contrasena', sql.NVarChar, Contrasena)
      .input('ImagenPerfil', sql.NVarChar, ImagenPerfil)
      .query('INSERT INTO Usuarios (Nombre, Apellido, Correo, Contrasena, ImagenPerfil) VALUES (@Nombre, @Apellido, @Correo, @Contrasena, @ImagenPerfil)');
    res.status(201).send('Usuario creado exitosamente');
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Obtener todos los usuarios
const getUsuarios = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM Usuarios');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Obtener un usuario por ID
const getUsuarioById = async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('Id', sql.Int, id)
      .query('SELECT * FROM Usuarios WHERE Id = @Id');
    if (result.recordset.length === 0) {
      return res.status(404).send('Usuario no encontrado');
    }
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Actualizar un usuario
const updateUsuario = async (req, res) => {
  const { id } = req.params;
  const { Nombre, Apellido, Correo, Contrasena } = req.body;
  const ImagenPerfil = req.file ? req.file.path : null; // Ruta de la imagen subida

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('Id', sql.Int, id)
      .input('Nombre', sql.NVarChar, Nombre)
      .input('Apellido', sql.NVarChar, Apellido)
      .input('Correo', sql.NVarChar, Correo)
      .input('Contrasena', sql.NVarChar, Contrasena)
      .input('ImagenPerfil', sql.NVarChar, ImagenPerfil)
      .query(`
        UPDATE Usuarios
        SET
          Nombre = @Nombre,
          Apellido = @Apellido,
          Correo = @Correo,
          Contrasena = @Contrasena,
          ImagenPerfil = ISNULL(@ImagenPerfil, ImagenPerfil)
        WHERE Id = @Id
      `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).send('Usuario no encontrado');
    }
    res.send('Usuario actualizado exitosamente');
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Eliminar un usuario
const deleteUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('Id', sql.Int, id)
      .query('DELETE FROM Usuarios WHERE Id = @Id');
    if (result.rowsAffected[0] === 0) {
      return res.status(404).send('Usuario no encontrado');
    }
    res.send('Usuario eliminado exitosamente');
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  createUsuario,
  getUsuarios,
  getUsuarioById,
  updateUsuario,
  deleteUsuario,
  authenticateUsuario,
};