// src/pages/Login.jsx
import React, { useState } from 'react';
import { Route, Routes, Link, useNavigate } from 'react-router-dom';
import './styles.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          correo: email,
          password: password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Inicio de sesión exitoso');
        localStorage.setItem('token', result.token);

        // ¡¡ESTA ES LA LÍNEA CRÍTICA A REVISAR Y AJUSTAR!!
        // Asegúrate de que el backend envía 'user.nombre'
        if (result.user && result.user.nombre) {
          localStorage.setItem('user_name', result.user.nombre); // Correcto: Accede a 'nombre' dentro de 'user'
        } else {
          // Fallback por si acaso el nombre no llega o la estructura cambia
          localStorage.setItem('user_name', email);
          console.warn('Advertencia: El nombre de usuario no se recibió del backend, usando el correo electrónico como nombre.');
        }

        navigate('/home');
      } else {
        alert(result.message || 'Credenciales inválidas');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      alert('Error al conectar con el servidor');
    }
  };

  return (
    <div className="app-container">
      <div className="login-container">
        <h2>Iniciar sesión</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            className="input-field"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          <button type="submit" className="btn">Iniciar sesión</button>
          <div className="forgot-password">
            <a href="#">¿Olvidaste tu contraseña?</a>
            <span> | </span>
            <Link to="/register">Registrar</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;