const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//google-auth-library
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const Usuario = require('../models/user_model');

/**
 * Loguea a un usuario mediante el email y el correo 
 * Regresa un token como respuesta. 
 */
app.post('/login', (req, res) => {
  let body = req.body;
  //Validar el cuerpo de la petición
  if (!body.email || !body.password)
    return res
      .status(400)
      .json(handleError({ message: 'Falta password o contraseña' }));

  Usuario.findOne({ email: body.email }, (err, usuarioBD) => {
    if (err) return res.status(500).json(handleError(err));

    //usuario incorrecto
    if (!usuarioBD)
      return res.status(404).json({
        ok: false,
        err: 'Usuario o contraseña incorrectos',
      });

    //contraseña incorrecta
    if (!bcrypt.compareSync(body.password, usuarioBD.password))
      return res.status(404).json({
        ok: false,
        err: 'Usuario o contraseña incorrectos',
      });

    let token = createToken({ usuario: usuarioBD });

    res.json({
      ok: true,
      usuario: usuarioBD,
      token,
    });
  });
});

/**
 * Funcion que de google-auth-library que verifica un token y extrae su payload
 * En el payload del token google vienen los datos de su cuenta
 * @param {*} token
 */
async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
  });
  const payload = ticket.getPayload();

  return {
    nombre: payload.name,
    email: payload.email,
    img: payload.picture,
    google: true,
  };
}

/**
 * Autentifica a un usuario mediante google 
 * Regresa un token una vez que google lo ha autenticado
 */
app.post('/google', async (req, res) => {
  let token = req.body.idtoken;

  let googleUser = await verify(token).catch((e) => {
    return res.status(403).json({ ok: false, err: e });
  });

  Usuario.findOne({ email: googleUser.email }, (err, usuarioBD) => {
    if (err) return res.status(500).json(handleError(err));

    if (usuarioBD) {
      if (usuarioBD.google === false) {
        return res
          .status(400)
          .json(handleError({ message: 'Ya te has autenticado sin google' }));
      } else {
        //si ya existe y es de google, renovar el token
        let token = createToken({ usuario: usuarioBD });

        return res.json({
          ok: true,
          usuario: usuarioBD,
          token,
        });
      }
    } else {
      //si el usuario no existe en nuestra base de datos entonces crear una cuenta de tipo google
      let usuario = new Usuario();
      usuario.nombre = googleUser.nombre;
      usuario.email = googleUser.email;
      usuario.img = googleUser.img;
      usuario.google = true;
      usuario.password = ':)';
      usuario.save((err, usuarioBD) => {
        if (err) return res.status(500).json(handleError(err));

        let token = createToken({ usuario: usuarioBD });

        res.json({
          ok: true,
          usuario: usuarioBD,
          token,
        });
      });
    }
  });
});

function createToken(payload) {
  return jwt.sign(payload, process.env.SEED, {
    expiresIn: process.env.CADUCIDAD,
  });
}

function handleError(err) {
  return {
    ok: false,
    err,
  };
}

module.exports = app;
