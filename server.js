require('dotenv').config();

const express = require('express');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);

const pool = require('./db');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.use(session({
  store: new pgSession({
    pool: pool,
    tableName: 'session'
  }),
  secret: 'chromebooks-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 60 * 24
  }
}));

const PORT = process.env.PORT || 3000;

/* =========================
   PAGINA PRINCIPAL
========================= */

app.get('/', (req, res) => {
  res.send('Servidor funcionando correctamente');
});

/* =========================
   REGISTRAR INCIDENCIA
========================= */

app.post('/incidencias', async (req, res) => {

  const {
    alumno,
    serie,
    descripcion
  } = req.body;

  try {

    await pool.query(
      `
      INSERT INTO incidencias
      (alumno, serie, descripcion)
      VALUES ($1,$2,$3)
      `,
      [alumno, serie, descripcion]
    );

    res.json({
      success: true,
      mensaje: 'Incidencia registrada'
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      mensaje: 'Error al registrar incidencia'
    });

  }

});

/* =========================
   REGISTRAR PRESTAMO
========================= */

app.post('/prestamos', async (req, res) => {

  const {
    alumno,
    dispositivo
  } = req.body;

  try {

    await pool.query(
      `
      INSERT INTO prestamos
      (alumno, dispositivo, estado)
      VALUES ($1,$2,'prestado')
      `,
      [alumno, dispositivo]
    );

    await pool.query(
      `
      UPDATE chromebooks
      SET disponible = false
      WHERE nombre = $1
      `,
      [dispositivo]
    );

    res.json({
      success: true,
      mensaje: 'Préstamo registrado'
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      mensaje: 'Error al registrar préstamo'
    });

  }

});

/* =========================
   DEVOLUCION
========================= */

app.post('/devolucion', async (req, res) => {

  const {
    dispositivo
  } = req.body;

  try {

    await pool.query(
      `
      UPDATE prestamos
      SET estado = 'devuelto'
      WHERE dispositivo = $1
      `,
      [dispositivo]
    );

    await pool.query(
      `
      UPDATE chromebooks
      SET disponible = true
      WHERE nombre = $1
      `,
      [dispositivo]
    );

    res.json({
      success: true,
      mensaje: 'Devolución registrada'
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      mensaje: 'Error al registrar devolución'
    });

  }

});

/* =========================
   HISTORIAL INCIDENCIAS
========================= */

app.get('/historial', async (req, res) => {

  try {

    const resultado = await pool.query(
      `
      SELECT *
      FROM incidencias
      ORDER BY fecha DESC
      `
    );

    res.json(resultado.rows);

  } catch (error) {

    console.error(error);

    res.status(500).send('Error');

  }

});

/* =========================
   CHROMEBOOKS DISPONIBLES
========================= */

app.get('/disponibles', async (req, res) => {

  try {

    const resultado = await pool.query(
      `
      SELECT *
      FROM chromebooks
      WHERE disponible = true
      ORDER BY nombre
      `
    );

    res.json(resultado.rows);

  } catch (error) {

    console.error(error);

    res.status(500).send('Error');

  }

});

app.listen(PORT, () => {
  console.log(`Servidor iniciado en puerto ${PORT}`);
});
