const express = require('express');
const app = express();

const path = require('path');
const fs = require('fs');

const { verifyTokenByUrl } = require('../middlewares/auth');

/**
 * Sirve una imagen a partir de una ruta del tipo
 * http://localhost:3000/imagen/usuarios/5f56d7375fa9cd5ee3aa9e39-659.jpeg
 */
app.get('/imagen/:tipo/:img', verifyTokenByUrl, (req, res) => {
  let imageType = req.params.tipo;
  let img = req.params.img;

  let imagePath = path.resolve(`uploads/${imageType}/${img}`);

  if (fs.existsSync(imagePath)) {
    res.sendFile(imagePath);
  } else {
    let noImagePath = path.resolve('server/assets/no-image.jpg');
    res.sendFile(noImagePath);
  }
});

module.exports = app;
