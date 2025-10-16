// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/style.css';

const Home = () => {
  return (
    <>
      {/* Títulos */}
      <div className="container mt-4">
        <h1 className="text-center">Bienvenido al Sistema de Cálculo de Costos Portuarios</h1>
        <p className="text-center">Utiliza el menú superior para navegar entre las secciones.</p>
      </div>

      {/* Cards de opciones */}
      <div className="container my-5">
        <div className="row g-4">
          {/* Calcular costos */}
          <div className="col-md-6">
            <div className="card shadow h-100">
              <div className="card-body">
                <h5 className="card-title">Calcular costos</h5>
                <p className="card-text">Para poder calcular los costos de estadía del buque.</p>
                <Link to="/calculadora" className="btn btn-dark">Ir a la página</Link>
              </div>
            </div>
          </div>

          {/* Generar reporte */}
          <div className="col-md-6">
            <div className="card shadow h-100">
              <div className="card-body">
                <h5 className="card-title">Generar reporte</h5>
                <p className="card-text">Para poder generar reportes de los costos y servicios prestados.</p>
                <Link to="/reportes" className="btn btn-dark">Ir a la página</Link>
              </div>
            </div>
          </div>

          {/* Configuraciones */}
          <div className="col-md-6">
            <div className="card shadow h-100">
              <div className="card-body">
                <h5 className="card-title">Configuraciones</h5>
                <p className="card-text">Texto de ejemplo para la tercera opción.</p>
                <Link to="/panel" className="btn btn-dark">Ir a la página</Link>
              </div>
            </div>
          </div>

          {/* Perfil */}
          <div className="col-md-6">
            <div className="card shadow h-100">
              <div className="card-body">
                <h5 className="card-title">Perfil</h5>
                <p className="card-text">Texto de ejemplo para la cuarta opción.</p>
                <Link to="/panel" className="btn btn-dark">Ir a la página</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;