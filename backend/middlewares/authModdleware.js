// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token;

  if (req.header('Authorization') && req.header('Authorization').startsWith('Bearer ')) {
    token = req.header('Authorization').split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Acceso denegado, token no encontrado' });
    }

    try {
      console.log('Clave secreta para verificar:', process.env.JWT_SECRET);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Token no válido' });
    }
  } else {
    return res.status(401).json({ message: 'Acceso denegado, formato de token incorrecto' });
  }
};

module.exports = protect;