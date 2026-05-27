const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());

/* SERVIR ARCHIVOS HTML/CSS/JS */
app.use(express.static(path.join(__dirname, "public")));

/* PAGINA PRINCIPAL */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "chromebooks.html"));
});

/* INICIAR SERVIDOR */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor iniciado en puerto ${PORT}`);
});
