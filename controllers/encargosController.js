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
    const result = await pool.request().query(`
      SELECT 
        Id AS EncargoId,
        TipoPerro,
        Descripcion,
        Pago,
        FORMAT(FechaHoraPublicacion, 'yyyy-MM-dd') AS FechaHoraPublicacion, -- Formatear la fecha
        Latitud,
        Longitud,
        UsuarioId,
        UsuarioAceptaId,
        FORMAT(FechaAceptacion, 'yyyy-MM-dd') AS FechaAceptacion -- Formatear la fecha
      FROM Encargos
    `);
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
      .query(`
        SELECT 
          Id AS EncargoId,
          TipoPerro,
          Descripcion,
          Pago,
          FORMAT(FechaHoraPublicacion, 'yyyy-MM-dd') AS FechaHoraPublicacion, -- Formatear la fecha
          Latitud,
          Longitud,
          UsuarioId
        FROM Encargos
        WHERE UsuarioId = @UsuarioId
      `);
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
      .query(`
        SELECT 
          Id AS EncargoId,
          TipoPerro,
          Descripcion,
          Pago,
          FORMAT(FechaHoraPublicacion, 'yyyy-MM-dd') AS FechaHoraPublicacion, -- Formatear la fecha
          Latitud,
          Longitud,
          UsuarioId
        FROM Encargos
        WHERE UsuarioId != @UsuarioId
      `);
    res.json(result.recordset);
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
  const { UsuarioAceptaId } = req.body; // ID del usuario que acepta el encargo

  try {
    const pool = await poolPromise;

    // Verificar que el encargo existe
    const encargo = await pool.request()
      .input('Id', sql.Int, id)
      .query('SELECT UsuarioId FROM Encargos WHERE Id = @Id');
    if (encargo.recordset.length === 0) {
      return res.status(404).send('Encargo no encontrado');
    }

    // Verificar que el usuario no sea el creador del encargo
    if (encargo.recordset[0].UsuarioId === UsuarioAceptaId) {
      return res.status(400).send('No puedes aceptar tu propio encargo');
    }

    // Actualizar el encargo con los datos de aceptación
    await pool.request()
      .input('Id', sql.Int, id)
      .input('UsuarioAceptaId', sql.Int, UsuarioAceptaId)
      .input('FechaAceptacion', sql.DateTime, new Date())
      .query(`
        UPDATE Encargos
        SET UsuarioAceptaId = @UsuarioAceptaId, FechaAceptacion = @FechaAceptacion
        WHERE Id = @Id
      `);

    res.send('Encargo aceptado exitosamente');
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const getEncargoById = async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('Id', sql.Int, id)
      .query(`
        SELECT 
          e.Id AS EncargoId,
          e.TipoPerro,
          e.Descripcion,
          e.Pago,
          FORMAT(e.FechaHoraPublicacion, 'yyyy-MM-dd') AS FechaHoraPublicacion,
          e.Latitud,
          e.Longitud,
          e.UsuarioId,
          u.Nombre AS UsuarioNombre,
          u.Apellido AS UsuarioApellido,
          e.UsuarioAceptaId, -- Usuario que aceptó el encargo
          ua.Nombre AS UsuarioAceptaNombre, -- Nombre del usuario que aceptó
          ua.Apellido AS UsuarioAceptaApellido, -- Apellido del usuario que aceptó
          FORMAT(e.FechaAceptacion, 'yyyy-MM-dd') AS FechaAceptacion -- Formatear la fecha
        FROM Encargos e
        LEFT JOIN Usuarios u ON e.UsuarioId = u.Id
        LEFT JOIN Usuarios ua ON e.UsuarioAceptaId = ua.Id -- Unión con el usuario que aceptó
        WHERE e.Id = @Id
      `);

    if (result.recordset.length === 0) {
      return res.status(404).send('Encargo no encontrado');
    }

    res.json(result.recordset[0]);
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