// src/pages/Calculadora.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Calculadora = () => {
  return (
    <div className="container mt-4">
      <h1>Calculadoras de Costos Portuarios</h1>
      <p>Seleccione el tipo de buque para calcular los costos:</p>
      
      <div className="row mt-4">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body text-center">
              <h5 className="card-title">Buques Comerciales</h5>
              <p className="card-text">Cálculo para buques de carga general, contenedores, granel, etc.</p>
            <Link to="/comerciales" className="btn btn-primary btn-dark">
                Calcular
            </Link>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card">
            <div className="card-body text-center">
              <h5 className="card-title">Buques de Pasajeros</h5>
              <p className="card-text">Cálculo para cruceros y transbordadores de pasajeros.</p>
              <Link to="/pasajeros" className="btn btn-primary btn-dark">
                Calcular
              </Link>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card">
            <div className="card-body text-center">
              <h5 className="card-title">Buques Especiales</h5>
              <p className="card-text">Cálculo para buques de investigación, militares, pesqueros, etc.</p>
              <Link to="/especiales" className="btn btn-primary btn-dark">
                Calcular
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculadora;