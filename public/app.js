```javascript
async function cargarDispositivos(){

const contenedor=document.getElementById("dispositivos");

if(!contenedor)return;

const res=await fetch("/api/dispositivos");

const datos=await res.json();

contenedor.innerHTML="";

datos.forEach(d=>{

contenedor.innerHTML+=`

<div class="item">

<h3>${d.nombre}</h3>

<div class="estado ${d.estado==="Disponible"?"disponible":"ocupado"}">

${d.estado}

</div>

</div>

`;

});

}

async function cargarIncidencias(){

const contenedor=document.getElementById("incidencias");

if(!contenedor)return;

const res=await fetch("/api/incidencias");

const datos=await res.json();

contenedor.innerHTML="";

datos.forEach(i=>{

contenedor.innerHTML+=`

<div class="item">

<h3>${i.alumno}</h3>

<p>${i.problema}</p>

<div class="estado">

${i.estado || "Abierta"}

</div>

</div>

`;

});

}

async function guardarIncidencia(){

const datos={

ticket:document.getElementById("ticket").value,
serie:document.getElementById("serie").value,
alumno:document.getElementById("alumno").value,
curso:document.getElementById("curso").value,
problema:document.getElementById("problema").value,
sustitucion:document.getElementById("sustitucion").value,
motivo:document.getElementById("motivo").value

};

await fetch("/incidencia",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify(datos)

});

alert("Incidencia guardada");

location.reload();

}

async function guardarPrestamo(){

const datos={

ticket:document.getElementById("ticket").value,
alumno:document.getElementById("alumno").value,
curso:document.getElementById("curso").value,
dispositivo:document.getElementById("dispositivo").value,
movimiento:document.getElementById("movimiento").value,
fecha:document.getElementById("fecha").value

};

await fetch("/prestamo",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify(datos)

});

alert("Movimiento guardado");

location.reload();

}

async function buscar(){

const texto=document.getElementById("buscar").value;

const res=await fetch(`/buscar/${texto}`);

const datos=await res.json();

const cont=document.getElementById("resultados");

cont.innerHTML="";

datos.incidencias.forEach(i=>{

cont.innerHTML+=`

<div class="item">

<h3>Incidencia</h3>

<p>${i.alumno}</p>
<p>${i.problema}</p>

</div>

`;

});

datos.prestamos.forEach(p=>{

cont.innerHTML+=`

<div class="item">

<h3>Préstamo</h3>

<p>${p.alumno}</p>
<p>${p.dispositivo}</p>

</div>

`;

});

}

window.onload=()=>{

cargarDispositivos();
cargarIncidencias();

};
```
