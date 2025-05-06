// routes/authRoutes.js
const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const router = express.Router();

// Rutas de autenticación SUPER IMPORTANTE
router.post('/register', registerUser);  // Ruta para registro
router.post('/login', loginUser); // Ruta para login

module.exports = router;
