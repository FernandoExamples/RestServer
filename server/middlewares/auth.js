const jwt = require('jsonwebtoken');

///Verificacion de autenticacion por token
let verifyToken = (req, res, next) => {
  let Authorization = req.get('Authorization');

  if (!Authorization) {
    return res.status(401).json({
      ok: false,
      message: 'Usuario no autenticado',
    });
  }

  let token = Authorization.split(' ')[1];

  jwt.verify(token, process.env.SEED, (err, payload) => {
    if (err)
      return res.status(401).json({
        ok: false,
        err,
      });

    req.usuario = payload.usuario;
    next();
  });
};

let verifyAdminRole = (req, res, next) => {
  let usuario = req.usuario;

  if (usuario.role !== 'ADMIN_ROLE') {
    return res.status(401).json({
      ok: false,
      message: 'No tienes permisos suficientes',
    });
  }

  next();
};

module.exports = {
  verifyToken,
  verifyAdminRole,
};
