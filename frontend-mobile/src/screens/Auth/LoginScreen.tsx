// frontend-mobile/src/screens/Auth/LoginScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import axios from 'axios';
import { API_BASE_URL } from '../../api/config';
import { useAuth } from '../../context/AuthContext';

const LoginScreen = ({ navigation }: { navigation: any }) => {
  const { login } = useAuth(); 

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const trimmedEmail = email.trim();
      const trimmedPassword = password.trim();

      const requestData = {
        correo: trimmedEmail,
        password: trimmedPassword,
      };
      console.log('--- DEBUG: Enviando solicitud de login con:');
      console.log(JSON.stringify(requestData, null, 2));
      console.log('--- FIN DEBUG: Datos de solicitud ---');

      const response = await axios.post(`${API_BASE_URL}/auth/login`, requestData);

      const { token, user } = response.data;

      if (token && user) {
        // --- CAMBIO CLAVE AQUÍ: user.nombre en lugar de user.nombre_usuario ---
        // Tu backend devuelve el nombre como 'nombre' dentro del objeto 'user'
        await login(token, user.nombre, user.correo); // <-- ¡CORREGIDO!

        Alert.alert('¡Éxito!', `¡Bienvenido, ${user?.nombre || 'usuario'}!`); // También ajustado aquí
      } else {
        Alert.alert('Error de autenticación', 'No se recibieron el token o los datos del usuario del servidor.');
      }
    } catch (error: any) {
      console.error('--- DEBUG: Error completo de inicio de sesión ---');
      console.error('Mensaje de error Axios:', error.message);
      if (error.response) {
        console.error('Status del error (HTTP):', error.response.status);
        console.error('Datos de la respuesta de error (Backend):', error.response.data);
      } else if (error.request) {
        console.error('No se recibió respuesta del servidor (error de red o CORS).');
      } else {
        console.error('Error al configurar la petición:', error.config);
      }
      console.error('--- FIN DEBUG: Error completo ---');

      Alert.alert(
        'Error de inicio de sesión',
        error.response?.data?.message || 'Credenciales inválidas o error de conexión. Intenta de nuevo.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.formContainer}>
        <Text style={styles.title}>Iniciar Sesión</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Correo Electrónico:</Text>
          <TextInput
            style={styles.input}
            placeholder="tu@ejemplo.com"
            placeholderTextColor="#888"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Contraseña:</Text>
          <TextInput
            style={styles.input}
            placeholder="********"
            placeholderTextColor="#888"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginButtonText}>Ingresar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.registerText}>¿No tienes cuenta? Regístrate aquí</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 25,
    textAlign: 'center',
  },
  inputGroup: {
    width: '100%',
    marginBottom: 15,
  },
  label: {
    fontSize: 15,
    color: '#333',
    marginBottom: 5,
    fontWeight: '600',
  },
  input: {
    width: '100%',
    height: 45,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  loginButton: {
    backgroundColor: '#28a745',
    width: '100%',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    marginBottom: 15,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  registerText: {
    color: '#007bff',
    fontSize: 15,
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;