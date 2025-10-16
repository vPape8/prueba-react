// src/components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img src="/logo.png" alt="Logo" height="40" className="d-inline-block me-2 logo-img" />
          LogistNav
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" 
                data-bs-target="#navbarNav" aria-controls="navbarNav" 
                aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link active" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/calculadora">Calculadora</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/reportes">Reportes</Link>
            </li>
          </ul>
          
          <ul className="navbar-nav" id="dynamic-nav-items">
            {/* Aquí puedes agregar elementos dinámicos más tarde */}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;