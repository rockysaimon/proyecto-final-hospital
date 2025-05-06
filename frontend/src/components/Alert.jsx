// src/components/Alert.jsx
import React from 'react';
import './Alert.css'; // Importa el archivo de estilos

function Alert({ type, message }) {
  // type puede ser 'success', 'error', 'info', etc.
  const alertClass = `alert alert-${type}`;

  return (
    <div className={alertClass} role="alert">
      {message}
    </div>
  );
}

export default Alert;