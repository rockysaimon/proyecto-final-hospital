// routes/appointmentsRoutes.js
const express = require('express');
const { getAvailableSlots, getReservedSlots, bookAppointment, getMyAppointments, deleteAppointment } = require('../controllers/appointmentsController');
const protect = require('../middlewares/authModdleware');

const router = express.Router();

router.get('/available', getAvailableSlots);
router.get('/reserved', getReservedSlots);
router.post('/book', protect, bookAppointment);

// Rutas para mis citas
router.get('/mine', protect, getMyAppointments); // <--- ¡Verifica esta línea!
router.delete('/:id', protect, deleteAppointment);

router.delete('/delete', protect, deleteAppointment); 

module.exports = router;