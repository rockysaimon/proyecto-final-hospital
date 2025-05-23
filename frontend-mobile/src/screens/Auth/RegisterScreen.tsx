// frontend-mobile/src/screens/Auth/RegisterScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { API_BASE_URL } from '../../api/config';

interface RegisterScreenProps {
  navigation: any;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  // Estados actualizados para coincidir con los nombres de campo del backend
  const [nombre_usuario, setNombreUsuario] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState(''); // Nuevo campo
  const [identificador, setIdentificador] = useState(''); // Nuevo campo (Cédula)
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        nombre_usuario: nombre_usuario, // Coincide con el backend
        correo: correo,             // Coincide con el backend
        telefono: telefono,         // ¡Campo nuevo!
        password: password,
        identificador: identificador, // ¡Campo nuevo! (Cédula)
        id_rol: 1,                  // Asegúrate de que este rol es el adecuado para pacientes
      });

      // Tu backend devuelve un 200 OK incluso si el registro falla (por ejemplo, email duplicado)
      // por lo que necesitamos revisar el `result.message` o `response.data`
      if (response.data && response.data.message === 'Usuario registrado exitosamente') {
        Alert.alert('Éxito', '¡Registro exitoso! Ahora puedes iniciar sesión.');
        navigation.navigate('Login'); // Vuelve a la pantalla de Login
      } else {
        // Manejar otros mensajes de error del backend (ej. email ya existe)
        const errorMessage = response.data?.message || 'Error al registrar usuario.';
        Alert.alert('Error', errorMessage);
      }
    } catch (error: any) {
      console.error('Error de registro:', error.response?.data || error.message);
      Alert.alert('Error', error.response?.data?.message || 'Error al conectar con el servidor.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre de usuario"
        value={nombre_usuario}
        onChangeText={setNombreUsuario}
      />
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={correo}
        onChangeText={setCorreo}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Teléfono"
        value={telefono}
        onChangeText={setTelefono}
        keyboardType="phone-pad" // Teclado numérico para teléfono
      />
      <TextInput
        style={styles.input}
        placeholder="Cédula"
        value={identificador}
        onChangeText={setIdentificador}
        keyboardType="numeric" // Teclado numérico para cédula
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirmar Contraseña"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <Button title="Registrarse" onPress={handleRegister} />
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginText}>¿Ya tienes cuenta? Inicia Sesión</Text>
      </TouchableOpacity>
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
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  loginText: {
    marginTop: 20,
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

export default RegisterScreen;