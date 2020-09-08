const jwt = require('jsonwebtoken');

/**
 * Verifica un token de autentificacion.
 * Obtiene el usuario del payload y lo pasa al siguiente middleware por medio del request
 */
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

/**
 * Verifica que un usuario sea administrador.
 * Este middleware debe llamarse despues de verifyToken, pues requiere el usuario en la peticion
 */
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
