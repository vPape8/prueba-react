import React from 'react'
import { Navigate } from 'react-router-dom'

const PrivateRoute = ({ children }) => {
  try {
    const raw = localStorage.getItem('current_user')
    if (!raw) return <Navigate to="/login" replace />
    return children
  } catch (err) {
    return <Navigate to="/login" replace />
  }
}

export default PrivateRoute
