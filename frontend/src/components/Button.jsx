// src/components/Button.jsx
import React from 'react';
import './Button.css'; // Importa el archivo de estilos

function Button({ children, onClick, className, type = "button" }) {
  return (
    <button type={type} onClick={onClick} className={`button ${className || ''}`}>
      {children}
    </button>
  );
}

export default Button;