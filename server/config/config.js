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
//60 segundos * 60 minutos * 24 horas * 30 dias = 30 dias de caducidad
process.env.CADUCIDAD = 60 * 60 * 24 * 30;
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
