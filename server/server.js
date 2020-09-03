require('./config/config')
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/usuario', function (req, res) {
  res.json('get usuario');
});

app.post('/usuario', function (req, res) {
  let body = req.body;
  if (body.nombre === undefined) {
    res.status(400).json({
      ok: false,
      mensaje: 'El nombre es necesario',
    });
  } else {
    res.json({
      ok: true,
      body,
    });
  }
});

app.put('/usuario/:id', function (req, res) {
  let idUser = req.params.id;
  res.json({
    idUser,
  });
});

app.delete('/usuario', function (req, res) {
  res.json('delete usuario');
});

app.listen(process.env.PORT, () => {
  console.log(`Escuchando en el puerto ${process.env.PORT}`);
});
