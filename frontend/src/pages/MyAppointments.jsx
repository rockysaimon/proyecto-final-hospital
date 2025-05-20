// src/pages/MyAppointments.jsx
import React, { useState, useEffect, useCallback } from 'react';
import './MyAppointments.css';
import Swal from 'sweetalert2';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/appointments/mine', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error al cargar las citas: ${response.status}`);
      }

      const data = await response.json();
      setAppointments(data);
      setLoading(false);
      console.log('Citas cargadas:', data);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      console.error('Error al cargar las citas:', err);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleDeleteAppointment = async (fecha, hora, id_medico) => {
    Swal.fire({
      title: '¿Estás seguro de eliminar esta cita?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        setDeletingId(`${fecha}-${hora}-${id_medico}`);
        setError(null);
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`http://localhost:5000/api/appointments/delete`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fecha, hora, id_medico }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Error al eliminar la cita: ${response.status}`);
          }

          setAppointments(prevAppointments =>
            prevAppointments.filter(appt =>
              appt.fecha !== fecha || appt.hora !== hora || appt.id_medico !== id_medico
            )
          );
          console.log('Cita eliminada del frontend:', { fecha, hora, id_medico });
          Swal.fire(
            '¡Eliminado!',
            'La cita ha sido eliminada.',
            'success'
          );
        } catch (err) {
          setError(err.message);
          Swal.fire(
            '¡Error!',
            err.message,
            'error'
          );
        } finally {
          setDeletingId(null);
        }
      }
    });
  };

  let content;
  if (loading) {
    content = <div>Cargando tus citas...</div>;
  } else if (error) {
    content = <div>Error al cargar las citas: {error}</div>;
  } else if (appointments.length === 0) {
    content = <div style={{ color: 'black' }}>No tienes citas agendadas.</div>;
  } else {
    content = (
      <>
        <h2>Mis Citas Agendadas</h2>
        <ul className="appointments-grid">
          {appointments.map(appointment => (
            <li
              key={`${appointment.fecha}-${appointment.hora}-${appointment.id_medico}`}
              className={`appointment-card ${deletingId === `${appointment.fecha}-${appointment.hora}-${appointment.id_medico}` ? 'deleting' : ''}`}
            >
              <p style={{ color: 'black' }}><strong>Fecha:</strong> {new Date(appointment.fecha).toLocaleDateString()}</p>
              <p style={{ color: 'black' }}><strong>Hora:</strong> {appointment.hora}</p>
              <button onClick={() => handleDeleteAppointment(appointment.fecha, appointment.hora, appointment.id_medico)} className="delete-button">Eliminar</button>
            </li>
          ))}
        </ul>
      </>
    );
  }

  return (
    <div className="my-appointments-page">
      <Navbar />
      <div className="main-content">
        <Sidebar />
        <div className="appointments-content">
          {content} {/* Renderiza el contenido dinámicamente */}
        </div>
      </div>
    </div>
  );
};

export default MyAppointments;