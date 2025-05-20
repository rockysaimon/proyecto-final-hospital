// server.js
const express = require('express');
const { connectDB } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const appointmentsRoutes = require('./routes/appointmentsRoutes'); // Importar las rutas de citas
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentsRoutes); // Usar las rutas de citas

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});