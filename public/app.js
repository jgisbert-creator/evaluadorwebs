document.addEventListener("DOMContentLoaded", () => {

    cargarDispositivos();
    cargarIncidencias();

});

/* ========================= */
/*     CARGAR DISPOSITIVOS   */
/* ========================= */

async function cargarDispositivos(){

    const lista = document.getElementById("lista-dispositivos");

    if(!lista) return;

    lista.innerHTML = "";

    const res = await fetch("/dispositivos");
    const dispositivos = await res.json();

    dispositivos.forEach(d => {

        lista.innerHTML += `
            <div class="card-dispositivo">
                <h3>${d.nombre}</h3>
                <p>${d.estado}</p>
            </div>
        `;

    });

}

/* ========================= */
/*     CARGAR INCIDENCIAS    */
/* ========================= */

async function cargarIncidencias(){

    const lista = document.getElementById("lista-incidencias");

    if(!lista) return;

    lista.innerHTML = "";

    const res = await fetch("/ultimas-incidencias");
    const incidencias = await res.json();

    incidencias.forEach(i => {

        lista.innerHTML += `
            <div class="card-incidencia">
                <h3>${i.alumno}</h3>
                <p>${i.problema}</p>
                <small>${i.fecha}</small>
            </div>
        `;

    });

}

/* ========================= */
/*    REGISTRAR INCIDENCIA   */
/* ========================= */

async function registrarIncidencia(){

    const ticket = document.getElementById("ticket").value;
    const serie = document.getElementById("serie").value;
    const alumno = document.getElementById("alumno").value;
    const curso = document.getElementById("curso").value;
    const problema = document.getElementById("problema").value;
    const sustitucion = document.getElementById("sustitucion").value;
    const razon = document.getElementById("razon").value;

    const res = await fetch("/incidencia",{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body: JSON.stringify({
            ticket,
            serie,
            alumno,
            curso,
            problema,
            sustitucion,
            razon
        })

    });

    const data = await res.json();

    alert(data.mensaje);

    location.href = "/chromebooks.html";

}

/* ========================= */
/*      REGISTRAR PRESTAMO   */
/* ========================= */

async function registrarPrestamo(){

    const ticket = document.getElementById("ticket").value;
    const alumno = document.getElementById("alumno").value;
    const curso = document.getElementById("curso").value;
    const dispositivo = document.getElementById("dispositivo").value;
    const tipo = document.getElementById("tipo").value;
    const fecha = document.getElementById("fecha").value;

    const res = await fetch("/prestamo",{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body: JSON.stringify({
            ticket,
            alumno,
            curso,
            dispositivo,
            tipo,
            fecha
        })

    });

    const data = await res.json();

    alert(data.mensaje);

    location.href = "/chromebooks.html";

}

/* ========================= */
/*          BUSCADOR         */
/* ========================= */

async function buscar(){

    const q = document.getElementById("busqueda").value;

    const res = await fetch(`/buscar?q=${q}`);

    const data = await res.json();

    const resultados = document.getElementById("resultados");

    resultados.innerHTML = "";

    resultados.innerHTML += `<h2>Incidencias</h2>`;

    data.incidencias.forEach(i=>{

        resultados.innerHTML += `
            <div class="resultado">
                <strong>${i.alumno}</strong><br>
                ${i.problema}<br>
                ${i.ticket}
            </div>
        `;

    });

    resultados.innerHTML += `<h2>Préstamos</h2>`;

    data.prestamos.forEach(p=>{

        resultados.innerHTML += `
            <div class="resultado">
                <strong>${p.alumno}</strong><br>
                ${p.dispositivo}<br>
                ${p.tipo}
            </div>
        `;

    });

}
