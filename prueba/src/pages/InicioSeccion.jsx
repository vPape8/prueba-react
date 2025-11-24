import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../assets/css/auth.css'

// Asegúrate que esta IP es la correcta de tu EC2
const API_URL = 'http://54.88.10.118:8080/auth';

const InicioSeccion = () => {
  const navigate = useNavigate()
  const [mode, setMode] = useState('login') 
  // CAMBIO 1: Usamos 'email' en lugar de 'username'
  const [form, setForm] = useState({ email: '', password: '', rol: 'USER' })
  const [message, setMessage] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setMessage('Conectando...')
    
    // CAMBIO 2: Validación de email
    if (!form.email || !form.password) {
        setMessage('Por favor ingresa correo y contraseña');
        return;
    }

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // CAMBIO 3: Enviamos 'email' al backend
        body: JSON.stringify({ email: form.email, password: form.password })
      });

      if (response.ok) {
        const data = await response.json();
        
        // 1. Guardar Token REAL
        localStorage.setItem('token', data.token); 
        
        // 2. Guardar Usuario Visual (Legacy) usando el email como nombre
        const usuarioVisual = { 
            id: Date.now(),
            name: form.email.split('@')[0], // Usamos la parte antes del @ como nombre
            email: form.email,
            rol: 'USER' 
        };
        localStorage.setItem('current_user', JSON.stringify(usuarioVisual));

        setMessage('Inicio de sesión correcto');
        
        window.dispatchEvent(new CustomEvent('user-changed', { detail: usuarioVisual }));

        navigate('/'); 
      } else {
        setMessage('Credenciales incorrectas');
      }
    } catch (error) {
      console.error(error);
      setMessage('Error de conexión con el servidor');
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    
    if (!form.email || !form.password) {
      setMessage('Completa todos los campos')
      return
    }

    try {
      setMessage('Registrando...')
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // CAMBIO 4: Enviamos el formulario completo que ya tiene 'email'
        body: JSON.stringify(form)
      });

      if (response.ok) {
        setMessage('Registro exitoso. Ahora inicia sesión.');
        setMode('login');
        // Limpiamos el formulario manteniendo el email para facilitar el login
        setForm(prev => ({ ...prev, password: '' }));
      } else {
        // Intentamos leer el mensaje de error del backend si existe
        const errorText = await response.text();
        setMessage(errorText || 'Error al registrar. El correo podría ya existir.');
      }
    } catch (error) {
      setMessage('Error de conexión');
    }
  }

  return (
    <div className="container mt-4" style={{ maxWidth: 400 }}>
      <div className="card shadow p-4">
        <h2 className="text-center mb-4">{mode === 'login' ? 'Iniciar Sesión' : 'Registro'}</h2>
        <form onSubmit={mode === 'login' ? handleLogin : handleRegister}>
            
            {/* CAMBIO 5: Input de tipo Email */}
            <div className="mb-3">
              <label className="form-label">Correo Electrónico</label>
              <input 
                name="email" 
                type="email"
                value={form.email} 
                onChange={handleChange} 
                className="form-control" 
                placeholder="ejemplo@correo.com"
                required 
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Contraseña</label>
              <input 
                name="password" 
                type="password" 
                value={form.password} 
                onChange={handleChange} 
                className="form-control" 
                required 
              />
            </div>

            <div className="d-grid gap-2">
              <button type="submit" className="btn btn-primary">
                {mode === 'login' ? 'Entrar' : 'Registrar'}
              </button>
            </div>
            
            <div className="mt-3 text-center">
              <button 
                type="button" 
                className="btn btn-link" 
                onClick={() => {
                    setMode(mode === 'login' ? 'register' : 'login');
                    setMessage('');
                }}
              >
                {mode === 'login' ? '¿Crear cuenta?' : '¿Ya tienes cuenta?'}
              </button>
            </div>
        </form>
        {message && <div className="alert alert-info mt-3">{message}</div>}
      </div>
    </div>
  )
}

export default InicioSeccion