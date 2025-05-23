// frontend-mobile/src/screens/Main/MyAppointmentsScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_BASE_URL } from '../../api/config';
import { useAuth } from '../../context/AuthContext';

interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'unknown'; // Agregamos 'completed'
  rawId_medico: string; // ID del médico original del backend
}

interface RawBackendAppointment {
  id_medico: string;
  fecha: string; // ISO string: "2025-05-30T08:00:00.000Z"
  hora: string;  // HH:MM string: "08:00"
}

const MyAppointmentsScreen: React.FC = () => {
  const { userToken } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const getDoctorNameById = (id: string): string => {
    switch (id) {
      case '1': return 'Dr. Alejandro Soto';
      case '2': return 'Dr. Simón Zapata';
      case '3': return 'Dr. Ricardo Vargas';
      case '4': return 'Dra. Sofía Torres';
      default: return `Dr(a). Genérico ${id}`;
    }
  };
  const generalSpecialty = 'Médico General';

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!userToken) {
        Alert.alert('Error', 'No se ha iniciado sesión.');
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/appointments/mine`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      const rawAppointments: RawBackendAppointment[] = response.data;

      const formattedAppointments: Appointment[] = rawAppointments.map((rawApp, index) => {
        const id = `appointment-${rawApp.id_medico}-${rawApp.fecha}-${rawApp.hora}-${index}`;
        const doctorName = getDoctorNameById(rawApp.id_medico);
        const specialty = generalSpecialty;

        const formattedDate = new Date(rawApp.fecha).toISOString().split('T')[0];
        const formattedTime = rawApp.hora;

        // --- LÓGICA CLAVE: DETERMINAR EL ESTADO DE LA CITA ---
        const appointmentDateTime = new Date(`${formattedDate}T${formattedTime}:00`);
        const now = new Date(); // Fecha y hora actual del dispositivo

        let status: Appointment['status'] = 'pending'; // Por defecto, si no se cumple ninguna condición
        if (appointmentDateTime < now) {
            status = 'completed'; // Si la fecha y hora de la cita ya pasaron
        } else {
            status = 'pending'; // Si la cita está en el futuro
        }
        // Puedes agregar más lógica aquí si tu backend maneja 'cancelled' o 'confirmed'
        // Por ejemplo:
        // if (rawApp.estado === 'cancelado') status = 'cancelled';
        // if (rawApp.estado === 'confirmado') status = 'confirmed';
        // --- FIN LÓGICA CLAVE ---

        return {
          id: id,
          doctorName: doctorName,
          specialty: specialty,
          date: formattedDate,
          time: formattedTime,
          status: status, // Usamos el estado calculado
          rawId_medico: rawApp.id_medico,
        };
      });

      setAppointments(formattedAppointments);

    } catch (e: any) {
      console.error('Error fetching appointments:', e.response?.data || e.message);
      setError('No se pudieron cargar tus citas. Intenta de nuevo.');
      setAppointments([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [userToken]);

  const handleCancelAppointment = async (appointmentToCancel: Appointment) => {
    Alert.alert(
      'Confirmar Cancelación',
      `¿Estás seguro de que quieres cancelar la cita con ${appointmentToCancel.doctorName} el ${appointmentToCancel.date} a las ${appointmentToCancel.time}?`,
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Sí',
          onPress: async () => {
            console.log('Frontend - Intentando cancelar cita. Datos a enviar:', {
              fecha: appointmentToCancel.date,
              hora: appointmentToCancel.time,
              id_medico: appointmentToCancel.rawId_medico,
              token: userToken ? 'Presente' : 'Ausente'
            });
            try {
              setLoading(true);
              const response = await axios.delete(`${API_BASE_URL}/appointments/delete`, {
                headers: {
                  Authorization: `Bearer ${userToken}`,
                },
                data: {
                  fecha: appointmentToCancel.date,
                  hora: appointmentToCancel.time,
                  id_medico: appointmentToCancel.rawId_medico,
                },
              });

              console.log('Frontend - Respuesta exitosa del backend:', response.data);
              Alert.alert('Éxito', response.data.message || 'Cita cancelada correctamente.');
              fetchAppointments();
            } catch (error: any) {
              console.error('Frontend - Error al cancelar la cita:', error.response?.data || error.message);
              Alert.alert('Error', error.response?.data?.message || 'No se pudo cancelar la cita. Intenta de nuevo.');
            } finally {
              setLoading(false);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAppointments();
  }, [fetchAppointments]);

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Cargando tus citas...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchAppointments}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Mis Citas</Text>

      {appointments.length === 0 ? (
        <View style={styles.noAppointmentsContainer}>
          <Text style={styles.noAppointmentsText}>No tienes citas programadas.</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => Alert.alert('Navegar', 'Aquí podrías navegar a la pantalla de reservar cita.')}>
            <Text style={styles.retryButtonText}>Reservar una cita</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#007bff" />
          }
        >
          {appointments.map((appointment) => (
            <View key={appointment.id} style={styles.appointmentCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.doctorName}>{appointment.doctorName}</Text>
                <Text style={[
                    styles.status,
                    styles[`status-${appointment.status === 'unknown' ? 'pending' : appointment.status}`]
                ]}>
                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                </Text>
              </View>
              <Text style={styles.detailText}>Especialidad: {appointment.specialty}</Text>
              <Text style={styles.detailText}>Fecha: {appointment.date}</Text>
              <Text style={styles.detailText}>Hora: {appointment.time}</Text>
              <View style={styles.cardActions}>
                {/* El botón de cancelar solo se mostrará si la cita no ha pasado */}
                {appointment.status === 'pending' && (
                  <TouchableOpacity
                    style={[styles.actionButton, styles.cancelButton]}
                    onPress={() => handleCancelAppointment(appointment)}
                  >
                    <Text style={styles.actionButtonText}>Cancelar</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={[styles.actionButton, styles.viewDetailsButton]}
                  onPress={() => Alert.alert('Detalles', `ID de cita: ${appointment.id}`)}
                >
                  <Text style={styles.actionButtonText}>Ver Detalles</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop: 50,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  noAppointmentsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noAppointmentsText: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  appointmentCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  'status-pending': {
    backgroundColor: '#ffc107',
    color: '#333',
  },
  'status-confirmed': {
    backgroundColor: '#28a745',
    color: 'white',
  },
  'status-cancelled': {
    backgroundColor: '#dc3545',
    color: 'white',
  },
  'status-completed': {
    backgroundColor: '#6c757d',
    color: 'white',
  },
  'status-unknown': {
    backgroundColor: '#888',
    color: 'white',
  },
  detailText: {
    fontSize: 15,
    color: '#666',
    marginBottom: 5,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginLeft: 10,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#dc3545',
  },
  viewDetailsButton: {
    backgroundColor: '#007bff',
  },
});

export default MyAppointmentsScreen;