// src/pages/Home.jsx
import React, { useState, useEffect } from 'react'; // Importa useState y useEffect
import Navbar from '../components/Navbar';
import './Home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarAlt,
  faHeartbeat,
  faFileMedicalAlt,
  faListAlt, // Nuevo icono para "Mis Citas"
} from '@fortawesome/free-solid-svg-icons'; // Mantén solo los iconos que uses
import { Link } from 'react-router-dom';

function Home() {
  const [userName, setUserName] = useState('Usuario'); // Estado para el nombre del usuario

  useEffect(() => {
    // Intentar obtener el nombre de usuario del localStorage
    // Asegúrate de que, al iniciar sesión, guardas el nombre del usuario en localStorage
    const storedUserName = localStorage.getItem('user_name'); // Asumiendo que guardas el nombre como 'user_name'
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []); // El array vacío asegura que esto se ejecute una sola vez al montar el componente

  return (
    <div className="home-page">
      <div className="home-content">
        <Navbar />
        <header className="home-header">
          {/* Usa el estado 'userName' aquí */}
          <h1>¡Bienvenido al Sistema, {userName}!</h1>
          <div className="header-actions">
            {/* Si tienes alguna acción aquí */}
          </div>
        </header>

        <section className="quick-access">
          <h2>Acceso Rápido</h2>
          <div className="quick-access-grid">
            <Link to="/appointments" className="quick-access-item">
              <FontAwesomeIcon icon={faCalendarAlt} className="quick-access-icon" />
              <span>Agendar Cita</span>
            </Link>
            <Link to="/my-appointments" className="quick-access-item">
              <FontAwesomeIcon icon={faListAlt} className="quick-access-icon" />
              <span>Ver Mis Citas</span>
            </Link>
            <Link to="/vital-signs" className="quick-access-item">
              <FontAwesomeIcon icon={faHeartbeat} className="quick-access-icon" />
              <span>Registrar Signos Vitales</span>
            </Link>
            <Link to="/vital-signs/history" className="quick-access-item"> {/* Corregí la ruta a vital-signs/history */}
              <FontAwesomeIcon icon={faFileMedicalAlt} className="quick-access-icon" />
              <span>Ver Historial Médico</span>
            </Link>
            {/* Puedes añadir más opciones de acceso rápido */}
          </div>
        </section>

        <footer className="home-footer">
          <p>&copy; 2025 Sistema Hospitalario - Todos los derechos reservados.</p>
        </footer>
      </div>
    </div>
  );
}

export default Home;