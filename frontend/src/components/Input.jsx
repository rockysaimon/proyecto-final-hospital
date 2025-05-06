// src/components/Input.jsx
import React from 'react';
import './Input.css'; // Importa el archivo de estilos

function Input({ label, type, name, value, onChange }) {
  return (
    <div className="input-group">
      {label && <label htmlFor={name}>{label}</label>}
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

export default Input;