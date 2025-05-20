// controllers/appointmentsController.js
const { sql } = require('../config/db');

// Función para obtener horarios disponibles para una fecha específica
const getAvailableSlots = async (req, res) => {
  const { date } = req.query;
  if (!date) {
    return res.status(400).json({ message: 'Se requiere la fecha.' });
  }
  try {
    const result = await sql.query`
      SELECT CONVERT(VARCHAR(5), fecha, 108) AS hora
      FROM Agenda_Medica
      WHERE CAST(fecha AS DATE) = ${date} AND estado = 'disponible'
      ORDER BY fecha
    `;
    const slots = result.recordset.map(row => ({ id: `${date}-${row.hora}`, time: row.hora, isReserved: false }));
    res.json(slots);
  } catch (error) {
    console.error('Error al obtener horarios disponibles:', error);
    res.status(500).json({ message: 'Error al cargar los horarios.' });
  }
};

// Función para obtener horarios reservados para una fecha específica
const getReservedSlots = async (req, res) => {
  const { date } = req.query;
  if (!date) {
    return res.status(400).json({ message: 'Se requiere la fecha.' });
  }
  try {
    const result = await sql.query`
      SELECT CONVERT(VARCHAR(5), fecha, 108) AS hora
      FROM Agenda_Medica
      WHERE CAST(fecha AS DATE) = ${date} AND estado = 'ocupado'
      ORDER BY fecha
    `;
    const reservedSlots = result.recordset.map(row => row.hora);
    res.json(reservedSlots);
  } catch (error) {
    console.error('Error al obtener horarios reservados:', error);
    res.status(500).json({ message: 'Error al cargar los horarios reservados.' });
  }
};


const bookAppointment = async (req, res) => {
  const { fecha, hora, id_paciente } = req.body;
  const id_medico = req.user.id_usuario;

  if (!fecha || !hora || !id_medico) {
    return res.status(400).json({ message: 'Faltan datos para la reserva.' });
  }

  try {
    // Formatear la fecha y hora para la consulta
    const fechaHora = `${fecha} ${hora}:00`;

    // Verificar si ya existe una cita para este médico, fecha y hora
    const existingAppointment = await sql.query`
      SELECT * FROM Agenda_Medica
      WHERE id_medico = ${id_medico} AND fecha = ${fechaHora}
    `;

    if (existingAppointment.recordset.length > 0) {
      return res.status(400).json({ message: 'El horario seleccionado no está disponible.' });
    }

    // Si no existe una cita, proceder a crear la nueva y marcarla como 'ocupado'
    const result = await sql.query`
      INSERT INTO Agenda_Medica (id_medico, fecha, estado)
      VALUES (${id_medico}, ${fechaHora}, 'ocupado')
    `;

    if (result.rowsAffected[0] > 0) {
      res.status(201).json({ message: 'Cita reservada con éxito.' });
    } else {
      res.status(400).json({ message: 'No se pudo reservar la cita.' });
    }

  } catch (error) {
    console.error('Error al reservar la cita:', error);
    res.status(500).json({ message: 'Error al reservar la cita.' });
  }
};

const getMyAppointments = async (req, res) => {
  try {
    const id_usuario = req.user.id_usuario; // Obtener el ID del usuario autenticado
    console.log('ID del paciente para la consulta de citas:', id_usuario);

    const query = `
      SELECT id_medico, fecha, CONVERT(VARCHAR(5), fecha, 108) AS hora
      FROM Agenda_Medica
      WHERE id_medico = ${id_usuario} AND estado = 'ocupado'
      ORDER BY fecha DESC
    `;
    console.log('Consulta SQL para obtener citas:', query);

    const result = await sql.query(query);
    console.log('Resultado de la consulta de citas:', result);

    res.json(result.recordset);
  } catch (error) {
    console.error('Error al obtener las citas del usuario:', error);
    res.status(500).json({ message: 'Error al cargar tus citas.', error: error.message }); // Include error message
  }
};

// Función para eliminar una cita por su ID
const deleteAppointment = async (req, res) => {
  const { fecha, hora, id_medico } = req.body;
  const id_usuario = req.user.id_usuario;

  console.log('Backend - Datos recibidos para eliminar cita:', { fecha, hora, id_medico, id_paciente }); // LOG

  if (!fecha || !hora || !id_medico || !id_paciente) {
    return res.status(400).json({ message: 'Faltan datos para eliminar la cita.' });
  }

  try {
    const query = `
      DELETE FROM Agenda_Medica
      WHERE id_medico = ${id_usuario}
        AND fecha = '${fecha}'
        AND estado = 'ocupado'
    `;
    console.log('Backend - Consulta SQL para eliminar cita:', query); // LOG

    const result = await sql.query(query);
    console.log('Backend - Resultado de la eliminación:', result); // LOG

    if (result.rowsAffected[0] > 0) {
      res.json({ message: 'Cita eliminada con éxito.' });
    } else {
      res.status(404).json({ message: 'Cita no encontrada o no pertenece al usuario.' });
    }
  } catch (error) {
    console.error('Backend - Error al eliminar la cita:', error);
    res.status(500).json({ message: 'Error al eliminar la cita.' });
  }
};

module.exports = { getAvailableSlots, getReservedSlots, bookAppointment, getMyAppointments, deleteAppointment };
