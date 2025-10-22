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

function App() {
  return (
    <Router>
      <div className="App">
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<InicioSeccion />} />
            <Route path="/calculadora" element={<Calculadora />} />
            <Route path="/comerciales" element={<Comerciales />} /> 
            <Route path="/especiales" element={<Especiales />} />
            <Route path="/pasajeros" element={<Pasajeros/>}/>
            <Route path="/reportes" element={<Reportes />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/panel" element={<Panel />} />
          </Routes>
        </Layout>
      </div>
    </Router>
  );
}

export default App;