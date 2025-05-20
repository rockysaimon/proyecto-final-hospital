// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sql } = require('../config/db');

// Función para registrar un nuevo usuario (sin cambios aquí)
const registerUser = async (req, res) => {
  const { nombre_usuario, correo, telefono, password, identificador, id_rol } = req.body;
  try {
    // Verificar si el correo ya está registrado
    const userExists = await sql.query`SELECT * FROM Usuarios WHERE correo = ${correo}`;
    if (userExists.recordset.length > 0) {
      return res.status(400).json({ message: 'Correo ya registrado' });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar el nuevo usuario
    const result = await sql.query`INSERT INTO Usuarios (id_usuario, nombre_usuario, correo, telefono, Token, identificador, id_rol)
    VALUES (3,${nombre_usuario}, ${correo}, ${telefono}, ${hashedPassword}, ${identificador}, ${id_rol})`;

    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error('Error al registrar el usuario: ', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// Función para iniciar sesión
const loginUser = async (req, res) => {
  const { correo, password } = req.body;
  try {
    // Buscar el usuario por correo
    const user = await sql.query`SELECT * FROM Usuarios WHERE correo = ${correo}`;
    if (user.recordset.length === 0) {
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    // Comparar la contraseña
    const isMatch = await bcrypt.compare(password, user.recordset[0].Token);
    if (!isMatch) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }

    // *** LOG DE LA CLAVE SECRETA ***
    console.log('Clave secreta para firmar el token:', process.env.JWT_SECRET);

    // Generar un token JWT
    // Extraemos la información del usuario del primer (y único) registro encontrado
    const userInfo = user.recordset[0];
    const token = jwt.sign({ id_usuario: userInfo.id_usuario }, process.env.JWT_SECRET, { expiresIn: '24h' });

    // ¡¡MODIFICACIÓN CLAVE AQUÍ!!
    // Incluye el nombre_usuario (y cualquier otra info relevante) en la respuesta JSON
    res.json({
      message: 'Login exitoso',
      token,
      // Asegúrate de que 'nombre_usuario' es el nombre exacto de la columna en tu tabla Usuarios
      user: {
        id_usuario: userInfo.id_usuario,
        nombre: userInfo.nombre_usuario, // <-- Aquí enviamos el nombre
        correo: userInfo.correo,
        // Puedes añadir más campos si los necesitas en el frontend, como 'id_rol', 'telefono', etc.
        // rol: userInfo.id_rol,
        // telefono: userInfo.telefono
      }
    });

  } catch (error) {
    console.error('Error al iniciar sesión: ', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

module.exports = { registerUser, loginUser };