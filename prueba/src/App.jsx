// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import InicioSeccion from './pages/InicioSeccion';
import Calculadora from './pages/Calculadora';
import Comerciales from './pages/Comerciales';
import Especiales from './pages/Especiales';
import Pasajeros from './pages/Pasajeros';
import Reportes from './pages/Reportes';
import Contacto from './pages/Contacto';
import Panel from './pages/Panel';
import PrivateRoute from './components/PrivateRoute';
import { Navigate } from 'react-router-dom';
function App() {
  return (
    <Router>
      <div className="App">
        <Layout>
          <Routes>
                <Route path="/login" element={<InicioSeccion />} />
                <Route path="/" element={<PrivateRoute><Home/></PrivateRoute>} />
                <Route path="/calculadora" element={<PrivateRoute><Calculadora/></PrivateRoute>} />
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/comerciales" element={<PrivateRoute><Comerciales/></PrivateRoute>} /> 
                <Route path="/reportes" element={<PrivateRoute><Reportes/></PrivateRoute>} />
                <Route path="/contacto" element={<PrivateRoute><Contacto/></PrivateRoute>} />
                <Route path="/panel" element={<PrivateRoute><Panel/></PrivateRoute>} />
          </Routes>
        </Layout>
      </div>
    </Router>
  );
}

export default App;