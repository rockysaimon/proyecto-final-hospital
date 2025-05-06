// src/pages/VitalSigns.jsx
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar'; // Importa el Sidebar
import Input from '../components/Input';
import Button from '../components/Button';
import './VitalSigns.css'; // Importa el archivo de estilos

function VitalSigns() {
  const [vitalSigns, setVitalSigns] = useState({
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const bloodPressure = `${vitalSigns.bloodPressureSystolic}/${vitalSigns.bloodPressureDiastolic}`;
    const dataToSubmit = { ...vitalSigns, bloodPressure };
    console.log('Registrando signos vitales:', dataToSubmit);
    // Aquí iría la llamada a la API del backend
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
              {/* Puedes agregar más campos aquí */}
            </div>
            <Button type="submit">Registrar Signos</Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default VitalSigns;