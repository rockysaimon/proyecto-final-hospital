// src/pages/Appointments.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import './Appointments.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

function Appointments() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState([]);
  const [reservedSlots, setReservedSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDatePretty = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('es-CO', options);
  };

  const fetchAvailableAndReservedSlots = async (date) => {
    setLoading(true);
    setError(null);
    const formattedDate = date.toISOString().split('T')[0];

    try {
      // Generar horarios disponibles directamente en el frontend
      const availableSlotsGenerated = [];
      for (let hour = 8; hour <= 17; hour++) {
        availableSlotsGenerated.push({ id: `${formattedDate}-${hour}:00`, time: `${hour}:00`, isReserved: false });
        if (Math.random() > 0.5) { // Ejemplo de generar medias horas aleatoriamente
          availableSlotsGenerated.push({ id: `${formattedDate}-${hour}:30`, time: `${hour}:30`, isReserved: false });
        }
      }
      setAvailableSlots(availableSlotsGenerated);

      // Obtener horarios reservados del backend
      const reservedResponse = await fetch(`http://localhost:5000/api/appointments/reserved?date=${formattedDate}`);
      if (!reservedResponse.ok) {
        throw new Error(`HTTP error! status: ${reservedResponse.status} (reserved)`);
      }
      const reservedData = await reservedResponse.json();
      setReservedSlots(reservedData);

      // Marcar los horarios ya reservados en la lista de horarios disponibles
      const updatedAvailableSlots = availableSlotsGenerated.map(slot => ({
        ...slot,
        isReserved: reservedData.includes(slot.time),
      }));

      setAvailableSlots(updatedAvailableSlots);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailableAndReservedSlots(selectedDate);
  }, [selectedDate]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    fetchAvailableAndReservedSlots(date); // Recargar horarios al cambiar la fecha
  };

  const handleSlotSelect = (slot) => {
    if (!slot.isReserved) {
      setSelectedSlot(slot);
      Swal.fire({
        title: '¿Confirmar esta hora?',
        text: `Has seleccionado el horario de las ${slot.time} para el ${formatDatePretty(selectedDate)}.`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, reservar',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          handleBookAppointment(slot);
        } else {
          setSelectedSlot(null);
        }
      });
    } else {
      Swal.fire('¡Horario no disponible!', 'Este horario ya ha sido reservado.', 'warning');
    }
  };

  const handleBookAppointment = async (slot) => {
    if (slot && !slot.isReserved) {
      // Obtén el token de donde lo hayas guardado (ejemplo con localStorage)
    const token = localStorage.getItem('token'); // Reemplaza 'authToken' con la clave correcta

    if (!token) {
      Swal.fire('¡No autenticado!', 'Debes iniciar sesión para reservar una cita.', 'warning');
      return; // Detener la reserva si no hay token
    }
      try {
        console.log('Token recibido para verificar:', token);
        const response = await fetch('http://localhost:5000/api/appointments/book', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,// Aquí deberías incluir el token de autenticación si tu API lo requiere
          },
          body: JSON.stringify({
            fecha: selectedDate.toISOString().split('T')[0],
            hora: slot.time,
            id_medico: 1, // Reemplazar con la lógica para obtener el ID del médico
          }),
        });

        const result = await response.json();

        if (response.ok) {
          Swal.fire(
            '¡Cita reservada!',
            `Tu cita para el ${formatDatePretty(selectedDate)} a las ${slot.time} ha sido confirmada.`,
            'success'
          );
          setSelectedSlot(null);
          fetchAvailableAndReservedSlots(selectedDate); // Recargar horarios
        } else {
          Swal.fire(
            '¡Error!',
            result.message || 'Hubo un problema al reservar tu cita. Por favor, intenta de nuevo.',
            'error'
          );
        }
      } catch (error) {
        console.error('Error al reservar la cita:', error);
        Swal.fire(
          '¡Error de conexión!',
          'Hubo un problema al conectar con el servidor.',
          'error'
        );
      }
    } else if (slot?.isReserved) {
      Swal.fire('¡Horario no disponible!', 'Este horario ya ha sido reservado.', 'warning');
    } else {
      Swal.fire('¡Atención!', 'Por favor, selecciona un horario disponible.', 'warning');
    }
  };

  if (loading) {
    return (
      <div className="appointments-page">
        <Navbar />
        <div className="appointments-layout">
          <Sidebar />
          <div className="appointments-content loading">
            <p>Cargando horarios disponibles...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="appointments-page">
        <Navbar />
        <div className="appointments-layout">
          <Sidebar />
          <div className="appointments-content error">
            <p>Error al cargar los horarios: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="appointments-page">
      <Navbar />
      <div className="appointments-layout">
        <Sidebar />
        <div className="appointments-content">
          <h1>Reservar Cita</h1>
          <div className="appointment-selector">
            <div className="calendar-container">
              <h2>Selecciona una Fecha</h2>
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                inline
                dateFormat="dd/MM/yyyy"
                locale="es"
                className="react-datepicker-custom"
              />
            </div>
            <div className="slots-container">
              <h2>Horarios Disponibles para el {formatDatePretty(selectedDate)}</h2>
              {availableSlots.length > 0 ? (
                <ul className="slots-list">
                  {availableSlots.map(slot => (
                    <li
                      key={slot.id}
                      className={`${selectedSlot?.id === slot.id ? 'selected' : ''} ${slot.isReserved ? 'reserved' : ''}`}
                      onClick={() => handleSlotSelect(slot)}
                    >
                      <FontAwesomeIcon icon={faClock} className="slot-icon" />
                      {slot.time}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No hay horarios disponibles para este día.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Appointments;