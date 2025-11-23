import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../assets/css/auth.css'

// IP Pública de tu EC2
const API_URL = 'http://54.88.10.118:8080/auth';

const InicioSeccion = () => {
  const navigate = useNavigate()
  const [mode, setMode] = useState('login') // 'login' or 'register'
  
  // Estado del formulario adaptado al Backend (username, password)
  const [form, setForm] = useState({ username: '', password: '', rol: 'USER' })
  const [message, setMessage] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  
  const handleRegister = async (e) => {
    e.preventDefault()
    
    if (!form.username || !form.password) {
      setMessage('Completa todos los campos')
      return
    }

    try {
      setMessage('Registrando...')
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (response.ok) {
        setMessage('Registro exitoso. Ahora puedes iniciar sesión.')
        setMode('login')
        setForm({ username: '', password: '', rol: 'USER' }) // Limpiar form
      } else {
        setMessage('Error: El usuario ya existe o datos inválidos')
      }
    } catch (error) {
      console.error(error)
      setMessage('Error de conexión con el servidor')
    }
  }

  // Lógica de Login (Conectada al Backend)
  const handleLogin = async (e) => {
    e.preventDefault()
    
    if (!form.username || !form.password) {
      setMessage('Introduce usuario y contraseña')
      return
    }

    try {
      setMessage('Verificando...')
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: form.username, password: form.password })
      });

      if (response.ok) {
        const data = await response.json();
        // Guardar el token REAL del backend
        localStorage.setItem('token', data.token); 
        setMessage('Inicio de sesión correcto')
        
        // Disparar evento para actualizar cabecera si lo usas
        try {
            window.dispatchEvent(new CustomEvent('user-changed', { detail: { name: form.username } }))
        } catch (err) { /* ignore */ }

        navigate('/panel') // Redirigir al panel
      } else {
        setMessage('Credenciales incorrectas')
      }
    } catch (error) {
      console.error(error)
      setMessage('Error de conexión con el servidor')
    }
  }

  // Botón Demo (Crea un usuario admin rápido en la BD si no existe)
  const fillDemo = () => {
    setForm({ username: 'admin', password: '123', rol: 'ADMIN' })
    setMessage('Datos demo cargados. Intenta Registrar o Entrar.')
  }

  return (
    <div className="container mt-4" style={{ maxWidth: 500 }}>
      <div className="card shadow p-4">
        <h2 className="text-center mb-4">{mode === 'login' ? 'Iniciar sesión' : 'Registro'}</h2>

        <form onSubmit={mode === 'login' ? handleLogin : handleRegister}>
            
            {/* Campo Usuario (Username) */}
            <div className="mb-3">
              <label className="form-label">Usuario</label>
              <input 
                name="username" 
                value={form.username} 
                onChange={handleChange} 
                className="form-control" 
                placeholder="Ej: admin"
              />
            </div>

            {/* Campo Contraseña */}
            <div className="mb-3">
              <label className="form-label">Contraseña</label>
              <input 
                name="password" 
                type="password" 
                value={form.password} 
                onChange={handleChange} 
                className="form-control" 
              />
            </div>

            {/* Botones de Acción */}
            <div className="d-grid gap-2">
              <button type="submit" className="btn btn-primary btn-lg">
                {mode === 'login' ? 'Entrar' : 'Registrar'}
              </button>
            </div>

            <div className="d-flex justify-content-between mt-3">
              <button 
                type="button" 
                className="btn btn-link text-decoration-none" 
                onClick={() => {
                    setMode(mode === 'login' ? 'register' : 'login');
                    setMessage('');
                }}
              >
                {mode === 'login' ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
              </button>
              
              <button type="button" className="btn btn-sm btn-outline-secondary" onClick={fillDemo}>
                Demo
              </button>
            </div>
        </form>

        {/* Mensajes de Feedback */}
        {message && (
            <div className={`alert mt-3 ${message.includes('exitoso') || message.includes('correcto') ? 'alert-success' : 'alert-danger'}`} role="alert">
                {message}
            </div>
        )}
      </div>
    </div>
  )
}

export default InicioSeccion