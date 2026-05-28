const express = require("express");
const path = require("path");
const { Pool } = require("pg");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

/* CREAR TABLAS */

async function crearTablas() {

    await pool.query(`

    CREATE TABLE IF NOT EXISTS incidencias (

        id SERIAL PRIMARY KEY,

        ticket TEXT UNIQUE,

        serie TEXT,

        alumno TEXT,

        curso TEXT,

        problema TEXT,

        sustitucion TEXT,

        motivo TEXT,

        fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP

    )

    `);

    await pool.query(`

    CREATE TABLE IF NOT EXISTS prestamos (

        id SERIAL PRIMARY KEY,

        ticket TEXT,

        alumno TEXT,

        curso TEXT,

        dispositivo TEXT,

        movimiento TEXT,

        fecha TEXT

    )

    `);

    console.log("Tablas creadas");
}

crearTablas();

/* PAGINA PRINCIPAL */

app.get("/", (req, res) => {

    res.redirect("/chromebooks.html");

});

/* GUARDAR INCIDENCIA */

app.post("/incidencia", async(req, res) => {

    const {
        ticket,
        serie,
        alumno,
        curso,
        problema,
        sustitucion,
        motivo
    } = req.body;

    await pool.query(

        `INSERT INTO incidencias
        (ticket, serie, alumno, curso, problema, sustitucion, motivo)

        VALUES ($1,$2,$3,$4,$5,$6,$7)`,

        [
            ticket,
            serie,
            alumno,
            curso,
            problema,
            sustitucion,
            motivo
        ]
    );

    res.json({
        ok:true
    });

});

/* GUARDAR PRESTAMO */

app.post("/prestamo", async(req, res) => {

    const {
        ticket,
        alumno,
        curso,
        dispositivo,
        movimiento,
        fecha
    } = req.body;

    await pool.query(

        `INSERT INTO prestamos
        (ticket, alumno, curso, dispositivo, movimiento, fecha)

        VALUES ($1,$2,$3,$4,$5,$6)`,

        [
            ticket,
            alumno,
            curso,
            dispositivo,
            movimiento,
            fecha
        ]
    );

    res.json({
        ok:true
    });

});

/* BUSCADOR */

app.get("/buscar/:texto", async(req, res) => {

    const texto = `%${req.params.texto}%`;

    const incidencias =
        await pool.query(

            `SELECT * FROM incidencias

            WHERE

            alumno ILIKE $1
            OR ticket ILIKE $1
            OR serie ILIKE $1`,

            [texto]
        );

    const prestamos =
        await pool.query(

            `SELECT * FROM prestamos

            WHERE

            alumno ILIKE $1
            OR ticket ILIKE $1
            OR dispositivo ILIKE $1`,

            [texto]
        );

    res.json({

        incidencias: incidencias.rows,

        prestamos: prestamos.rows

    });

});

/* LISTA DISPOSITIVOS */

app.get("/dispositivos", (req,res)=>{

    const dispositivos = [];

    for(let i=1;i<=10;i++){

        dispositivos.push({
            nombre:`Botiquín ${i}`,
            estado:"Disponible"
        });

    }

    for(let i=1;i<=11;i++){

        dispositivos.push({
            nombre:`Semic ${i}`,
            estado:"Disponible"
        });

    }

    res.json(dispositivos);

});

/* SERVIDOR */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(`Servidor iniciado en puerto ${PORT}`);

});
