const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

/* BASE DE DATOS */

const db = new sqlite3.Database("./chromebooks.db");

/* TABLA INCIDENCIAS */

db.run(`
CREATE TABLE IF NOT EXISTS incidencias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    alumno TEXT,
    dispositivo TEXT,
    descripcion TEXT,
    estado TEXT,
    fecha TEXT
)
`);

/* TABLA PRESTAMOS */

db.run(`
CREATE TABLE IF NOT EXISTS prestamos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    alumno TEXT,
    dispositivo TEXT,
    fecha TEXT,
    devuelto INTEGER DEFAULT 0
)
`);

/* INICIO */

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

/* LISTA DISPOSITIVOS */

app.get("/dispositivos", (req, res) => {

    const dispositivos = [];

    for(let i=1;i<=10;i++){
        dispositivos.push({
            nombre: `Botiquín ${i}`,
            estado: "Disponible"
        });
    }

    for(let i=1;i<=11;i++){
        dispositivos.push({
            nombre: `Semic ${i}`,
            estado: "Disponible"
        });
    }

    res.json(dispositivos);
});

/* GUARDAR INCIDENCIA */

app.post("/incidencias", (req,res)=>{

    const { alumno, dispositivo, descripcion } = req.body;

    const fecha = new Date().toLocaleDateString();

    db.run(
        `INSERT INTO incidencias
        (alumno, dispositivo, descripcion, estado, fecha)
        VALUES (?,?,?,?,?)`,
        [alumno, dispositivo, descripcion, "Abierta", fecha],
        function(err){

            if(err){
                res.status(500).json({error: err.message});
            }else{
                res.json({
                    ok:true,
                    id:this.lastID
                });
            }

        }
    );

});

/* LISTAR INCIDENCIAS */

app.get("/incidencias", (req,res)=>{

    db.all(
        `SELECT * FROM incidencias ORDER BY id DESC`,
        [],
        (err,rows)=>{

            if(err){
                res.status(500).json({error: err.message});
            }else{
                res.json(rows);
            }

        }
    );

});

/* NUEVO PRESTAMO */

app.post("/prestamos",(req,res)=>{

    const { alumno, dispositivo } = req.body;

    const fecha = new Date().toLocaleDateString();

    db.run(
        `INSERT INTO prestamos
        (alumno, dispositivo, fecha)
        VALUES (?,?,?)`,
        [alumno, dispositivo, fecha],
        function(err){

            if(err){
                res.status(500).json({error: err.message});
            }else{
                res.json({
                    ok:true,
                    id:this.lastID
                });
            }

        }
    );

});

/* LISTAR PRESTAMOS */

app.get("/prestamos",(req,res)=>{

    db.all(
        `SELECT * FROM prestamos ORDER BY id DESC`,
        [],
        (err,rows)=>{

            if(err){
                res.status(500).json({error: err.message});
            }else{
                res.json(rows);
            }

        }
    );

});

app.listen(PORT, ()=>{
    console.log("Servidor funcionando correctamente");
});
