import React, { useEffect, useState } from 'react'
import '../assets/css/panel.css'
import { useNavigate } from 'react-router-dom'

const Panel = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState({ name: '', rol: '' })

  useEffect(() => {
    // Cargamos el usuario que guardamos en InicioSeccion.jsx
    const storedUser = localStorage.getItem('current_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate('/login'); // Si no hay usuario, fuera
    }
  }, [navigate])

  const handleLogout = () => {
    // Limpiamos TODO para cerrar sesión real
    localStorage.removeItem('token');
    localStorage.removeItem('current_user');
    
    // Disparamos evento para que la barra de navegación se entere
    window.dispatchEvent(new CustomEvent('user-changed', { detail: null }));
    
    navigate('/login');
  }

  return (
    <div className="container mt-4">
      <div className="card shadow">
        <div className="card-header bg-dark text-white">
          <h3>Panel de Usuario</h3>
        </div>
        <div className="card-body text-center">
          <div 
            style={{
                width: 100, height: 100, 
                borderRadius: '50%', background: '#ddd', 
                margin: '0 auto 20px', display: 'flex', 
                alignItems: 'center', justifyContent: 'center',
                fontSize: '40px'
            }}
          >
            👤
          </div>
          
          <h4 className="card-title">{user.name || 'Usuario'}</h4>
          <p className="card-text badge bg-info text-dark">{user.rol || 'USER'}</p>
          
          <hr />
          
          <div className="alert alert-light text-start">
            <h5>Información de Cuenta (AWS)</h5>
            <p><strong>Estado:</strong> <span className="text-success">● Conectado a Base de Datos</span></p>
            <p><strong>Permisos:</strong> Acceso a cálculo de tarifas y generación de reportes.</p>
            <small className="text-muted">* La edición de perfil está deshabilitada en esta versión.</small>
          </div>

          <button className="btn btn-danger w-100 mt-3" onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  )
}

export default Panel