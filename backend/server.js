// server.js
const express = require('express');
const { connectDB } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const dotenv = require('dotenv');
const cors = require('cors'); // Conexion front y back

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Habilitar CORS para permitir solicitudes del frontend
app.use(cors());  // Usar cors para todas las rutas, o puedes configurarlo más específicamente

// Middleware para parsear los datos JSON
app.use(express.json());

// Conectar a la base de datos
connectDB();

// Rutas
app.use('/api/auth', authRoutes);

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
