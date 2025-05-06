// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import VitalSigns from './pages/VitalSigns';
import VitalSignsHistory from './pages/VitalSignsHistory';
import Appointments from './pages/Appointments';
import UpdateProfile from './pages/UpdateProfile'; // Importa la página

function App() {
  return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/edit" element={<UpdateProfile />} /> {/* Agrega la ruta */}
        <Route path="/vital-signs" element={<VitalSigns />} />
        <Route path="/vital-signs/history" element={<VitalSignsHistory />} />
        <Route path="/appointments" element={<Appointments />} />
        {/* Agrega aquí las demás rutas */}
      </Routes>
  );
}

export default App;