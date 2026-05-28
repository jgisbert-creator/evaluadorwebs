const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* SERVIR ARCHIVOS PUBLIC */
app.use(express.static(path.join(__dirname, "public")));

/* BASE DE DATOS TEMPORAL EN MEMORIA */

let incidencias = [];
let prestamos = [];
let colaEspera = [];

/* DISPOSITIVOS DISPONIBLES */

const dispositivos = [];

/* BOTIQUINES */

for(let i=1;i<=10;i++){

    dispositivos.push({
        nombre:`Botiquín ${i}`,
        estado:"Disponible"
    });

}

/* SEMIC */

for(let i=1;i<=11;i++){

    dispositivos.push({
        nombre:`Semic ${i}`,
        estado:"Disponible"
    });

}

/* ========================= */
/*        INCIDENCIAS        */
/* ========================= */

app.post("/incidencia",(req,res)=>{

    const nueva = {
        id: incidencias.length + 1,
        ticket: req.body.ticket,
        serie: req.body.serie,
        alumno: req.body.alumno,
        curso: req.body.curso,
        problema: req.body.problema,
        sustitucion: req.body.sustitucion,
        razon: req.body.razon || "",
        fecha: new Date().toLocaleString()
    };

    incidencias.push(nueva);

    /* COLA DE ESPERA */

    if(
        nueva.sustitucion === "No" &&
        nueva.razon.toLowerCase().includes("no habia")
    ){

        colaEspera.push({
            alumno:nueva.alumno,
            curso:nueva.curso,
            ticket:nueva.ticket
        });

    }

    res.json({
        ok:true,
        mensaje:"Incidencia registrada"
    });

});

/* ========================= */
/*         PRESTAMOS         */
/* ========================= */

app.post("/prestamo",(req,res)=>{

    const movimiento = {
        id: prestamos.length + 1,
        ticket:req.body.ticket,
        alumno:req.body.alumno,
        curso:req.body.curso,
        dispositivo:req.body.dispositivo,
        tipo:req.body.tipo,
        fecha:req.body.fecha
    };

    prestamos.push(movimiento);

    /* CAMBIO DE ESTADO */

    const disp = dispositivos.find(
        d => d.nombre === req.body.dispositivo
    );

    if(disp){

        if(req.body.tipo === "Entrega"){
            disp.estado = "Prestado";
        }

        if(req.body.tipo === "Devolución"){
            disp.estado = "Disponible";
        }

    }

    res.json({
        ok:true,
        mensaje:"Movimiento registrado"
    });

});

/* ========================= */
/*          BUSCAR           */
/* ========================= */

app.get("/buscar",(req,res)=>{

    const q = (req.query.q || "").toLowerCase();

    const incidenciasEncontradas = incidencias.filter(i =>
        i.ticket.toLowerCase().includes(q) ||
        i.serie.toLowerCase().includes(q) ||
        i.alumno.toLowerCase().includes(q)
    );

    const prestamosEncontrados = prestamos.filter(p =>
        p.ticket.toLowerCase().includes(q) ||
        p.alumno.toLowerCase().includes(q) ||
        p.dispositivo.toLowerCase().includes(q)
    );

    res.json({
        incidencias: incidenciasEncontradas,
        prestamos: prestamosEncontrados,
        cola: colaEspera
    });

});

/* ========================= */
/*      DISPOSITIVOS         */
/* ========================= */

app.get("/dispositivos",(req,res)=>{

    res.json(dispositivos);

});

/* ========================= */
/*      ULTIMAS INCIDENCIAS  */
/* ========================= */

app.get("/ultimas-incidencias",(req,res)=>{

    const ultimas = incidencias.slice(-5).reverse();

    res.json(ultimas);

});

/* ========================= */
/*         HOME              */
/* ========================= */

app.get("/",(req,res)=>{

    res.sendFile(
        path.join(__dirname,"public","chromebooks.html")
    );

});

/* ========================= */
/*        INICIAR            */
/* ========================= */

app.listen(PORT,()=>{

    console.log(`Servidor funcionando en puerto ${PORT}`);

});
