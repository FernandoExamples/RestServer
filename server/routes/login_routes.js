const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/user_model');

app.post('/login', (req, res) => {
  let body = req.body;
  //Validar el cuerpo de la petición
  if (!body.email || !body.password)
    return res
      .status(400)
      .json(handleError({ message: 'Falta password o contraseña' }));

  Usuario.findOne({ email: body.email }, (err, usuarioBD) => {
    if (err) return res.status(500).json(handleError(err));

    if (!usuarioBD)
      return res.status(404).json({
        ok: false,
        err: 'Usuario contraseña incorrectos',
      });

    if (!bcrypt.compareSync(body.password, usuarioBD.password))
      return res.status(404).json({
        ok: false,
        err: 'Usuario contraseña incorrectos',
      });

    let token = jwt.sign({ usuario: usuarioBD }, process.env.SEED, {
      expiresIn: process.env.CADUCIDAD,
    });

    res.json({
      ok: true,
      usuario: usuarioBD,
      token,
    });
  });
});

function handleError(err) {
  return {
    ok: false,
    err,
  };
}

module.exports = app;
