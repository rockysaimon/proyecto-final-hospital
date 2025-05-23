// frontend-mobile/src/screens/Main/HomeScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      Alert.alert('Sesión Cerrada', 'Has cerrado sesión correctamente.');
      navigation.replace('Login'); // Vuelve a la pantalla de login
    } catch (e) {
      console.error('Error al cerrar sesión:', e);
      Alert.alert('Error', 'No se pudo cerrar la sesión.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Bienvenido a Hospital Móvil!</Text>
      <Button title="Mis Citas" onPress={() => navigation.navigate('My Appointments')} />
      <Button title="Agendar Cita" onPress={() => navigation.navigate('Book Appointment')} />
      <Button title="Mi Perfil" onPress={() => navigation.navigate('Profile')} />
      <Button title="Cerrar Sesión" onPress={handleLogout} color="red" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
});

export default HomeScreen;