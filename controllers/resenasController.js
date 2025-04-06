const { poolPromise, sql } = require('../database/db');

// Crear una reseña
const createResena = async (req, res) => {
  const { UsuarioId, EscritoPorId, Contenido } = req.body;

  try {
    const pool = await poolPromise;
    await pool.request()
      .input('UsuarioId', sql.Int, UsuarioId)
      .input('EscritoPorId', sql.Int, EscritoPorId)
      .input('Contenido', sql.NVarChar, Contenido)
      .query(`
        INSERT INTO Resenas (UsuarioId, EscritoPorId, Contenido)
        VALUES (@UsuarioId, @EscritoPorId, @Contenido)
      `);
    res.status(201).send('Reseña creada exitosamente');
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Obtener todas las reseñas de un usuario por su ID
const getResenasByUsuarioId = async (req, res) => {
  const { usuarioId } = req.params;

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('UsuarioId', sql.Int, usuarioId)
      .query(`
        SELECT * FROM Resenas
        WHERE UsuarioId = @UsuarioId
      `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Obtener una reseña por su ID
const getResenaById = async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('Id', sql.Int, id)
      .query(`
        SELECT * FROM Resenas
        WHERE Id = @Id
      `);
    if (result.recordset.length === 0) {
      return res.status(404).send('Reseña no encontrada');
    }
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Editar una reseña
const updateResena = async (req, res) => {
  const { id } = req.params;
  const { Contenido } = req.body;

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('Id', sql.Int, id)
      .input('Contenido', sql.NVarChar, Contenido)
      .query(`
        UPDATE Resenas
        SET Contenido = @Contenido
        WHERE Id = @Id
      `);
    if (result.rowsAffected[0] === 0) {
      return res.status(404).send('Reseña no encontrada');
    }
    res.send('Reseña actualizada exitosamente');
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Eliminar una reseña
const deleteResena = async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('Id', sql.Int, id)
      .query(`
        DELETE FROM Resenas
        WHERE Id = @Id
      `);
    if (result.rowsAffected[0] === 0) {
      return res.status(404).send('Reseña no encontrada');
    }
    res.send('Reseña eliminada exitosamente');
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Obtener todas las reseñas
const getAllResenas = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT * FROM Resenas
    `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
};


module.exports = {
  createResena,
  getResenasByUsuarioId,
  getResenaById,
  updateResena,
  deleteResena,
  getAllResenas,
};