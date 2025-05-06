// src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Input from '../components/Input'; // Suponiendo que creaste un componente Input estilizado
import Button from '../components/Button'; // Suponiendo que creaste un componente Button estilizado
import './Profile.css'; // Importa el archivo de estilos

function Profile() {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    // ... otros datos del usuario
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Aquí iría la lógica para obtener los datos del usuario desde el backend
    // Ejemplo simulado:
    setTimeout(() => {
      setUserData({ name: 'Nombre del Usuario', email: 'usuario@example.com' });
    }, 500);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    // Aquí iría la lógica para enviar los datos actualizados al backend
    console.log('Guardando datos:', userData);
    setIsEditing(false);
    // Mostrar un mensaje de éxito al usuario
  };

  return (
    <div className="profile-container">
      <Navbar />
      <div className="profile-content">
        <h1>Mi Perfil</h1>
        {isEditing ? (
          <form className="profile-form">
            <Input label="Nombre" type="text" name="name" value={userData.name} onChange={handleChange} />
            <Input label="Email" type="email" name="email" value={userData.email} onChange={handleChange} />
            {/* Agrega más campos según los datos del usuario */}
            <Button onClick={handleSave}>Guardar Cambios</Button>
            <Button onClick={() => setIsEditing(false)} className="cancel-button">Cancelar</Button>
          </form>
        ) : (
          <div className="profile-info">
            <p><strong>Nombre:</strong> {userData.name}</p>
            <p><strong>Email:</strong> {userData.email}</p>
            {/* Muestra más información del usuario */}
            <Button onClick={handleEdit}>Editar Perfil</Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;