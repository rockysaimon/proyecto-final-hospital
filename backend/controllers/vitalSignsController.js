// src/backend/controllers/vitalSignsController.js
const { sql } = require('../config/db');

const registerVitalSigns = async (req, res) => {
  // Asegúrate de que el usuario logueado es un médico y obtén su ID
  const id_paciente = req.user.id_usuario; // El ID del usuario que está registrando (debe ser un médico)
  const registrado_por = req.user.id_usuario; // El ID del médico que registra los signos vitales
  const {
    oximetry,
    respiratoryRate,
    heartRate,
    temperature,
    bloodPressureSystolic,
    bloodPressureDiastolic,
    glucose,
  } = req.body;

  // Validaciones básicas
  if (!id_paciente || !registrado_por || !oximetry || !respiratoryRate || !heartRate || !temperature || !bloodPressureSystolic || !bloodPressureDiastolic || !glucose) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
  }

  // Si quieres validar roles, hazlo aquí o en un middleware.
  // Por ejemplo, si solo los médicos pueden registrar esto:
  // if (req.user.rol !== 'medico') {
  //   return res.status(403).json({ message: 'Solo los médicos pueden registrar signos vitales.' });
  // }

  try {
    console.log('ID del paciente:', id_paciente,glucose);
    const fecha_registro = new Date(); // Fecha y hora actual del registro

    const result = await sql.query`
      INSERT INTO Signos_Vitales (
        id_paciente,
        fecha_registro,
        oximetria,
        frecuencia_respiratoria,
        frecuencia_cardiaca,
        temperatura,
        presion_arterial_sistolica,
        presion_arterial_diastolica,
        glicemia,
        registrado_por
      )
      VALUES (
        ${id_paciente},
        ${fecha_registro},
        ${oximetry},
        ${respiratoryRate},
        ${heartRate},
        ${temperature},
        ${bloodPressureSystolic},
        ${bloodPressureDiastolic},
        ${glucose},
        ${registrado_por}
      );
    `;

    if (result.rowsAffected[0] > 0) {
      res.status(201).json({ message: 'Signos vitales registrados con éxito.' });
    } else {
      res.status(500).json({ message: 'No se pudieron registrar los signos vitales.' });
    }
  } catch (error) {
    console.error('Error al registrar signos vitales:', error);
    res.status(500).json({ message: 'Error interno del servidor al registrar signos vitales.' });
  }
};

module.exports = {
  registerVitalSigns,
};