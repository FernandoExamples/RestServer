//==============================
// Puerto
//==============================
process.env.PORT = process.env.PORT || 3000;

//==============================
// Etorno
//==============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//==============================
// JWT seed y expiracion
//==============================
process.env.CADUCIDAD = '48h';
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

//==============================
// Base de Datos
//==============================
let urlDB;
if (process.env.NODE_ENV === 'dev') {
  urlDB = 'mongodb://localhost:27017/cafe';
} else {
  // Cadena de conexion a mongo atlas con las credenciales del usuario de la BD
  urlDB = process.env.MONGO_URL;
}

//variable creada por mi
process.env.URLDB = urlDB;

//==============================
// GOOGLE Sign In
//==============================
process.env.CLIENT_ID =
  process.env.CLIENT_ID ||
  '256670914946-9puc7vn54hr0jhjo1r5h91amrvbplnvg.apps.googleusercontent.com';
