CREATE TABLE IF NOT EXISTS incidencias (

    id SERIAL PRIMARY KEY,
    alumno TEXT,
    serie TEXT,
    descripcion TEXT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

CREATE TABLE IF NOT EXISTS prestamos (

    id SERIAL PRIMARY KEY,
    alumno TEXT,
    dispositivo TEXT,
    estado TEXT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

CREATE TABLE IF NOT EXISTS chromebooks (

    id SERIAL PRIMARY KEY,
    nombre TEXT,
    disponible BOOLEAN DEFAULT true

);

CREATE TABLE IF NOT EXISTS cola_espera (

    id SERIAL PRIMARY KEY,
    alumno TEXT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);
