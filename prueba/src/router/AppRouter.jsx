// src/router/AppRouter.jsx (si decides mantenerlo)
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Calculadora from '../pages/Calculadora';
import Reportes from '../pages/Reportes';
import Contacto from '../pages/Contacto';
import Panel from '../pages/Panel';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/calculadora" element={<Calculadora />} />
      <Route path="/reportes" element={<Reportes />} />
      <Route path="/contacto" element={<Contacto />} />
      <Route path="/panel" element={<Panel />} />
    </Routes>
  );
};

export default AppRouter;