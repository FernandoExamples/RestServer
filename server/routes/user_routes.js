const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('../models/user_model');
const { verifyToken, verifyAdminRole } = require('../middlewares/auth');

app.get('/usuario', verifyToken, function (req, res) {
  let desde = (Number(req.query.desde) || 1) - 1;
  let limit = Number(req.query.limit) || 5;

  Usuario.find({ estado: true }, 'nombre email role estado google img')
    .skip(desde)
    .sort({ nombre: 1 })
    .limit(limit)
    .exec((err, usuarios) => {
      if (err) {
        console.log(err);
        return res.status(400).json(handleError(err));
      }

      Usuario.countDocuments({ estado: true }, (err, total) => {
        res.json({
          ok: true,
          usuarios,
          total,
        });
      });
    });
});

///Almacenar un usuario en la base de datos
app.post('/usuario', [verifyToken, verifyAdminRole], function (req, res) {
  let body = req.body;

  let usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    role: body.role,
  });

  //almacenar el usuario en la base de datos
  usuario.save((err, usuarioDB) => {
    if (err) {
      //El return solo es para que se salga del metodo, pero no es necesario
      return res.status(400).json(handleError(err));
    }

    res.json({
      ok: true,
      usuario: usuarioDB,
    });
  });
});

///Editar un usuario en la base de datos
app.put('/usuario/:id', [verifyToken, verifyAdminRole], function (req, res) {
  let idUser = req.params.id;

  //filtrar propiedades del body
  let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

  Usuario.findByIdAndUpdate(
    idUser,
    body,
    {
      new: true,
      runValidators: true,
      context: 'query', //necesario para las disparar las validaciones de mongoose-unique-validator
    },
    (err, usuarioDB) => {
      if (err) {
        return res.status(400).json(handleError(err));
      }

      res.json({
        ok: true,
        usuario: usuarioDB,
      });
    }
  );
});

app.delete('/usuario/:id', [verifyToken, verifyAdminRole], function (req, res) {
  let idUser = req.params.id;

  ///Borrarlo físicamente de la base de datos
  // Usuario.findByIdAndDelete(idUser, (err, deletedUser) => {
  //   if (err) return res.status(400).json(handleError(err));

  //   res.json({
  //     ok: true,
  //     usuario: deletedUser,
  //   });
  // });

  ///Borrarlo lógicamente actualizando su estado
  Usuario.findByIdAndUpdate(
    idUser,
    { estado: false },
    { new: true },
    (err, deletedUser) => {
      if (err) return res.status(400).json(handleError(err));

      res.json({
        ok: true,
        usuario: deletedUser,
      });
    }
  );
});

function handleError(err) {
  return {
    ok: false,
    err,
  };
}

module.exports = app;
