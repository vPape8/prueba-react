import React, { useEffect, useState } from 'react'
import '../assets/css/panel.css'
import { useNavigate } from 'react-router-dom'

const defaultProfile = {
  name: '',
  email: '',
  bio: '',
  avatar: null, // data URL
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

// profile is stored inside app_users and current_user

const Panel = () => {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(defaultProfile)
  const [editing, setEditing] = useState(false)
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')
  const [currentUserId, setCurrentUserId] = useState(null)
  const [originalProfile, setOriginalProfile] = useState(null)

  useEffect(() => {
    const cur = loadCurrentUser()
    if (!cur) {
      navigate('/login')
      return
    }
    setCurrentUserId(cur.id)
    setProfile({
      name: cur.name || '',
      email: cur.email || '',
      bio: cur.bio || '',
      avatar: cur.avatar || null,
    })
  }, [])
  const updateProfile = (patch) => setProfile((p) => ({ ...p, ...patch }))

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
    }
    reader.readAsDataURL(file)
  }

  const handleSaveProfile = (e) => {
    e.preventDefault()
  const p = profile
    const newErrors = {}
    if (!p.name || p.name.trim() === '') newErrors.name = 'El nombre es obligatorio'
    if (!p.email || !validateEmail(p.email)) newErrors.email = 'Introduce un email válido'

    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    // profile saved
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

  const handleResetProfile = () => {
    const cur = loadCurrentUser()
    if (cur) {
      setProfile({
        name: cur.name || '',
        email: cur.email || '',
        bio: cur.bio || '',
        avatar: cur.avatar || null,
      })
    } else {
      setProfile(defaultProfile)
    }
    setMessage('Perfil reseteado')
    setTimeout(() => setMessage(''), 2000)
  }


  return (
    <div className="container mt-4">
      <h1>Panel de usuario</h1>

      <div style={{ marginTop: 12 }}>
        <section style={{ marginTop: 16 }}>
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
                  {profile.avatar ? (
                    <img src={profile.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                <form onSubmit={(e) => e.preventDefault()}>
                  <div style={{ marginBottom: 8 }}>
                    <label>Nombre</label>
                    <input name="name" value={profile.name} onChange={handleChange} className="form-control" disabled={!editing} />
                    {errors.name && <div style={{ color: 'crimson' }}>{errors.name}</div>}
                  </div>

                  <div style={{ marginBottom: 8 }}>
                    <label>Email</label>
                    <input name="email" value={profile.email} onChange={handleChange} className="form-control" disabled={!editing} />
                    {errors.email && <div style={{ color: 'crimson' }}>{errors.email}</div>}
                  </div>

                  <div style={{ marginBottom: 8 }}>
                    <label>Biografía</label>
                    <textarea name="bio" value={profile.bio} onChange={handleChange} className="form-control" disabled={!editing} />
                  </div>

                  <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                    {editing ? (
                      <>
                        <button type="button" className="btn btn-primary" onClick={handleSaveProfile}>
                          Guardar
                        </button>
                        <button
                          type="button"
                          className="btn"
                          onClick={() => {
                            // revert changes
                            setProfile(originalProfile || profile)
                            setOriginalProfile(null)
                            setEditing(false)
                          }}
                        >
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => {
                            setOriginalProfile(profile)
                            setEditing(true)
                          }}
                        >
                          Editar perfil
                        </button>
                        <button type="button" className="btn btn-outline-danger" onClick={handleLogout}>
                          Cerrar sesión
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
        </section>
      </div>
    </div>
  )
}

export default Panel