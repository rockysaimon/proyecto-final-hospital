// frontend-mobile/App.tsx
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Importar tus pantallas
import LoginScreen from './src/screens/Auth/LoginScreen';
import RegisterScreen from './src/screens/Auth/RegisterScreen';
import MyAppointmentsScreen from './src/screens/Main/MyAppointmentsScreen';
import AppointmentsScreen from './src/screens/Main/AppointmentsScreen';
import ProfileScreen from './src/screens/Main/ProfileScreen';

// Importar el AuthProvider y useAuth
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

// Definición de tipos para la navegación
type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

type MainTabParamList = {
  'My Appointments': undefined;
  'Book Appointment': undefined;
  Profile: undefined;
};

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();

// Componente para las rutas principales (autenticadas)
function MainTabs() {
  return (
    <MainTab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'My Appointments') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Book Appointment') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'help-circle';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007bff',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <MainTab.Screen name="My Appointments" component={MyAppointmentsScreen} />
      <MainTab.Screen name="Book Appointment" component={AppointmentsScreen} />
      <MainTab.Screen name="Profile" component={ProfileScreen} />
    </MainTab.Navigator>
  );
}

// Componente principal de la aplicación con la lógica de autenticación
function AppContent() {
  // --- CAMBIO CLAVE AQUÍ: Usamos userToken e isLoading ---
  const { userToken, isLoading } = useAuth(); 

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {userToken ? ( // --- CAMBIO CLAVE AQUÍ: Verificamos userToken ---
        <MainTabs /> // Muestra las pestañas si está autenticado
      ) : (
        <AuthStack.Navigator screenOptions={{ headerShown: false }}>
          <AuthStack.Screen name="Login" component={LoginScreen} />
          <AuthStack.Screen name="Register" component={RegisterScreen} />
        </AuthStack.Navigator>
      )}
    </NavigationContainer>
  );
}

// El componente raíz que envuelve todo con AuthProvider
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});