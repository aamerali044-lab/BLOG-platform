import { Navigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user, status } = useAuth()
  if (status === 'checking') return <div className="page-loading">Loading…</div>
  if (!user) return <Navigate to="/login" replace />
  return children
}
