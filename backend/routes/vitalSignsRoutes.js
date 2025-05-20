// src/backend/routes/vitalSignsRoutes.js
const express = require('express');
const { registerVitalSigns } = require('../controllers/vitalSignsController');
const protect = require('../middlewares/authModdleware'); // Asumiendo que protect es necesario

const router = express.Router();

// La ruta aquí será simplemente '/' porque el prefijo '/api/vital-signs' ya se encarga de la base
router.post('/register', protect, registerVitalSigns);

module.exports = router;