// src/pages/VitalSignsHistory.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar'; // Importa el Sidebar
import Button from '../components/Button'; // Importa el Button component
import './VitalSignsHistory.css'; // Importa el archivo de estilos
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint } from '@fortawesome/free-solid-svg-icons';

function VitalSignsHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulación de datos para mientras conectamos al backend
    setTimeout(() => {
      setHistory([
        { id: 1, timestamp: '2025-05-06 10:00', oximetry: 98, respiratoryRate: 16, heartRate: 75, temperature: 36.5, bloodPressure: '120/80', glucose: 90 },
        { id: 2, timestamp: '2025-05-05 18:30', oximetry: 97, respiratoryRate: 17, heartRate: 78, temperature: 36.8, bloodPressure: '118/78', glucose: 95 },
        // ... más registros
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="vital-signs-history-page">
        <Navbar />
        <div className="vital-signs-history-layout">
          <Sidebar />
          <div className="vital-signs-history-content">
            <p>Cargando historial de signos vitales...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="vital-signs-history-page">
        <Navbar />
        <div className="vital-signs-history-layout">
          <Sidebar />
          <div className="vital-signs-history-content">
            <p>Error al cargar el historial de signos vitales: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="vital-signs-history-page">
      <Navbar />
      <div className="vital-signs-history-layout">
        <Sidebar />
        <div className="vital-signs-history-content">
          <h1>Historial de Signos Vitales</h1>
          <div className="history-actions">
            <Button onClick={handlePrint}>
              <FontAwesomeIcon icon={faPrint} className="print-icon" />
              Imprimir
            </Button>
          </div>
          {history.length > 0 ? (
            <div className="table-responsive">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Fecha/Hora</th>
                    <th>Oximetría (%)</th>
                    <th>FR (rpm)</th>
                    <th>FC (lpm)</th>
                    <th>Temperatura (°C)</th>
                    <th>Presión Arterial (mmHg)</th>
                    <th>Glicemia (mg/dL)</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map(record => (
                    <tr key={record.id}>
                      <td>{record.timestamp}</td>
                      <td>{record.oximetry}</td>
                      <td>{record.respiratoryRate}</td>
                      <td>{record.heartRate}</td>
                      <td>{record.temperature}</td>
                      <td>{record.bloodPressure}</td>
                      <td>{record.glucose}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No se han registrado signos vitales aún.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default VitalSignsHistory;