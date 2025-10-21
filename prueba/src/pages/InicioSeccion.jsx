import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../assets/css/auth.css'

const USERS_KEY = 'app_users'
const CURRENT_KEY = 'current_user'

function loadUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (err) {
    return []
  }
}

function saveUsers(users) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
    return true
  } catch (err) {
    return false
  }
}

function setCurrent(user) {
  try {
    localStorage.setItem(CURRENT_KEY, JSON.stringify(user))
  } catch (err) {
    // ignore
  }
}

function getCurrent() {
  try {
    const raw = localStorage.getItem(CURRENT_KEY)
    return raw ? JSON.parse(raw) : null
  } catch (err) {
    return null
  }
}

const InicioSeccion = () => {
  const navigate = useNavigate()
  const [mode, setMode] = useState('login') // 'login' or 'register'
  const [users, setUsers] = useState([])
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [message, setMessage] = useState('')

  useEffect(() => {
    setUsers(loadUsers())
    const cur = getCurrent()
    if (cur) {
      // ya logueado
      navigate('/')
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const validateEmail = (email) => /^\S+@\S+\.\S+$/.test(email)

  const handleRegister = (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) {
      setMessage('Completa todos los campos')
      return
    }
    if (!validateEmail(form.email)) {
      setMessage('Email inválido')
      return
    }
    if (users.find((u) => u.email === form.email)) {
      setMessage('Ya existe un usuario con ese email')
      return
    }

    const newUser = { id: Date.now(), name: form.name, email: form.email, password: form.password }
    const next = [newUser, ...users]
    saveUsers(next)
    setUsers(next)
    setMessage('Registro exitoso. Ya puedes iniciar sesión')
    setMode('login')
    setForm({ name: '', email: '', password: '' })
  }

  const handleLogin = (e) => {
    e.preventDefault()
    if (!form.email || !form.password) {
      setMessage('Introduce email y contraseña')
      return
    }
    const user = users.find((u) => u.email === form.email && u.password === form.password)
    if (!user) {
      setMessage('Credenciales incorrectas')
      return
    }
    setCurrent(user)
    setMessage('Inicio de sesión correcto')
    // notify other components (Header) that user changed
    try {
      window.dispatchEvent(new CustomEvent('user-changed', { detail: user }))
    } catch (err) {
      // ignore
    }
    navigate('/')
  }

  const handleLogout = () => {
    localStorage.removeItem(CURRENT_KEY)
    setMessage('Sesión cerrada')
    setTimeout(() => setMessage(''), 1500)
    navigate('/login')
  }

  const fillDemo = () => {
    const demo = { id: Date.now(), name: 'Demo', email: 'demo@example.com', password: 'demo' }
    const next = [demo, ...users]
    saveUsers(next)
    setUsers(next)
    setMessage('Usuario demo creado: demo@example.com / demo')
  }

  return (
    <div className="container mt-4" style={{ maxWidth: 720 }}>
      <h2>{mode === 'login' ? 'Iniciar sesión' : 'Registro'}</h2>

      <div style={{ display: 'flex', gap: 24 }}>
        <div style={{ flex: 1 }}>
          <form onSubmit={mode === 'login' ? handleLogin : handleRegister}>
            {mode === 'register' && (
              <div style={{ marginBottom: 8 }}>
                <label>Nombre</label>
                <input name="name" value={form.name} onChange={handleChange} className="form-control" />
              </div>
            )}

            <div style={{ marginBottom: 8 }}>
              <label>Email</label>
              <input name="email" value={form.email} onChange={handleChange} className="form-control" />
            </div>

            <div style={{ marginBottom: 8 }}>
              <label>Contraseña</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} className="form-control" />
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button type="submit" className="btn btn-primary">{mode === 'login' ? 'Entrar' : 'Registrar'}</button>
              <button type="button" className="btn btn-link" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
                {mode === 'login' ? 'Crear cuenta' : 'Tengo cuenta'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={fillDemo}>Crear demo</button>
            </div>
          </form>

          {message && <div style={{ marginTop: 12 }}><strong>{message}</strong></div>}
        </div>

        <aside style={{ width: 260 }}>
          <h4>Usuarios registrados</h4>
          {users.length === 0 ? (
            <div>No hay usuarios</div>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {users.map((u) => (
                <li key={u.id} style={{ padding: '6px 0', borderBottom: '1px solid #eee' }}>
                  <div style={{ fontWeight: 600 }}>{u.name}</div>
                  <div style={{ fontSize: 12, color: '#555' }}>{u.email}</div>
                </li>
              ))}
            </ul>
          )}

          <div style={{ marginTop: 12 }}>
            <button className="btn btn-outline-primary" onClick={handleLogout}>Cerrar sesión actual</button>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default InicioSeccion
