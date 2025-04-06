const { poolPromise, sql } = require('../database/db');

// Crear un encargo
const createEncargo = async (req, res) => {
  const { TipoPerro, Descripcion, Pago, Latitud, Longitud, UsuarioId } = req.body;

  try {
    const pool = await poolPromise;
    await pool.request()
      .input('TipoPerro', sql.NVarChar, TipoPerro)
      .input('Descripcion', sql.NVarChar, Descripcion)
      .input('Pago', sql.Decimal(10, 2), Pago)
      .input('Latitud', sql.Float, Latitud)
      .input('Longitud', sql.Float, Longitud)
      .input('UsuarioId', sql.Int, UsuarioId)
      .query(`
        INSERT INTO Encargos (TipoPerro, Descripcion, Pago, Latitud, Longitud, UsuarioId)
        VALUES (@TipoPerro, @Descripcion, @Pago, @Latitud, @Longitud, @UsuarioId)
      `);
    res.status(201).send('Encargo creado exitosamente');
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Obtener todos los encargos
const getEncargos = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM Encargos');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Obtener encargos de un usuario por ID
const getEncargosByUsuarioId = async (req, res) => {
  const { usuarioId } = req.params;

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('UsuarioId', sql.Int, usuarioId)
      .query('SELECT * FROM Encargos WHERE UsuarioId = @UsuarioId');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Obtener encargos excluyendo los de un usuario
const getEncargosExcludingUsuarioId = async (req, res) => {
  const { usuarioId } = req.params;

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('UsuarioId', sql.Int, usuarioId)
      .query('SELECT * FROM Encargos WHERE UsuarioId != @UsuarioId');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Obtener un encargo por ID
const getEncargoById = async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('Id', sql.Int, id)
      .query('SELECT * FROM Encargos WHERE Id = @Id');
    if (result.recordset.length === 0) {
      return res.status(404).send('Encargo no encontrado');
    }
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Editar un encargo
const updateEncargo = async (req, res) => {
  const { id } = req.params;
  const { TipoPerro, Descripcion, Pago, Latitud, Longitud } = req.body;

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('Id', sql.Int, id)
      .input('TipoPerro', sql.NVarChar, TipoPerro)
      .input('Descripcion', sql.NVarChar, Descripcion)
      .input('Pago', sql.Decimal(10, 2), Pago)
      .input('Latitud', sql.Float, Latitud)
      .input('Longitud', sql.Float, Longitud)
      .query(`
        UPDATE Encargos
        SET TipoPerro = @TipoPerro, Descripcion = @Descripcion, Pago = @Pago, Latitud = @Latitud, Longitud = @Longitud
        WHERE Id = @Id
      `);
    if (result.rowsAffected[0] === 0) {
      return res.status(404).send('Encargo no encontrado');
    }
    res.send('Encargo actualizado exitosamente');
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Eliminar un encargo
const deleteEncargo = async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('Id', sql.Int, id)
      .query('DELETE FROM Encargos WHERE Id = @Id');
    if (result.rowsAffected[0] === 0) {
      return res.status(404).send('Encargo no encontrado');
    }
    res.send('Encargo eliminado exitosamente');
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Aceptar un encargo
const acceptEncargo = async (req, res) => {
  const { id } = req.params; // ID del encargo
  const { UsuarioAceptaId } = req.body;

  try {
    const pool = await poolPromise;

    // Verificar que el usuario no sea el creador del encargo
    const encargo = await pool.request()
      .input('Id', sql.Int, id)
      .query('SELECT UsuarioId FROM Encargos WHERE Id = @Id');
    if (encargo.recordset.length === 0) {
      return res.status(404).send('Encargo no encontrado');
    }
    if (encargo.recordset[0].UsuarioId === UsuarioAceptaId) {
      return res.status(400).send('No puedes aceptar tu propio encargo');
    }

    // Insertar la aceptación
    await pool.request()
      .input('EncargoId', sql.Int, id)
      .input('UsuarioAceptaId', sql.Int, UsuarioAceptaId)
      .query(`
        INSERT INTO Aceptaciones (EncargoId, UsuarioAceptaId)
        VALUES (@EncargoId, @UsuarioAceptaId)
      `);
    res.send('Encargo aceptado exitosamente');
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  createEncargo,
  getEncargos,
  getEncargosByUsuarioId,
  getEncargosExcludingUsuarioId,
  getEncargoById,
  updateEncargo,
  deleteEncargo,
  acceptEncargo,
};