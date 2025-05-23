// frontend-mobile/src/screens/Main/AppointmentsScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, TouchableOpacity, Platform, Button } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../../api/config';
import DateTimePicker from '@react-native-community/datetimepicker';
import { FontAwesome5 } from '@expo/vector-icons';

interface Slot {
  id: string;
  time: string;
  isReserved: boolean;
}

interface AppointmentsScreenProps {
  navigation: any;
}

// --- Función para obtener la hora actual en Colombia (GMT-5) ---
const getColombiaTime = () => {
  const now = new Date();
  const offsetColombia = -5 * 60; // Colombia es GMT-5, convertimos a minutos de diferencia
  const localOffset = now.getTimezoneOffset(); // Diferencia en minutos de la hora local a UTC
  
  // Convertir la hora local a UTC, luego aplicar el offset de Colombia
  const colombiaTime = new Date(now.getTime() + (offsetColombia - localOffset) * 60 * 1000);
  return colombiaTime;
};
// --- FIN Función para obtener la hora actual en Colombia (GMT-5) ---


const AppointmentsScreen: React.FC<AppointmentsScreenProps> = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState(getColombiaTime()); // Iniciar con la fecha actual de Colombia
  const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
  const [reservedSlots, setReservedSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const formatDatePretty = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('es-CO', options);
  };

  const fetchAvailableAndReservedSlots = useCallback(async (date: Date) => {
    setLoading(true);
    setError(null);
    const formattedDate = date.toISOString().split('T')[0]; // Formato 'YYYY-MM-DD'

    try {
      let availableSlotsGenerated: Slot[] = [];
      for (let hour = 8; hour <= 17; hour++) {
        availableSlotsGenerated.push({ id: `${formattedDate}-${hour}:00`, time: `${hour < 10 ? '0' : ''}${hour}:00`, isReserved: false });
        if (hour < 17) { // No agregar media hora después de las 17:00
          availableSlotsGenerated.push({ id: `${formattedDate}-${hour}:30`, time: `${hour < 10 ? '0' : ''}${hour}:30`, isReserved: false });
        }
      }

      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        setError('No autenticado. Por favor, inicie sesión.');
        setLoading(false);
        navigation.replace('Login');
        return;
      }

      const reservedResponse = await axios.get<string[]>(`${API_BASE_URL}/appointments/reserved?date=${formattedDate}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const reservedData = reservedResponse.data;
      setReservedSlots(reservedData);

      // --- FILTRADO DE HORARIOS YA PASADOS Y MARCADO DE RESERVADOS ---
      const nowColombia = getColombiaTime();
      const todayFormatted = nowColombia.toISOString().split('T')[0];

      const updatedAvailableSlots = availableSlotsGenerated
        .map(slot => {
          // Marcar si está reservado por el backend
          const isBackendReserved = reservedData.includes(slot.time);

          // Determinar si el slot ya ha pasado
          let isPast = false;
          if (formattedDate === todayFormatted) { // Solo si es hoy
            const [slotHour, slotMinute] = slot.time.split(':').map(Number);
            
            // Crea un objeto Date para el slot específico del día actual en la hora de Colombia
            const slotDateTimeColombia = new Date(
              nowColombia.getFullYear(),
              nowColombia.getMonth(),
              nowColombia.getDate(),
              slotHour,
              slotMinute
            );
            
            if (slotDateTimeColombia < nowColombia) {
              isPast = true; // El slot ya pasó si su hora es anterior a la hora actual de Colombia
            }
          }
          
          return {
            ...slot,
            isReserved: isBackendReserved || isPast, // Si está reservado por backend O si ya pasó
          };
        })
        .sort((a, b) => {
          const timeA = new Date(`2000/01/01 ${a.time}`);
          const timeB = new Date(`2000/01/01 ${b.time}`);
          return timeA.getTime() - timeB.getTime();
        });

      setAvailableSlots(updatedAvailableSlots);
      setLoading(false);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error desconocido al cargar horarios.';
      setError(errorMessage);
      setLoading(false);
      console.error('Error al cargar los horarios:', err);
      if (err.response && err.response.status === 401) {
        Alert.alert('Sesión Expirada', 'Tu sesión ha expirado. Por favor, inicia sesión de nuevo.');
        navigation.replace('Login');
      }
    }
  }, [navigation]);

  useEffect(() => {
    fetchAvailableAndReservedSlots(selectedDate);
    const unsubscribe = navigation.addListener('focus', () => {
      fetchAvailableAndReservedSlots(selectedDate);
    });
    return unsubscribe;
  }, [selectedDate, fetchAvailableAndReservedSlots, navigation]);

  const onDateChange = (event: any, newDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (newDate) {
      // Nos aseguramos de que el día sea el de Colombia para la comparación
      const colombiaDate = getColombiaTime();
      colombiaDate.setHours(0,0,0,0); // Poner en medianoche para solo comparar el día

      // Si la nueva fecha seleccionada es anterior al día actual de Colombia,
      // no la establecemos y quizás mostramos una alerta.
      const selectedDayStart = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate());
      
      if (selectedDayStart < colombiaDate) {
        Alert.alert("Fecha Inválida", "No puedes seleccionar una fecha en el pasado.");
        // No actualizamos selectedDate, manteniéndolo en la fecha actual o futura.
        // Si el picker ya se cerró en Android, no hay problema.
        // En iOS, el picker se mantiene visible hasta que selecciones una fecha válida o canceles.
        return; 
      }
      setSelectedDate(newDate);
      setSelectedSlot(null);
    }
  };

  const handleSlotSelect = (slot: Slot) => {
    // Si el slot ya está marcado como reservado (ya sea por backend o por ser pasado)
    if (slot.isReserved) {
      Alert.alert('Horario no disponible', 'Este horario ya ha sido reservado o ya ha pasado.');
      return;
    }

    // --- Validación adicional para slots del día actual que ya pasaron ---
    const nowColombia = getColombiaTime();
    const todayFormatted = nowColombia.toISOString().split('T')[0];
    const selectedDateFormatted = selectedDate.toISOString().split('T')[0];

    if (selectedDateFormatted === todayFormatted) {
        const [slotHour, slotMinute] = slot.time.split(':').map(Number);
        const slotDateTimeColombia = new Date(
            nowColombia.getFullYear(),
            nowColombia.getMonth(),
            nowColombia.getDate(),
            slotHour,
            slotMinute
        );
        if (slotDateTimeColombia < nowColombia) {
            Alert.alert('Horario no disponible', 'Este horario ya ha pasado.');
            return;
        }
    }
    // --- FIN Validación adicional ---

    setSelectedSlot(slot);
    Alert.alert(
      '¿Confirmar esta hora?',
      `Has seleccionado el horario de las ${slot.time} para el ${formatDatePretty(selectedDate)}.`,
      [
        { text: 'Cancelar', style: 'cancel', onPress: () => setSelectedSlot(null) },
        { text: 'Sí, reservar', onPress: () => handleBookAppointment(slot) },
      ],
      { cancelable: false }
    );
  };

  const handleBookAppointment = async (slot: Slot) => {
    // No es estrictamente necesario volver a validar aquí porque handleSlotSelect ya lo hace,
    // pero es una buena práctica de seguridad.
    if (slot && !slot.isReserved) {
      // Re-validación rápida en caso de que un usuario muy rápido intentara reservar un slot ya pasado
      const nowColombia = getColombiaTime();
      const todayFormatted = nowColombia.toISOString().split('T')[0];
      const selectedDateFormatted = selectedDate.toISOString().split('T')[0];

      if (selectedDateFormatted === todayFormatted) {
        const [slotHour, slotMinute] = slot.time.split(':').map(Number);
        const slotDateTimeColombia = new Date(
            nowColombia.getFullYear(),
            nowColombia.getMonth(),
            nowColombia.getDate(),
            slotHour,
            slotMinute
        );
        if (slotDateTimeColombia < nowColombia) {
            Alert.alert('Error', 'Este horario ya ha pasado y no puede ser reservado.');
            setSelectedSlot(null);
            fetchAvailableAndReservedSlots(selectedDate); // Recargar para actualizar UI
            return;
        }
      }

      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('No autenticado', 'Debes iniciar sesión para reservar una cita.');
        navigation.replace('Login');
        return;
      }

      try {
        const response = await axios.post(`${API_BASE_URL}/appointments/book`, {
          fecha: selectedDate.toISOString().split('T')[0],
          hora: slot.time,
          id_medico: 1, // **IMPORTANTE: Mantener en mente que esto es un valor fijo**
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          Alert.alert(
            'Cita reservada',
            `Tu cita para el ${formatDatePretty(selectedDate)} a las ${slot.time} ha sido confirmada.`
          );
          setSelectedSlot(null);
          fetchAvailableAndReservedSlots(selectedDate);
          navigation.navigate('My Appointments');
        } else {
          Alert.alert(
            'Error',
            response.data?.message || 'Hubo un problema al reservar tu cita. Intenta de nuevo.'
          );
        }
      } catch (error: any) {
        console.error('Error al reservar la cita:', error.response?.data || error.message);
        Alert.alert(
          'Error de conexión',
          error.response?.data?.message || 'Hubo un problema al conectar con el servidor.'
        );
      }
    } else if (slot?.isReserved) {
      Alert.alert('Horario no disponible', 'Este horario ya ha sido reservado.');
    } else {
      Alert.alert('Atención', 'Por favor, selecciona un horario disponible.');
    }
  };

  const renderSlotItem = ({ item }: { item: Slot }) => (
    <TouchableOpacity
      style={[
        styles.slotCard,
        selectedSlot?.id === item.id && styles.selectedSlot,
        item.isReserved && styles.reservedSlot, // isReserved ahora incluye los slots pasados
      ]}
      onPress={() => handleSlotSelect(item)}
      disabled={item.isReserved} // Deshabilita si está reservado o ya pasó
    >
      <FontAwesome5 name="clock" size={16} color={item.isReserved ? '#666' : (selectedSlot?.id === item.id ? 'white' : '#007bff')} style={styles.slotIcon} />
      <Text style={[styles.slotText, item.isReserved ? styles.reservedSlotText : (selectedSlot?.id === item.id ? styles.selectedSlotText : {})]}>
        {item.time}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Cargando horarios disponibles...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>Error al cargar los horarios: {error}</Text>
        <Button title="Reintentar" onPress={() => fetchAvailableAndReservedSlots(selectedDate)} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Reservar Cita</Text>

      <View style={styles.calendarContainer}>
        <Text style={styles.subHeader}>Selecciona una Fecha</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
          <Text style={styles.datePickerButtonText}>{formatDatePretty(selectedDate)}</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={selectedDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onDateChange}
            minimumDate={getColombiaTime()} // <-- IMP: No permitir fechas anteriores al día actual de Colombia
          />
        )}
      </View>

      <View style={styles.slotsContainer}>
        <Text style={styles.subHeader}>Horarios Disponibles para el {formatDatePretty(selectedDate)}</Text>
        {availableSlots.length > 0 ? (
          <FlatList
            data={availableSlots}
            renderItem={renderSlotItem}
            keyExtractor={item => item.id}
            numColumns={3}
            columnWrapperStyle={styles.slotsListColumnWrapper}
            contentContainerStyle={styles.flatListContent}
          />
        ) : (
          <Text style={styles.noSlotsText}>No hay horarios disponibles para este día.</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 20,
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#28a745',
    marginBottom: 15,
    textAlign: 'center',
  },
  calendarContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  datePickerButton: {
    backgroundColor: '#e9ecef',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ced4da',
  },
  datePickerButtonText: {
    fontSize: 18,
    color: '#495057',
    fontWeight: 'bold',
  },
  slotsContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  flatListContent: {
    paddingBottom: 10,
  },
  slotsListColumnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  slotCard: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
    flexDirection: 'row',
  },
  selectedSlot: {
    backgroundColor: '#28a745',
    borderColor: '#28a745',
  },
  reservedSlot: {
    opacity: 0.5,
    backgroundColor: '#e0e0e0',
    borderColor: '#b0b0b0',
  },
  slotText: {
    fontSize: 16,
    color: '#495057',
  },
  selectedSlotText: {
    color: 'white',
    fontWeight: 'bold',
  },
  reservedSlotText: {
    color: '#666',
  },
  slotIcon: {
    marginRight: 5,
  },
  noSlotsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default AppointmentsScreen;