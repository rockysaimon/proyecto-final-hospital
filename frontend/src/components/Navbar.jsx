// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css'; // Importa el archivo de estilos

function Navbar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    console.log('Cerrar sesión');
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">Hospital en Casa</Link>
      <button className="dropdown-button" onClick={toggleMenu}>
        {/* Icono de menú hamburguesa */}
        ☰
      </button>
      <ul className={`navbar-nav ${isMenuOpen ? 'open' : ''}`}>
        <li><Link to="/home">Inicio</Link></li>
        <li><Link to="/profile">Mi Perfil</Link></li>
        <li><button onClick={handleLogout}>Cerrar Sesión</button></li>
        {/* Aquí podrías agregar más elementos de navegación */}
      </ul>
    </nav>
  );
}

export default Navbar;