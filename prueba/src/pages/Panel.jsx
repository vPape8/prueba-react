import React, { useEffect, useState } from 'react'
import '../assets/css/panel.css'
import { useNavigate } from 'react-router-dom'

const STORAGE_KEY = 'userProfile_v2'

const defaultProfile = {
  name: '',
  email: '',
  bio: '',
  avatar: null, // data URL
}

const defaultPrefs = {
  theme: 'light',
  notifications: true,
}

const defaultHistory = []

const initialState = {
  profile: defaultProfile,
  prefs: defaultPrefs,
  history: defaultHistory,
}

const validateEmail = (email) => {
  return /^\S+@\S+\.\S+$/.test(email)
}

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

function loadCurrentUser() {
  try {
    const raw = localStorage.getItem(CURRENT_KEY)
    return raw ? JSON.parse(raw) : null
  } catch (err) {
    return null
  }
}

function saveCurrentUser(user) {
  try {
    localStorage.setItem(CURRENT_KEY, JSON.stringify(user))
    return true
  } catch (err) {
    return false
  }
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return initialState
    return JSON.parse(raw)
  } catch (err) {
    return initialState
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    return true
  } catch (err) {
    return false
  }
}

const Panel = () => {
  const navigate = useNavigate()
  const [state, setState] = useState(initialState)
  const [tab, setTab] = useState('profile')
  const [editing, setEditing] = useState(false)
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')
  const [currentUserId, setCurrentUserId] = useState(null)

  useEffect(() => {
    const s = loadState()
    // if there's a logged user, populate profile from that user
    const cur = loadCurrentUser()
    if (!cur) {
      // not logged in -> redirect to login
      navigate('/')
      return
    }

    setCurrentUserId(cur.id)

    const profileFromUser = {
      name: cur.name || '',
      email: cur.email || '',
      bio: cur.bio || '',
      avatar: cur.avatar || null,
    }

    setState((prev) => ({ ...s, profile: { ...prev.profile, ...profileFromUser } }))
  }, [])

  useEffect(() => {
    saveState(state)
  }, [state])

  const updateProfile = (patch) => setState((s) => ({ ...s, profile: { ...s.profile, ...patch } }))
  const updatePrefs = (patch) => setState((s) => ({ ...s, prefs: { ...s.prefs, ...patch } }))
  const pushHistory = (entry) =>
    setState((s) => ({ ...s, history: [{ id: Date.now(), ts: new Date().toISOString(), ...entry }, ...s.history] }))

  const handleChange = (e) => {
    const { name, value } = e.target
    updateProfile({ [name]: value })
  }

  const handleAvatar = (e) => {
    const file = e.target.files && e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      updateProfile({ avatar: reader.result })
      pushHistory({ type: 'avatar_changed' })
    }
    reader.readAsDataURL(file)
  }

  const handleSaveProfile = (e) => {
    e.preventDefault()
    const p = state.profile
    const newErrors = {}
    if (!p.name || p.name.trim() === '') newErrors.name = 'El nombre es obligatorio'
    if (!p.email || !validateEmail(p.email)) newErrors.email = 'Introduce un email válido'

    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    pushHistory({ type: 'profile_saved' })
    setMessage('Perfil guardado correctamente')
    setEditing(false)
    // Update current_user and app_users
    try {
      const users = loadUsers()
      const idx = users.findIndex((u) => u.id === currentUserId || u.email === p.email)
      const updatedUser = { ...(users[idx] || {}), id: currentUserId || Date.now(), name: p.name, email: p.email, bio: p.bio, avatar: p.avatar }
      if (idx >= 0) {
        users[idx] = updatedUser
      } else {
        users.unshift(updatedUser)
      }
      saveUsers(users)
      saveCurrentUser(updatedUser)
      setCurrentUserId(updatedUser.id)
      try {
        window.dispatchEvent(new CustomEvent('user-changed', { detail: updatedUser }))
      } catch (err) {
        // ignore
      }
    } catch (err) {
      // ignore save errors
    }
    setTimeout(() => setMessage(''), 3000)
  }

  const handleLogout = () => {
    try {
      localStorage.removeItem(CURRENT_KEY)
    } catch (err) {
      // ignore
    }
    try {
      window.dispatchEvent(new CustomEvent('user-changed', { detail: null }))
    } catch (err) {
      // ignore
    }
    navigate('/login')
  }

  const handleResetAll = () => {
    setState(initialState)
    localStorage.removeItem(STORAGE_KEY)
    setMessage('Datos reseteados')
    setTimeout(() => setMessage(''), 2500)
  }

  const addSampleHistory = () => {
    pushHistory({ type: 'sample', text: 'Acción de ejemplo añadida' })
  }

  const clearHistory = () => {
    setState((s) => ({ ...s, history: [] }))
    setMessage('Historial limpiado')
    setTimeout(() => setMessage(''), 2000)
  }

  const exportHistory = () => {
    try {
      const data = JSON.stringify(state.history, null, 2)
      const blob = new Blob([data], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'history.json'
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      setMessage('Error al exportar historial')
    }
  }

  return (
    <div className="container mt-4">
      <h1>Panel de usuario</h1>

      <div style={{ marginTop: 12 }}>
        <nav style={{ display: 'flex', gap: 8 }}>
          <button className={`btn ${tab === 'profile' ? 'btn-primary' : 'btn-light'}`} onClick={() => setTab('profile')}>
            Perfil
          </button>
          <button className={`btn ${tab === 'history' ? 'btn-primary' : 'btn-light'}`} onClick={() => setTab('history')}>
            Historial ({state.history.length})
          </button>
        </nav>

        <section style={{ marginTop: 16 }}>
          {tab === 'profile' && (
            <div style={{ maxWidth: 820 }}>
              <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                <div style={{ width: 160, textAlign: 'center' }}>
                  <div
                    style={{
                      width: 140,
                      height: 140,
                      borderRadius: '50%',
                      overflow: 'hidden',
                      background: '#f0f0f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto',
                    }}
                  >
                    {state.profile.avatar ? (
                      <img src={state.profile.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ color: '#888' }}>Sin avatar</span>
                    )}
                  </div>

                  {editing ? (
                    <label style={{ display: 'block', marginTop: 8 }}>
                      <input type="file" accept="image/*" onChange={handleAvatar} />
                    </label>
                  ) : null}
                </div>

                <div style={{ flex: 1 }}>
                  <form onSubmit={handleSaveProfile}>
                    <div style={{ marginBottom: 8 }}>
                      <label>Nombre</label>
                      <input name="name" value={state.profile.name} onChange={handleChange} className="form-control" disabled={!editing} />
                      {errors.name && <div style={{ color: 'crimson' }}>{errors.name}</div>}
                    </div>

                    <div style={{ marginBottom: 8 }}>
                      <label>Email</label>
                      <input name="email" value={state.profile.email} onChange={handleChange} className="form-control" disabled={!editing} />
                      {errors.email && <div style={{ color: 'crimson' }}>{errors.email}</div>}
                    </div>

                    <div style={{ marginBottom: 8 }}>
                      <label>Biografía</label>
                      <textarea name="bio" value={state.profile.bio} onChange={handleChange} className="form-control" disabled={!editing} />
                    </div>

                    <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                      {editing ? (
                        <>
                          <button type="submit" className="btn btn-primary">
                            Guardar
                          </button>
                          <button type="button" className="btn" onClick={() => setEditing(false)}>
                            Cancelar
                          </button>
                        </>
                      ) : (
                        <>
                          <button type="button" className="btn btn-primary" onClick={() => setEditing(true)}>
                            Editar perfil
                          </button>
                          <button type="button" className="btn btn-secondary" onClick={handleResetAll}>
                            Resetear todo
                          </button>
                        </>
                      )}
                    </div>
                  </form>
                </div>
              </div>

              {message && (
                <div style={{ marginTop: 12 }}>
                  <strong>{message}</strong>
                </div>
              )}
            </div>
          )}


          {tab === 'history' && (
            <div style={{ maxWidth: 820 }}>
              <h3>Historial de acciones</h3>
              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                <button className="btn btn-primary" onClick={addSampleHistory}>
                  Añadir acción de ejemplo
                </button>
                <button className="btn btn-secondary" onClick={exportHistory} disabled={state.history.length === 0}>
                  Exportar
                </button>
                <button className="btn btn-danger" onClick={clearHistory} disabled={state.history.length === 0}>
                  Limpiar historial
                </button>
              </div>

              {state.history.length === 0 ? (
                <div>No hay acciones registradas.</div>
              ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {state.history.map((h) => (
                    <li key={h.id} style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>
                      <div style={{ fontSize: 12, color: '#666' }}>{new Date(h.ts).toLocaleString()}</div>
                      <div>
                        <strong>{h.type}</strong>
                        {h.text ? ` — ${h.text}` : ''}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default Panel