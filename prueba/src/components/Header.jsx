// src/components/Header.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';

const Header = () => {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    try {
      const raw = localStorage.getItem('current_user')
      if (raw) setUser(JSON.parse(raw))
    } catch (err) {
      // ignore
    }
    const onUserChanged = (e) => {
      try {
        const detail = e?.detail
        if (detail === undefined) {
          // storage event will be handled separately
          return
        }
        setUser(detail)
      } catch (err) {
        // ignore
      }
    }

    const onStorage = (e) => {
      if (e.key === 'current_user') {
        try {
          setUser(e.newValue ? JSON.parse(e.newValue) : null)
        } catch (err) {
          setUser(null)
        }
      }
    }

    window.addEventListener('user-changed', onUserChanged)
    window.addEventListener('storage', onStorage)

    return () => {
      window.removeEventListener('user-changed', onUserChanged)
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  const handleLogout = () => {
    try {
      localStorage.removeItem('current_user')
    } catch (err) {
      // ignore
    }
    setUser(null)
    try {
      window.dispatchEvent(new CustomEvent('user-changed', { detail: null }))
    } catch (err) {
      // ignore
    }
    navigate('/login')
  }

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
          
          <Nav id="dynamic-nav-items" className="d-flex align-items-center gap-3">
            {user ? (
              <div className="d-flex align-items-center">
                <span className="text-light me-3 fw-bold">{user.name}</span>
                <Button variant="outline-danger" size="sm" onClick={handleLogout}>Cerrar sesión</Button>
              </div>
            ) : (
              <Nav.Link as={Link} to="/login">Iniciar sesión</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;