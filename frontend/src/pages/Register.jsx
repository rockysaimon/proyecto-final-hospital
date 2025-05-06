import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './styles.css';

function Register() {
  const [nombre_usuario, setNombreUsuario] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [identificador, setIdentificador] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre_usuario,
          correo,
          telefono,
          password,
          identificador,
          id_rol: 1, // Cambia si usas roles distintos
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Usuario registrado exitosamente');
      } else {
        alert(result.message || 'Error al registrar');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al conectar con el servidor');
    }
  };

  return (
    <div className="app-container">
      <div className="login-container">
        <h2>Registrar</h2>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            className="input-field"
            placeholder="Nombre de usuario"
            value={nombre_usuario}
            onChange={(e) => setNombreUsuario(e.target.value)}
            required
          />
          <input
            type="email"
            className="input-field"
            placeholder="Correo electrónico"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
          <input
            type="text"
            className="input-field"
            placeholder="Teléfono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            required
          />
          <input
            type="text"
            className="input-field"
            placeholder="Cédula"
            value={identificador}
            onChange={(e) => setIdentificador(e.target.value)}
            required
          />
          <input
            type="password"
            className="input-field"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            className="input-field"
            placeholder="Confirmar Contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn">Registrar</button>
        </form>

        <div className="login-link">
          <p>¿Ya tienes una cuenta? <Link to="/">Iniciar sesión</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Register;