const express = require('express');
const app = express();
const { verifyToken } = require('../middlewares/auth');

let Producto = require('../models/producto_model');

/**
 * Obtener todos los productos
 * Opcionalmente filtrando por categoria
 */
app.get('/productos', verifyToken, (req, res) => {
  let desde = (Number(req.query.desde) || 1) - 1;
  let limit = Number(req.query.limit) || 5;

  let filtro = {};
  if (req.query.category) filtro = { categoria: req.query.category };

  Producto.find(filtro)
    .populate('categoria', 'nombre')
    .populate('usuario', 'nombre email')
    .skip(desde)
    .limit(limit)
    .exec((err, productos) => {
      if (err) return res.status(500).json(handleError(err));

      Producto.countDocuments(filtro, (err, total) => {
        res.json({
          ok: true,
          productos,
          total,
        });
      });
    });
});

/**
 * Obtener un producto por ID
 */
app.get('/productos/:id', verifyToken, (req, res) => {
  let id = req.params.id;

  //Usar populate
  Producto.findById(id)
    .populate('categoria', 'nombre')
    .populate('usuario', 'nombre email')
    .exec((err, producto) => {
      if (err) return res.status(500).json(handleError(err));

      res.json({
        ok: true,
        producto,
      });
    });
});

/**
 * Buscar un producto por un termino de la descripcion
 */
app.get('/productos/buscar/:termino', verifyToken, (req, res) => {
  let termino = req.params.termino;

  //expresion regular Case Insensitive
  let regex = RegExp(termino, 'i');

  Producto.find({ descripcion: regex })
    .populate('categoria', 'nombre')
    .populate('usuario', 'nombre email')
    .exec((err, productos) => {
      if (err) return res.status(500).json(handleError(err));

      Producto.countDocuments({ descripcion: regex }, (err, total) => {
        res.json({
          ok: true,
          productos,
          total,
        });
      });
    });
});

/**
 * Guardar un producto
 */
app.post('/productos', verifyToken, (req, res) => {
  let body = req.body;
  let usuario = req.usuario;

  let producto = new Producto({
    nombre: body.nombre,
    precioUni: body.precioUni,
    descripcion: body.descripcion,
    categoria: body.categoria,
    usuario: usuario._id,
  });

  producto.save(async (err, producto) => {
    if (err) return res.status(500).json(handleError(err));

    let prod = await producto
      .populate('categoria', 'nombre')
      .populate('usuario', 'nombre email')
      .execPopulate();

    res.json({
      ok: true,
      producto: prod,
    });
  });
});

/**
 * Actualizar un producto
 */
app.put('/productos/:id', verifyToken, (req, res) => {
  let id = req.params.id;
  let body = req.body;
  let producto = {
    nombre: body.nombre,
    precioUni: body.precioUni,
    descripcion: body.descripcion,
    categoria: body.categoria,
    disponible: body.disponible,
  };

  Producto.findById(id, (err, producto) => {
    if (err) return res.status(500).json(handleError(err));
    if (!producto) return res.json({ ok: true, producto: null });

    producto.nombre = body.nombre || producto.nombre;
    producto.precioUni = body.precioUni || producto.precioUni;
    producto.descripcion = body.descripcion || producto.descripcion;
    producto.categoria = body.categoria || producto.categoria;
    producto.disponible = body.disponible || producto.disponible;
    producto.save(async (err, producto) => {
      if (err) return res.status(500).json(handleError(err));

      let prod = await producto
        .populate('categoria', 'nombre')
        .populate('usuario', 'nombre email')
        .execPopulate();

      res.json({
        ok: true,
        producto: prod,
      });
    });
  });
});

/**
 * Borrar un producto cambiando su estado disponible a false
 */
app.delete('/productos/:id', verifyToken, (req, res) => {
  let id = req.params.id;
  let update = {
    disponible: false,
  };

  Producto.findByIdAndUpdate(
    id,
    update,
    { new: true },
    async (err, deleted) => {
      if (err) return res.status(500).json(handleError(err));

      let prod = await deleted
        .populate('categoria', 'nombre')
        .populate('usuario', 'nombre email')
        .execPopulate();

      res.json({
        ok: true,
        deleted: prod,
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
