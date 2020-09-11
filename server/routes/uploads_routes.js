const express = require('express');
const app = express();
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');

const Usuario = require('../models/user_model');
const Producto = require('../models/producto_model');

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: 'tmp/',
    // debug: true,
  })
);

//Verificar si existen los directorios de subida de archivos
if (!fs.existsSync(path.resolve('uploads/usuarios/'))) {
  fs.mkdirSync('uploads/usuarios', { recursive: true });
}
if (!fs.existsSync(path.resolve('uploads/productos/'))) {
  fs.mkdirSync('uploads/productos', { recursive: true });
}

/**
 * Subir un archivo
 */
app.put('/uploads/:tipo/:id', (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0)
    return res
      .status(400)
      .json(handleError({ message: 'No se ha cargado ningún archivo.' }));

  let fileType = req.params.tipo;
  let id = req.params.id;
  //myFile hace match con el name del input file del html
  let myFile = req.files.myFile;

  var err = validFileType(fileType);
  if (err) return res.status(400).json(handleError(err));

  let splitName = myFile.name.split('.');
  let extension = splitName[splitName.length - 1];

  var err = validFileExtension(extension);
  if (err) return res.status(400).json(handleError(err));

  let fileName = `${id}-${new Date().getMilliseconds()}.${extension}`;

  //La funcion mv() mueve el archivo a otra parte cuando se ha subido
  myFile.mv(`uploads/${fileType}/${fileName}`, (err) => {
    if (err) return res.status(500).json(handleError(err));

    if (fileType === 'usuarios') updateUserImage(id, res, fileName);
    else updateProductImage(id, res, fileName);
  });
});

function validFileExtension(extension) {
  let validExtensions = ['png', 'jpg', 'gif', 'jpeg'];
  if (validExtensions.indexOf(extension) < 0) {
    return {
      message: 'Las extensiones permitidas son: ' + validExtensions.join(','),
    };
  }
}

function validFileType(type) {
  let validTypes = ['productos', 'usuarios'];
  if (validTypes.indexOf(type) < 0) {
    return {
      message: 'Los tipos permitidos son: ' + validTypes.join(', '),
    };
  }
}

function updateUserImage(userId, res, imageName) {
  Usuario.findById(userId, (err, usuario) => {
    if (err) {
      deleteImage(imageName, 'usuarios');
      return res.status(500).json(handleError(err));
    }

    if (!usuario) {
      deleteImage(imageName, 'usuarios');
      return res
        .status(400)
        .json(handleError({ message: 'El Usuario no existe' }));
    }

    deleteImage(usuario.img, 'usuarios');

    usuario.img = imageName;

    usuario.save((err, user) => {
      return res.json({
        ok: true,
        usuario: user,
      });
    });
  });
}

function updateProductImage(productId, res, imageName) {
  Producto.findById(productId)
    .populate('usuario', 'email usuario')
    .populate('categoria', 'nombre')
    .exec((err, producto) => {
      if (err) {
        deleteImage(imageName, 'productos');
        return res.status(500).json(handleError(err));
      }

      if (!producto) {
        deleteImage(imageName, 'productos');
        return res
          .status(400)
          .json(handleError({ message: 'El Producto no existe' }));
      }

      deleteImage(producto.img, 'productos');

      producto.img = imageName;

      producto.save((err, producto) => {
        return res.json({
          ok: true,
          producto,
        });
      });
    });
}

function deleteImage(imageName, imageType) {
  let imagePath = path.resolve(`uploads/${imageType}/${imageName}`);
  if (fs.existsSync(imagePath)) {
    fs.unlinkSync(imagePath);
  }
}

function handleError(err) {
  return {
    ok: false,
    err,
  };
}

module.exports = app;
