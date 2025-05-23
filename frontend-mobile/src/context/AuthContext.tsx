// frontend-mobile/src/context/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'; // No necesitamos axios aquí para el login ahora, pero lo dejamos por si acaso
import { API_BASE_URL } from '../api/config'; // No necesitamos API_BASE_URL aquí para el login ahora
import { Alert } from 'react-native';

interface AuthContextType {
  userToken: string | null;
  isLoading: boolean;
  // Cambiamos la firma de login: ahora recibe token, nombre y correo
  login: (token: string, name: string, email: string) => Promise<void>; 
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadToken = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        setUserToken(token);
      }
    } catch (e) {
      console.error('Failed to load token from AsyncStorage:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadToken();
  }, [loadToken]);

  // --- FUNCIÓN DE LOGIN MODIFICADA ---
  // Ahora esta función solo se encarga de guardar el token y los datos del usuario en AsyncStorage
  // ya que la petición HTTP se hace en LoginScreen.
  const login = useCallback(async (token: string, name: string, email: string) => {
    setIsLoading(true);
    try {
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('user_name', name);
      await AsyncStorage.setItem('user_email', email);

      setUserToken(token);
      // Opcional: podrías poner console.log aquí si quieres ver lo que se está guardando
      console.log('AuthContext: Guardando token y datos de usuario en AsyncStorage.');
    } catch (error: any) {
      console.error('AuthContext: Error al guardar datos en AsyncStorage durante el login:', error.message);
      Alert.alert('Error interno', 'No se pudieron guardar los datos de sesión.');
      setUserToken(null);
      // Asegurarse de limpiar todo si hay un fallo al guardar
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('user_name');
      await AsyncStorage.removeItem('user_email');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('user_name');
      await AsyncStorage.removeItem('user_email');
      setUserToken(null);
    } catch (e) {
      console.error('Failed to clear token from AsyncStorage:', e);
      Alert.alert('Error', 'No se pudo cerrar la sesión completamente.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = React.useMemo(() => ({
    userToken,
    isLoading,
    login,
    logout,
  }), [userToken, isLoading, login, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};