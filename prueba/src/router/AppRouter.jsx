import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Calculadora from '../pages/Calculadora';
import Reportes from '../pages/Reportes';
import Contacto from '../pages/Contacto';
import Panel from '../pages/Panel';
import InicioSeccion from '../pages/InicioSeccion'; // Asegúrate de importar el Login
import PrivateRoute from '../components/PrivateRoute'; // Importar protección

const AppRouter = () => {
  return (
    <Routes>
      {/* Rutas Públicas */}
      <Route path="/" element={<InicioSeccion/>} />
      <Route path="/login" element={<InicioSeccion />} /> 
      <Route path="/contacto" element={<Contacto />} />

      {/* Rutas Privadas (Protegidas) */}
      <Route path="/calculadora" element={
        <PrivateRoute>
          <Calculadora />
        </PrivateRoute>
      } />
      <Route path="/home" element={
        <PrivateRoute>
          <Home />
        </PrivateRoute>
      } />
      
      <Route path="/reportes" element={
        <PrivateRoute>
          <Reportes />
        </PrivateRoute>
      } />
      
      <Route path="/panel" element={
        <PrivateRoute>
          <Panel />
        </PrivateRoute>
      } />
    </Routes>
  );
};

export default AppRouter;