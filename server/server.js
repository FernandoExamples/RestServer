require('./config/config');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

//Configurar bodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Definir un directorio publico
app.use(express.static(path.resolve(`${__dirname}/public`)));

//Definir las rutas del usuario
app.use(require('./routes/index'));

//Conectar mongoose
mongoose.connect(
  process.env.URLDB,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
  (err, resp) => {
    if (err) throw err;
    console.log('Conexion mongoose establecida');
  }
);

app.listen(process.env.PORT, () => {
  console.log(`\nEscuchando en el puerto ${process.env.PORT}`);
});

//Plantilla para crear usuarios dumy
// const Usuario = require('./models/user_model');
// const bcrypt = require('bcrypt');
// for (let i = 1; i <= 16; i++) {
//   let usuario = new Usuario({
//     nombre: `test${i}`,
//     email: `test${i}@hotmail.com`,
//     password: bcrypt.hashSync('123456', 10),
//   });
//   usuario.save((err, usuarioBD) => {
//     if (err) console.log(err);
//     else console.log(usuarioBD);
//   });
// }
