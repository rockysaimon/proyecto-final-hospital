// frontend-mobile/src/screens/ProfileScreen.tsx (no necesita cambios)
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../context/AuthContext'

interface ProfileScreenProps {
  navigation: any;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { logout } = useAuth(); 
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Intenta obtener el nombre de usuario y el correo de AsyncStorage
      const storedUserName = await AsyncStorage.getItem('user_name'); // Correcto
      const storedUserEmail = await AsyncStorage.getItem('user_email'); // Correcto

      if (storedUserName) {
        setUserName(storedUserName);
      } else {
        console.warn("User name not found in AsyncStorage."); // Esta advertencia debería desaparecer ahora
      }

      if (storedUserEmail) {
        setUserEmail(storedUserEmail);
      } else {
        console.warn("User email not found in AsyncStorage."); // Esta advertencia debería desaparecer ahora
      }

    } catch (e: any) {
      console.error('Error fetching user profile from AsyncStorage:', e); // Cambié el mensaje de error
      setError('No se pudo cargar la información del perfil.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserProfile();
    const unsubscribe = navigation.addListener('focus', () => {
      fetchUserProfile();
    });
    return unsubscribe;
  }, [fetchUserProfile, navigation]);

  const handleLogout = async () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar tu sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sí, cerrar',
          onPress: async () => {
            try {
              await logout();
              Alert.alert('Sesión Cerrada', 'Has cerrado sesión correctamente.');
            } catch (e) {
              console.error('Error al cerrar sesión:', e);
              Alert.alert('Error', 'No se pudo cerrar la sesión. Intenta de nuevo.');
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Cargando perfil...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchUserProfile}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Mi Perfil</Text>

      <View style={styles.profileCard}>
        <Text style={styles.label}>Nombre:</Text>
        <Text style={styles.value}>{userName || 'No disponible'}</Text>

        <View style={styles.divider} />

        <Text style={styles.label}>Correo Electrónico:</Text>
        <Text style={styles.value}>{userEmail || 'No disponible'}</Text>
      </View>


      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
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
    marginBottom: 30,
    textAlign: 'center',
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 18,
    color: '#333',
    marginBottom: 15,
  },
  divider: {
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    marginVertical: 15,
  },
  editButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  editButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;