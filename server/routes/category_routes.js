const express = require('express');
const app = express();
const { verifyToken, verifyAdminRole } = require('../middlewares/auth');
const _ = require('underscore');

let Categoria = require('../models/category_model');

/**
 * Mostrar todas las categorias
 */
app.get('/categoria', verifyToken, (req, res) => {

  Categoria.find()
    .populate('usuario', 'nombre email') //Remplazar el objectID por los datos del usuario
    .exec((err, categorias) => {
      if (err) return res.status(500).json(handleError(err));

      res.json({
        ok: true,
        total: categorias.length,
        categorias,
      });
    });
});

/**
 * Mostrar una categoria de acuerdo a un id especifico
 */
app.get('/categoria/:id', verifyToken, (req, res) => {
  let id = req.params.id;
  Categoria.findById(id, (err, categoria) => {
    if (err) return res.status(500).json(handleError(err));

    res.json({
      ok: true,
      categoria,
    });
  });
});

/**
 * Crear una nueva categoria
 */
app.post('/categoria', verifyToken, (req, res) => {
  let body = req.body;
  let idUsuario = req.usuario._id;

  let categoria = new Categoria({
    nombre: body.nombre,
    usuario: idUsuario,
  });

  categoria.save((err, categoria) => {
    if (err) return res.status(500).json(handleError(err));

    res.json({
      ok: true,
      categoria,
    });
  });
});

/**
 * Actualizar el nombre de una categoria
 */
app.put('/categoria/:id', verifyToken, (req, res) => {
  let id = req.params.id;
  //filtrar el cuerpo del body
  let body = _.pick(req.body, ['nombre']);

  Categoria.findByIdAndUpdate(
    id,
    body,
    { runValidators: true, context: 'query', new: true },
    (err, categoria) => {
      if (err) return res.status(500).json(handleError(err));

      res.json({
        ok: true,
        categoria,
      });
    }
  );
});

/**
 * Eliminar una categoria
 */
app.delete('/categoria/:id', verifyToken, verifyAdminRole, (req, res) => {
  let id = req.params.id;
  Categoria.findByIdAndDelete(id, (err, categoria) => {
    if (err) return res.status(500).json(handleError(err));

    res.json({
      ok: true,
      deleted: categoria,
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
