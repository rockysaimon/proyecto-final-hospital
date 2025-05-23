// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sql } = require('../config/db');

// Función para generar un ID de usuario aleatorio único
async function generateUniqueUserId() {
    let id_usuario;
    let userExists;
    do {
        // Genera un número aleatorio entre 4 y 100 (ambos inclusive)
        id_usuario = Math.floor(Math.random() * (100 - 4 + 1)) + 4;
        // Verifica si el ID ya existe en la base de datos
        userExists = await sql.query`SELECT 1 FROM Usuarios WHERE id_usuario = ${id_usuario}`;
    } while (userExists.recordset.length > 0); // Repite si el ID ya existe
    return id_usuario;
}

// Función para registrar un nuevo usuario
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

        // --- Generar un ID de usuario único aleatorio ---
        const newUserId = await generateUniqueUserId();

        // Insertar el nuevo usuario con el ID generado dinámicamente
        const result = await sql.query`INSERT INTO Usuarios (id_usuario, nombre_usuario, correo, telefono, Token, identificador, id_rol)
        VALUES (${newUserId}, ${nombre_usuario}, ${correo}, ${telefono}, ${hashedPassword}, ${identificador}, ${id_rol})`;

        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        console.error('Error al registrar el usuario: ', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

// Función para iniciar sesión (sin cambios)
const loginUser = async (req, res) => {
    const { correo, password } = req.body;
    try {
        const user = await sql.query`SELECT * FROM Usuarios WHERE correo = ${correo}`;
        if (user.recordset.length === 0) {
            return res.status(400).json({ message: 'Usuario no encontrado' });
        }

        const isMatch = await bcrypt.compare(password, user.recordset[0].Token);
        if (!isMatch) {
            return res.status(400).json({ message: 'Contraseña incorrecta' });
        }

        console.log('Clave secreta para firmar el token:', process.env.JWT_SECRET);

        const userInfo = user.recordset[0];
        const token = jwt.sign({ id_usuario: userInfo.id_usuario }, process.env.JWT_SECRET, { expiresIn: '24h' });

        res.json({
            message: 'Login exitoso',
            token,
            user: {
                id_usuario: userInfo.id_usuario,
                nombre: userInfo.nombre_usuario,
                correo: userInfo.correo,
            }
        });

    } catch (error) {
        console.error('Error al iniciar sesión: ', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

module.exports = { registerUser, loginUser };