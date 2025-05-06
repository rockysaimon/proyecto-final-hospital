// utils/generateToken.js
const jwt = require('jsonwebtoken');

const generateToken = (id_usuario) => {
  return jwt.sign({ id_usuario }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

module.exports = generateToken;
