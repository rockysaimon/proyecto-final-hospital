// src/pages/UpdateProfile.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Input from '../components/Input';
import Button from '../components/Button';
import './UpdateProfile.css'; // Importa el archivo de estilos
import { useNavigate } from 'react-router-dom'; // Para la redirección

function UpdateProfile() {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    // ... otros datos del usuario
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Aquí iría la llamada a la API del backend para obtener los datos del usuario
    // Ejemplo:
    // fetch('/api/users/me', { // O una ruta similar para obtener los datos del usuario autenticado
    //   method: 'GET',
    //   headers: {
    //     // Incluir token de autenticación si es necesario
    //   },
    // })
    // .then(response => {
    //   if (!response.ok) {
    //     throw new Error(`HTTP error! status: ${response.status}`);
    //   }
    //   return response.json();
    // })
    // .then(data => {
    //   setUserData(data);
    //   setLoading(false);
    // })
    // .catch(error => {
    //   setError(error.message);
    //   setLoading(false);
    // });

    // Simulación de datos del usuario
    setTimeout(() => {
      setUserData({
        name: 'Nombre del Usuario',
        email: 'usuario@example.com',
        phone: '123-456-7890',
        address: 'Dirección de Ejemplo',
      });
      setLoading(false);
    }, 500);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Actualizando datos del usuario:', userData);
    // Aquí iría la llamada a la API del backend para actualizar los datos del usuario
    // Ejemplo:
    // fetch('/api/users/me', { // O una ruta similar
    //   method: 'PUT',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     // Incluir token de autenticación si es necesario
    //   },
    //   body: JSON.stringify(userData),
    // })
    // .then(response => response.json())
    // .then(data => {
    //   console.log('Respuesta del backend:', data);
    //   // Mostrar mensaje de éxito
    //   navigate('/profile'); // Redirigir a la página de perfil después de la actualización
    // })
    // .catch(error => {
    //   console.error('Error al actualizar los datos:', error);
    //   // Mostrar mensaje de error
    // });
  };

  if (loading) {
    return (
      <div className="update-profile-container">
        <Navbar />
        <div className="update-profile-content">
          <p>Cargando datos del perfil...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="update-profile-container">
        <Navbar />
        <div className="update-profile-content">
          <p>Error al cargar los datos del perfil: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="update-profile-container">
      <Navbar />
      <div className="update-profile-content">
        <h1>Actualizar Datos del Perfil</h1>
        <form onSubmit={handleSubmit} className="update-profile-form">
          <Input label="Nombre" type="text" name="name" value={userData.name} onChange={handleChange} />
          <Input label="Email" type="email" name="email" value={userData.email} onChange={handleChange} />
          <Input label="Teléfono" type="tel" name="phone" value={userData.phone} onChange={handleChange} />
          <Input label="Dirección" type="text" name="address" value={userData.address} onChange={handleChange} />
          {/* Agrega aquí más campos según los datos del usuario */}
          <Button type="submit">Guardar Cambios</Button>
          <Button onClick={() => navigate('/profile')} className="cancel-button">Cancelar</Button>
        </form>
      </div>
    </div>
  );
}

export default UpdateProfile;