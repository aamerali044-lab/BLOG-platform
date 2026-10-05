import { createContext, useContext, useEffect, useState } from 'react'
import * as api from '../api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [status, setStatus] = useState('checking')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setStatus('ready')
      return
    }
    api
      .getMe()
      .then(setUser)
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setStatus('ready'))
  }, [])

  const loginUser = async (credentials) => {
    const data = await api.login(credentials)
    localStorage.setItem('token', data.token)
    setUser(data.user)
  }

  const registerUser = async (details) => {
    const data = await api.register(details)
    localStorage.setItem('token', data.token)
    setUser(data.user)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, status, loginUser, registerUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
