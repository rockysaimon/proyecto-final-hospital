// src/components/Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faCalendarAlt, faHeartbeat, faFileMedicalAlt } from '@fortawesome/free-solid-svg-icons'; // Importa algunos iconos

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h3>Accesos</h3>
      </div>
      <ul className="sidebar-nav">
        <li>
          <Link to="/appointments" className="sidebar-link">
            <FontAwesomeIcon icon={faCalendarAlt} className="sidebar-icon" />
            Citas
          </Link>
        </li>
        <li>
          <Link to="/vital-signs" className="sidebar-link">
            <FontAwesomeIcon icon={faHeartbeat} className="sidebar-icon" />
            Signos Vitales
          </Link>
        </li>
        <li>
          <Link to="/vital-signs/history" className="sidebar-link">
            <FontAwesomeIcon icon={faFileMedicalAlt} className="sidebar-icon" />
            Historial Signos
          </Link>
        </li>
        {/* Agrega aquí más opciones según el rol y las funcionalidades */}
      </ul>
    </aside>
  );
}

export default Sidebar;