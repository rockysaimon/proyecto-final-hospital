// src/pages/Home.jsx
import React from 'react';
import Navbar from '../components/Navbar';
import './Home.css'; // Importa el archivo de estilos
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarAlt,
  faHeartbeat,
  faFileMedicalAlt,
  faUserPlus,
  faNotesMedical,
  faSearch,
  faCog,
  faBell,
  faInfoCircle, // Nuevo icono para "Acerca De"
  faListAlt, // Nuevo icono para "Mis Citas"
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom'; // Importa Link para la navegación

function Home() {
  const userName = 'Usuario'; // Reemplazar con el nombre real

  return (
    <div className="home-page">
      <div className="home-content"> {/* El contenido principal ahora está directamente aquí */}
        <Navbar />
        <header className="home-header">
          <h1>¡Bienvenido al Sistema, {userName}!</h1>
          <div className="header-actions">
          </div>
        </header>

        <section className="quick-access">
          <h2>Acceso Rápido</h2>
          <div className="quick-access-grid">
            <Link to="/appointments" className="quick-access-item">
              <FontAwesomeIcon icon={faCalendarAlt} className="quick-access-icon" />
              <span>Agendar Cita</span>
            </Link>
            <Link to="/my-appointments" className="quick-access-item"> {/* Nuevo enlace */}
              <FontAwesomeIcon icon={faListAlt} className="quick-access-icon" />
              <span>Ver Mis Citas</span>
            </Link>
            <Link to="/vital-signs" className="quick-access-item">
              <FontAwesomeIcon icon={faHeartbeat} className="quick-access-icon" />
              <span>Registrar Signos Vitales</span>
            </Link>
            <Link to="/vital-signs-history" className="quick-access-item">
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