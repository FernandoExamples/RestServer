//==============================
// Puerto
//==============================
process.env.PORT = process.env.PORT || 3000;

//==============================
// Etorno
//==============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//==============================
// Base de Datos
//==============================
let urlDB;
if (process.env.NODE_ENV === 'dev') {
  urlDB = 'mongodb://localhost:27017/cafe';
} else {
  // Cadena de conexion a mongo atlas con las credenciales del usuario de la BD
  urlDB =
    'mongodb+srv://cafe_user:cafe_pass@cluster0.wzhik.mongodb.net/cafe?retryWrites=true&w=majority';
}

//variable creada por mi
process.env.URLDB = urlDB;
