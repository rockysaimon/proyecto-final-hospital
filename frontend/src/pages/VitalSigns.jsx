// src/pages/VitalSigns.jsx
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Input from '../components/Input';
import Button from '../components/Button';
import './VitalSigns.css';
import Swal from 'sweetalert2'; // Importa SweetAlert

function VitalSigns() {
  const [vitalSigns, setVitalSigns] = useState({
    id_paciente: '', // ¡Nuevo campo para el ID del paciente!
    oximetry: '',
    respiratoryRate: '',
    heartRate: '',
    temperature: '',
    bloodPressureSystolic: '',
    bloodPressureDiastolic: '',
    glucose: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVitalSigns(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => { // Marca como async
    e.preventDefault();

    // Validar que todos los campos estén llenos
    const requiredFields = [
      'id_paciente', 'oximetry', 'respiratoryRate', 'heartRate',
      'temperature', 'bloodPressureSystolic', 'bloodPressureDiastolic', 'glucose'
    ];
    const isAnyFieldEmpty = requiredFields.some(field => !vitalSigns[field]);

    if (isAnyFieldEmpty) {
      Swal.fire('Error', 'Por favor, rellena todos los campos.', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        Swal.fire('Error', 'No estás autenticado. Por favor, inicia sesión.', 'error');
        return;
      }

      // Preparar los datos para enviar al backend
      const dataToSubmit = {
        id_paciente: parseInt(vitalSigns.id_paciente, 10), // Asegura que sea un número
        oximetry: parseFloat(vitalSigns.oximetry),
        respiratoryRate: parseInt(vitalSigns.respiratoryRate, 10),
        heartRate: parseInt(vitalSigns.heartRate, 10),
        temperature: parseFloat(vitalSigns.temperature),
        bloodPressureSystolic: parseInt(vitalSigns.bloodPressureSystolic, 10),
        bloodPressureDiastolic: parseInt(vitalSigns.bloodPressureDiastolic, 10),
        glucose: parseFloat(vitalSigns.glucose),
        // No enviamos bloodPressure combinado aquí, ya que el backend lo espera separado
      };

      console.log('Datos a enviar:', dataToSubmit);

      const response = await fetch('http://localhost:5000/api/vital-signs/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSubmit),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error al registrar signos vitales: ${response.status}`);
      }

      const responseData = await response.json();
      Swal.fire('Éxito', responseData.message, 'success');

      // Opcional: Limpiar el formulario después del envío exitoso
      setVitalSigns({
        id_paciente: '',
        oximetry: '',
        respiratoryRate: '',
        heartRate: '',
        temperature: '',
        bloodPressureSystolic: '',
        bloodPressureDiastolic: '',
        glucose: '',
      });

    } catch (error) {
      console.error('Error al registrar signos vitales:', error);
      Swal.fire('Error', error.message, 'error');
    }
  };

  return (
    <div className="vital-signs-page">
      <Navbar />
      <div className="vital-signs-layout">
        <Sidebar />
        <div className="vital-signs-content">
          <h1>Registrar Signos Vitales</h1>
          <form onSubmit={handleSubmit} className="vital-signs-form">
            <div className="form-grid">
              <Input
                label="ID del Paciente" // Campo para el ID del paciente
                type="number"
                name="id_paciente"
                value={vitalSigns.id_paciente}
                onChange={handleChange}
              />
              <Input
                label="Oximetría (%)"
                type="number"
                name="oximetry"
                value={vitalSigns.oximetry}
                onChange={handleChange}
              />
              <Input
                label="Frecuencia Respiratoria (rpm)"
                type="number"
                name="respiratoryRate"
                value={vitalSigns.respiratoryRate}
                onChange={handleChange}
              />
              <Input
                label="Frecuencia Cardíaca (lpm)"
                type="number"
                name="heartRate"
                value={vitalSigns.heartRate}
                onChange={handleChange}
              />
              <Input
                label="Temperatura (°C)"
                type="number"
                step="0.1"
                name="temperature"
                value={vitalSigns.temperature}
                onChange={handleChange}
              />
              <Input
                label="Presión Arterial Sistólica (mmHg)"
                type="number"
                name="bloodPressureSystolic"
                value={vitalSigns.bloodPressureSystolic}
                onChange={handleChange}
              />
              <Input
                label="Presión Arterial Diastólica (mmHg)"
                type="number"
                name="bloodPressureDiastolic"
                value={vitalSigns.bloodPressureDiastolic}
                onChange={handleChange}
              />
              <Input
                label="Glicemia (mg/dL)"
                type="number"
                name="glucose"
                value={vitalSigns.glucose}
                onChange={handleChange}
              />
            </div>
            <Button type="submit">Registrar Signos</Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default VitalSigns;