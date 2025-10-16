// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-light pt-5 pb-4">
      <div className="container text-md-left">
        <div className="row text-md-left">

          {/* Columna 1: Sobre LogistNav */}
          <div className="col-md-3 col-lg-3 col-xl-3 mx-auto mt-3">
            <h6 className="text-uppercase mb-4 fw-bold">LogistNav</h6>
            <p>
              Plataforma digital para el cálculo y gestión de costos portuarios. 
              Ayudamos a empresas navieras y operadores a optimizar procesos 
              con transparencia y eficiencia.
            </p>
          </div>

          {/* Columna 2: Navegación */}
          <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mt-3">
            <h6 className="text-uppercase mb-4 fw-bold">Navegación</h6>
            <p><Link to="/" className="text-light">Home</Link></p>
            <p><Link to="/calculadora" className="text-light">Calculadora</Link></p>
            <p><Link to="/reportes" className="text-light">Reportes</Link></p>
            <p><Link to="/contacto" className="text-light">Contacto</Link></p>
          </div>

          {/* Columna 3: Contacto */}
          <div className="col-md-3 col-lg-3 col-xl-3 mx-auto mt-3">
            <h6 className="text-uppercase mb-4 fw-bold">Contacto</h6>
            <p><i className="bi bi-geo-alt-fill"></i> Av. Costanera 1234, Valparaíso, Chile</p>
            <p><i className="bi bi-envelope-fill"></i> contacto@logistnav.com</p>
            <p><i className="bi bi-telephone-fill"></i> +56 9 1234 5678</p>
          </div>

          {/* Columna 4: Redes sociales */}
          <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mt-3">
            <h6 className="text-uppercase mb-4 fw-bold">Síguenos</h6>
            <a href="#" className="text-light me-3"><i className="bi bi-facebook"></i></a>
            <a href="#" className="text-light me-3"><i className="bi bi-instagram"></i></a>
            <a href="#" className="text-light me-3"><i className="bi bi-twitter"></i></a>
            <a href="#" className="text-light"><i className="bi bi-linkedin"></i></a>
          </div>

        </div>
      </div>

      <div className="container text-center mt-4">
        <p>&copy; 2025 LogistNav. Todos los derechos reservados.</p>
        <img src="/logo.png" alt="Logo" height="40" className="rounded mx-auto d-block" />
      </div>
    </footer>
  );
};

export default Footer;