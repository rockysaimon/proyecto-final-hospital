// src/pages/Appointments.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar'; // Importa el Sidebar
import Button from '../components/Button';
import './Appointments.css'; // Importa el archivo de estilos
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Estilos del calendario
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';

function Appointments() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(false); // Cambiado a false inicialmente
  const [error, setError] = useState(null);

  // Simulación de horarios disponibles para un día seleccionado (reemplazar con llamada a la API)
  const fetchAvailableSlots = (date) => {
    setLoading(true);
    setError(null);
    const formattedDate = date.toISOString().split('T')[0];
    // Simula la respuesta de la API
    setTimeout(() => {
      const slots = [];
      for (let hour = 8; hour <= 17; hour++) {
        if (Math.random() > 0.3) { // Simula disponibilidad aleatoria
          slots.push({ id: `${formattedDate}-${hour}:00`, time: `${hour}:00` });
        }
        if (Math.random() > 0.5) {
          slots.push({ id: `${formattedDate}-${hour}:30`, time: `${hour}:30` });
        }
      }
      setAvailableSlots(slots);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    fetchAvailableSlots(selectedDate); // Carga los horarios al cargar la página con la fecha actual
  }, [selectedDate]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedSlot(null); // Desselecciona cualquier horario previamente seleccionado
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    console.log('Horario seleccionado:', slot);
  };

  const handleBookAppointment = () => {
    if (selectedSlot) {
      console.log('Reservando cita para:', selectedDate, selectedSlot);
      // Aquí iría la llamada a la API para reservar la cita con la fecha y hora seleccionadas
    } else {
      alert('Por favor, selecciona un horario disponible.');
    }
  };

  if (loading) {
    return (
      <div className="appointments-page">
        <Navbar />
        <div className="appointments-layout">
          <Sidebar />
          <div className="appointments-content">
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
          <div className="appointments-content">
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
                dateFormat="yyyy-MM-dd"
              />
            </div>
            <div className="slots-container">
              <h2>Horarios Disponibles para el {selectedDate.toLocaleDateString()}</h2>
              {availableSlots.length > 0 ? (
                <ul className="slots-list">
                  {availableSlots.map(slot => (
                    <li
                      key={slot.id}
                      className={selectedSlot?.id === slot.id ? 'selected' : ''}
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
              {selectedSlot && (
                <div className="confirmation">
                  <p>Has seleccionado el horario de las {selectedSlot.time}.</p>
                  <Button onClick={handleBookAppointment}>Confirmar Cita</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Appointments;