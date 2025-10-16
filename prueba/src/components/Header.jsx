// src/components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';

const Header = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="navbar-dark">
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <img 
            src="/logo.png" 
            alt="Logo" 
            height="40" 
            className="d-inline-block me-2 logo-img" 
          />
          LogistNav
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" active>
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/calculadora">
              Calculadora
            </Nav.Link>
            <Nav.Link as={Link} to="/reportes">
              Reportes
            </Nav.Link>
          </Nav>
          
          <Nav id="dynamic-nav-items">
            {/* Aquí puedes agregar elementos dinámicos más tarde */}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;